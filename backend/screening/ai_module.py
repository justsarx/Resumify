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


def analyze_resume(file_path, analysis_type="both"):
    """
    Analyzes a resume from a PDF file using the Gemini API.
    
    Args:
        file_path (str): Path to the PDF resume file.
        analysis_type (str, optional): Type of analysis to perform:
            "score":  Returns only a numerical score (1-10).
            "review": Returns only a text review with improvement suggestions.
            "both":   Returns both score and review (default).
    
    Returns:
        dict or int or str or None: Output depends on analysis_type:
            - "score": integer score (1-10) or None on error.
            - "review": string review or None on error.
            - "both": dictionary with 'score' and 'review', or None on error.
            - None: on a general processing error.
    """
    
    if not gemini_api_key:
        return None  # Exit early if API key is missing

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

    results = {}  # Dictionary to store results

    if analysis_type in ("score", "both"):
        # Improved scoring prompt
        score_prompt = f"""
You are an expert resume evaluator. Analyze the resume text below and return a single integer rating between 1 and 10. 
Focus on clarity, conciseness, ATS compatibility, relevance, and overall presentation. 
Ignore any formatting issues due to PDF conversion. 
If the text does not represent a resume, return 0.
Under no circumstances should you provide anything except a single integer in response.
Resume Text:
{text}
        """
        try:
            response = model.generate_content(score_prompt)
            score_text = response.text.strip()
            try:
                score = int(score_text)
                if not (0 <= score <= 10):
                    print(f"Gemini returned score out of range: {score}")
                    results['score'] = None
                else:
                    results['score'] = score
            except ValueError:
                print(f"Gemini returned non-numeric score: {score_text}")
                results['score'] = None
        except Exception as e:
            print(f"Error calling Gemini API for scoring: {e}")
            results['score'] = None

    if analysis_type in ("review", "both"):
        # Improved review prompt
        review_prompt = f"""
You are an expert resume reviewer. Evaluate the resume text below and provide a constructive review in plain text (no bullet points or formatting), limited to 100 words. 
Focus on ATS compatibility, clarity, and relevance to common job requirements. 
Offer data-driven insights and personalized improvement suggestions. 
Disregard any formatting errors from PDF conversion.
Resume Text:
{text}
        """
        try:
            response = model.generate_content(review_prompt)
            review_text = response.text.strip()
            results['review'] = review_text
        except Exception as e:
            print(f"Error calling Gemini API for review: {e}")
            results['review'] = None

    # Return results based on analysis_type
    if analysis_type == "score":
        return results.get('score')
    elif analysis_type == "review":
        return results.get('review')
    elif analysis_type == "both":
        if results.get('score') is None and results.get('review') is None:
            return None
        return results
    else:
        print(f"Invalid analysis_type: {analysis_type}. Returning None.")
        return None


if __name__ == '__main__':
    # Example usage (ensure you have a resume.pdf file and GEMINI_API_KEY in .env)
    resume_file = 'resume.pdf'  # Update with your resume file path

    if os.path.exists(resume_file):
        print(f"Analyzing resume: {resume_file}")

        # Get Score
        score_result = analyze_resume(resume_file, analysis_type="score")
        if score_result is not None:
            print(f"Resume Score: {score_result}/10")
        else:
            print("Could not calculate resume score.")

        print("-" * 30)

        # Get Review
        review_result = analyze_resume(resume_file, analysis_type="review")
        if review_result:
            print("Resume Review:")
            print(review_result)
        else:
            print("Could not generate resume review.")

        print("-" * 30)

        # Get Both Score and Review
        both_results = analyze_resume(resume_file, analysis_type="both")
        if both_results:
            if both_results.get('score') is not None:
                print(f"Resume Score (Combined): {both_results['score']}/10")
            else:
                print("Could not calculate combined resume score.")
            if both_results.get('review'):
                print("Resume Review (Combined):")
                print(both_results['review'])
            else:
                print("Could not generate combined resume review.")
        else:
            print("Could not perform combined score and review.")
    else:
        print(f"Error: {resume_file} not found. Please update the file path or place a resume.pdf file in the directory.")
