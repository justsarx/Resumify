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
    genai.configure(api_key=gemini_api_key) # Configure Gemini API once if key is available
    model = genai.GenerativeModel('gemini-2.0-flash') # Define model once


def analyze_resume(file_path, analysis_type="both"):
    """
    Analyzes a resume from a PDF file, providing a score, review, or both using the Gemini API.

    Args:
        file_path (str): The path to the PDF resume file.
        analysis_type (str, optional):  Type of analysis to perform.
            "score":  Returns only a numerical score (1-10).
            "review": Returns a text-based review with improvement suggestions.
            "both":   Returns both score and review (default).
            Defaults to "both".

    Returns:
        dict or int or str or None:  Returns different output based on analysis_type:
            - If "score": returns an integer score (1-10) or None on error.
            - If "review": returns a string with the review or None on error.
            - If "both": returns a dictionary with 'score' and 'review' keys, or None on error.
            - None: if there's a general error in processing.
    """

    if not gemini_api_key:
        return None  # Return None if API key is missing (early exit after initial check in global scope)

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

    # Step 2 & 3: Prepare prompts and call Gemini API based on analysis_type
    results = {} # Dictionary to store results if analysis_type is 'both'

    if analysis_type in ("score", "both"):
        score_prompt = f"""
        Evaluate the following resume text and provide a score from 1 to 10,
        where 10 is an excellent resume and 1 is a very poor resume.
        Focus on clarity, conciseness, ATS freindlyness, relevance to typical job requirements,
        and overall presentation.
        Also keep in mind that the text you're about to evaluate is converted from a PDF file via PyPDF2. So there might be inconsistencies.
        Be harsh but fair.
        Just return the score as a single integer number, no explanation needed.
        Under no circumstances you may return a text response. Just the score. If the text is not a resume, return 0.

        Resume Text:
        {text}
        """
        try:
            response = model.generate_content(score_prompt)
            score_text = response.text.strip()
            try:
                score = int(score_text)
                if not (0 <= score <= 10): # Allow 0 in case it's not a resume
                    print(f"Gemini returned score out of range: {score}")
                    results['score'] = None # Indicate invalid score range in results dict
                else:
                    results['score'] = score # Store score in results dict
            except ValueError:
                print(f"Gemini returned non-numeric score: {score_text}")
                results['score'] = None # Indicate non-numeric score in results dict

        except Exception as e:
            print(f"Error calling Gemini API for scoring: {e}")
            results['score'] = None # Indicate API call error in results dict


    if analysis_type in ("review", "both"):
        review_prompt = f"""
        You are a Resume analysis AI. Your task is to evaluate the following resume text and provide a review of the content, with data-driven insights and personalized improvement tips.
        Evaluate the following resume text and provide a review of the content,
        focusing on ATS friendliness, clarity, and relevance to typical job requirements.
        Your response should be constructive and provide suggestions for improvement.
        Also keep in mind that the text you're about to evaluate is converted from a PDF file via PyPDF2. So there might be inconsistencies in formatting so omit them.
        The response will be only simple plaintext. No bullet points or complex formatting needed.
        Response length limit is 100 words.

        Resume Text:
        {text}
        """
        try:
            response = model.generate_content(review_prompt)
            review_text = response.text.strip()
            results['review'] = review_text # Store review in results dict
        except Exception as e:
            print(f"Error calling Gemini API for review: {e}")
            results['review'] = None # Indicate API call error in results dict

    # Step 4: Return results based on analysis_type
    if analysis_type == "score":
        return results.get('score') # Return just the score if requested
    elif analysis_type == "review":
        return results.get('review') # Return just the review if requested
    elif analysis_type == "both":
        if not results.get('score') and not results.get('review'): # Check for general error if both are requested
            return None # Return None if both score and review failed
        return results # Return the full results dictionary if both are requested
    else:
        print(f"Invalid analysis_type: {analysis_type}. Returning None.")
        return None # Handle invalid analysis_type


if __name__ == '__main__':
    # Example Usage (assuming you have a resume.pdf file and GEMINI_API_KEY in .env)
    resume_file = 'resume.pdf'  # Replace with your resume file path

    if os.path.exists(resume_file):
        print(f"Analyzing resume: {resume_file}")

        # Get Score
        score_result = analyze_resume(resume_file, analysis_type="score")
        if score_result is not None:
            print(f"Resume Score: {score_result}/10")
        else:
            print("Could not calculate resume score.")

        print("-" * 30) # Separator for clarity

        # Get Review
        review_result = analyze_resume(resume_file, analysis_type="review")
        if review_result:
            print("Resume Review:")
            print(review_result)
        else:
            print("Could not generate resume review.")

        print("-" * 30) # Separator for clarity

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
        print(f"Error: {resume_file} not found. Please place a resume.pdf file in the same directory or update the file path.")