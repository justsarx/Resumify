from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Resume(models.Model):
    candidate_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    resume_file = models.FileField(upload_to='resumes/')
    upload_date = models.DateTimeField(auto_now_add=True)

    score = models.FloatField(null=True, blank=True)
    review = models.TextField(null=True, blank=True)
    keywords = models.TextField(null=True, blank=True, help_text="Comma-separated list of skills and keywords extracted from resume")

    job_title = models.CharField(max_length=100, null=True, blank=True)
    relevance_score = models.FloatField(null=True, blank=True)
    relevance_tips = models.TextField(null=True, blank=True)
    matching_score = models.FloatField(null=True, blank=True, help_text="Score indicating how well this resume matches a job")

    def __str__(self):
        return self.candidate_name

    def get_keywords_list(self):
        return [keyword.strip() for keyword in self.keywords.split(',') if keyword.strip()] if self.keywords else []

    class Meta:
        ordering = ['-upload_date']
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

class JobPost(models.Model):
    JOB_TYPES = [
        ('FT', 'Full-Time'),
        ('PT', 'Part-Time'),
        ('CT', 'Contract'),
        ('FL', 'Freelance'),
        ('IN', 'Internship'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_posts')
    company_name = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=2, choices=JOB_TYPES, default='FT')
    salary_range = models.CharField(max_length=100, null=True, blank=True, help_text="e.g., 50,000 - 70,000 USD")
    skills_required = models.TextField(help_text="Comma-separated list of skills like Python, SQL, Excel")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.employer.username}"

    def get_skills_list(self):
        return [skill.strip() for skill in self.skills_required.split(',') if skill.strip()]

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Job Post"
        verbose_name_plural = "Job Posts"
