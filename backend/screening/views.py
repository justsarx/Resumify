# views.py

import os
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Resume, JobPost
from .serializers import ResumeSerializer, JobPostSerializer, RegisterSerializer, LoginSerializer
from .ai_module import analyze_resume
from rest_framework.decorators import action


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})
        

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'username': user.username})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by('-upload_date')
    serializer_class = ResumeSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        job_title = request.data.get('job_title')

        # Check if a resume with this email already exists
        try:
            existing_resume = Resume.objects.get(email=email)
            # Update the existing resume
            serializer = self.get_serializer(existing_resume, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            resume_instance = serializer.save(job_title=job_title)
            status_code = status.HTTP_200_OK
        except Resume.DoesNotExist:
            # Create a new resume
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            resume_instance = serializer.save(job_title=job_title)
            status_code = status.HTTP_201_CREATED

        # Store the file path for later deletion
        resume_file_path = resume_instance.resume_file.path

        try:
            # Run full AI analysis
            analysis_result = analyze_resume(resume_file_path, analysis_type="full", job_title=job_title)

            if analysis_result:
                resume_instance.score = analysis_result.get('score')
                resume_instance.review = analysis_result.get('review')
                resume_instance.relevance_score = analysis_result.get('relevance_score')
                resume_instance.relevance_tips = analysis_result.get('relevance_tips')
                resume_instance.keywords = analysis_result.get('keywords')
                resume_instance.save()

                # Find matching jobs if keywords are available
                if analysis_result.get('keywords'):
                    matching_jobs = self.find_matching_jobs(resume_instance)
                    if matching_jobs:
                        resume_instance.matching_score = matching_jobs[0]['score']
                        resume_instance.save()

            # Delete the resume file after successful processing
            if os.path.exists(resume_file_path):
                os.remove(resume_file_path)

            headers = self.get_success_headers(serializer.data)
            return Response(self.get_serializer(resume_instance).data, status=status_code, headers=headers)
        except Exception as e:
            # Delete the resume file in case of error
            if os.path.exists(resume_file_path):
                os.remove(resume_file_path)
            if status_code == status.HTTP_201_CREATED:
                resume_instance.delete()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def find_matching_jobs(self, resume):
        """Find jobs that match the resume's keywords"""
        from .models import JobPost
        
        if not resume.keywords:
            return []

        resume_keywords = set([k.lower().strip() for k in resume.keywords.split(',')])
        matching_jobs = []

        for job in JobPost.objects.all():
            job_keywords = set([k.lower().strip() for k in job.skills_required.split(',')])
            
            # Calculate Jaccard similarity
            intersection = len(resume_keywords.intersection(job_keywords))
            union = len(resume_keywords.union(job_keywords))
            score = intersection / union if union > 0 else 0
            
            if score > 0.3:  # Only include jobs with significant match
                matching_jobs.append({
                    'job': job,
                    'score': score,
                    'matching_keywords': list(resume_keywords.intersection(job_keywords))
                })

        # Sort by matching score
        matching_jobs.sort(key=lambda x: x['score'], reverse=True)
        return matching_jobs[:5]  # Return top 5 matches

    @action(detail=True, methods=['get'])
    def recommended_jobs(self, request, pk=None):
        """Get recommended jobs for a resume"""
        resume = self.get_object()
        matching_jobs = self.find_matching_jobs(resume)
        
        # Serialize the matching jobs
        from .serializers import JobPostSerializer
        serialized_jobs = []
        for match in matching_jobs:
            job_data = JobPostSerializer(match['job']).data
            job_data['matching_score'] = match['score']
            job_data['matching_keywords'] = match['matching_keywords']
            serialized_jobs.append(job_data)
            
        return Response(serialized_jobs)

    @action(detail=False, methods=['get'])
    def find_candidates(self, request):
        """Find candidates matching a job's requirements"""
        job_id = request.query_params.get('job_id')
        if not job_id:
            return Response({'error': 'job_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job = JobPost.objects.get(id=job_id)
            job_keywords = [k.lower().strip() for k in job.skills_required.split(',')]
            
            matching_candidates = []
            for resume in Resume.objects.all():
                if not resume.keywords:
                    continue
                    
                resume_keywords = set([k.lower().strip() for k in resume.keywords.split(',')])
                job_keywords_set = set(job_keywords)
                
                # Calculate exact match score using Jaccard similarity
                intersection = len(resume_keywords.intersection(job_keywords_set))
                union = len(resume_keywords.union(job_keywords_set))
                exact_score = intersection / union if union > 0 else 0
                
                # Calculate partial match score
                partial_matches = 0
                for job_keyword in job_keywords:
                    for resume_keyword in resume_keywords:
                        if job_keyword in resume_keyword or resume_keyword in job_keyword:
                            partial_matches += 1
                            break
                
                partial_score = partial_matches / len(job_keywords) if job_keywords else 0
                
                # Combine scores with more weight on exact matches
                combined_score = (exact_score * 0.7) + (partial_score * 0.3)
                
                # Lower threshold to 0.05 (5%) to be even more lenient
                if combined_score > 0.05:  # Only include candidates with some match
                    matching_candidates.append({
                        'resume': resume,
                        'score': combined_score,
                        'exact_matches': list(resume_keywords.intersection(job_keywords_set)),
                        'partial_matches': partial_matches,
                        'last_updated': resume.upload_date
                    })

            # Sort by combined score and then by upload date (newest first)
            matching_candidates.sort(key=lambda x: (x['score'], x['last_updated']), reverse=True)
            
            # Serialize the results
            serialized_candidates = []
            for match in matching_candidates[:30]:  # Return top 30 matches
                candidate_data = self.get_serializer(match['resume']).data
                candidate_data['matching_score'] = match['score']
                candidate_data['exact_matches'] = match['exact_matches']
                candidate_data['partial_matches'] = match['partial_matches']
                candidate_data['last_updated'] = match['last_updated']
                serialized_candidates.append(candidate_data)
                
            return Response(serialized_candidates)
            
        except JobPost.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def refresh_candidates(self, request):
        """Refresh the list of matching candidates for a job"""
        return self.find_candidates(request)


class JobPostViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return job posts created by the current user
        return JobPost.objects.filter(employer=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically set the employer to the current user
        serializer.save(employer=self.request.user)

    def perform_update(self, serializer):
        # Ensure the user can only update their own job posts
        if serializer.instance.employer != self.request.user:
            raise permissions.PermissionDenied("You can only update your own job posts.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure the user can only delete their own job posts
        if instance.employer != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own job posts.")
        instance.delete()

