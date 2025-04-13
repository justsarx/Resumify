#ai_module.py
import os
from dotenv import load_dotenv
import PyPDF2
import google.generativeai as genai

# Load environment variables
load_dotenv()
gemini_api_key = os.environ.get('GEMINI_API_KEY')
if not gemini_api_key:
    print("Gemini API key not set in environment variables (GEMINI_API_KEY).")
else:
    genai.configure(api_key=gemini_api_key)  # Configure Gemini API once if key is available
    model = genai.GenerativeModel('gemini-2.0-flash')  # Define model once

def analyze_resume(file_path, analysis_type="both", job_title=None, job_keywords=None):
    """
    Analyzes a resume from a PDF file using the Gemini API.

    Args:
        file_path (str): Path to the PDF resume file.
        analysis_type (str, optional): Type of analysis to perform: "score", "review", "both", or "full".
        job_title (str, optional): If provided, performs job title relevance analysis.
        job_keywords (list, optional): List of keywords from job posting for matching.

    Returns:
        dict: Dictionary with available keys: score, review, relevance_score, relevance_tips, keywords, matching_score
    """

    if not gemini_api_key:
        return None

    # Step 1: Extract text from PDF
    try:
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

    if not text:
        print("No text extracted from PDF.")
        return None

    results = {}

    # Keywords Extraction
    if analysis_type in ("full",):
        keywords_prompt = (
            "Extract a list of relevant skills, technologies, and keywords from the resume text below. "
            "Return ONLY a comma-separated list of keywords, with no additional text or formatting. "
            "Focus on technical skills, programming languages, tools, frameworks, and relevant experience.\n\n"
            "Resume Text:\n"
            f"{text}"
        )
        try:
            response = model.generate_content(keywords_prompt)
            results['keywords'] = response.text.strip()
        except Exception as e:
            print(f"Gemini keywords extraction error: {e}")
            results['keywords'] = None

    # Matching Score Calculation
    if job_keywords and results.get('keywords'):
        try:
            resume_keywords = set([k.lower().strip() for k in results['keywords'].split(',')])
            job_keywords_set = set([k.lower().strip() for k in job_keywords])
            
            # Calculate Jaccard similarity
            intersection = len(resume_keywords.intersection(job_keywords_set))
            union = len(resume_keywords.union(job_keywords_set))
            matching_score = intersection / union if union > 0 else 0
            
            results['matching_score'] = matching_score
        except Exception as e:
            print(f"Error calculating matching score: {e}")
            results['matching_score'] = None

    # Score Analysis (plain integer, no extra text)
    if analysis_type in ("score", "both", "full"):
        score_prompt = (
            "You are an expert resume evaluator. Analyze the resume text below and respond "
            "ONLY with a single integer between 1 and 10 (inclusive) that represents the "
            "overall quality of the resume based solely on clarity, conciseness, ATS compatibility, "
            "relevance, and presentation. Do not include any additional text, commentary, or formatting.\n\n"
            "Resume Text:\n"
            f"{text}"
        )
        try:
            response = model.generate_content(score_prompt)
            score_text = response.text.strip()
            # Ensure the response is a single integer.
            score = int(score_text) if score_text.isdigit() else None
            results['score'] = score if score is not None and 0 <= score <= 10 else None
        except Exception as e:
            print(f"Gemini scoring error: {e}")
            results['score'] = None

    # Review Analysis (plain text review, no bullet points or formatting)
    if analysis_type in ("review", "both", "full"):
        review_prompt = (
            "You are an expert resume reviewer. Evaluate the resume text below and provide a plain "
            "text review in no more than 100 words. Do not use bullet points, lists, or any formatting; "
            "simply provide the review as plain text. Do not include extra commentary or tags.\n\n"
            "Resume Text:\n"
            f"{text}"
        )
        try:
            response = model.generate_content(review_prompt)
            results['review'] = response.text.strip()
        except Exception as e:
            print(f"Gemini review error: {e}")
            results['review'] = None

    # Relevance Analysis (split response into two parts)
    if job_title and analysis_type in ("full",):
        relevance_prompt = (
            "You are an expert job application assistant. Evaluate the resume text below for how well "
            "it matches the job title \"" + job_title + "\". Respond EXACTLY in two lines. In the FIRST line, "
            "output ONLY a single integer between 0 and 10 (inclusive) representing the relevance score. In the "
            "SECOND line, provide a plain text paragraph (under 75 words) with suggestions on how the candidate can "
            "better tailor the resume for the job. Do not include any extra text, labels, or formatting.\n\n"
            "Resume Text:\n"
            f"{text}"
        )
        try:
            response = model.generate_content(relevance_prompt)
            reply = response.text.strip()
            # Split reply into lines; the first line should be the score.
            lines = reply.splitlines()
            if lines:
                score_line = lines[0].strip()
                relevance_score = int(score_line) if score_line.isdigit() else None
                suggestions = ""
                if len(lines) > 1:
                    suggestions = " ".join(line.strip() for line in lines[1:]).strip()
                results['relevance_score'] = relevance_score if relevance_score is not None and 0 <= relevance_score <= 10 else None
                results['relevance_tips'] = suggestions
            else:
                results['relevance_score'] = None
                results['relevance_tips'] = None
        except Exception as e:
            print(f"Gemini relevance analysis error: {e}")
            results['relevance_score'] = None
            results['relevance_tips'] = None

    return results if results else None
