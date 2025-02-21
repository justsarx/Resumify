import os
from dotenv import load_dotenv
import PyPDF2
import google.generativeai as genai  # Import the Gemini API library

# Load environment variables from .env file
load_dotenv()

def calculate_score(file_path):
    """
    Extracts text from the uploaded PDF and calls the Gemini API to calculate a resume score.
    Returns the score as an integer (1-10) or None if there's an error.
    """
    # Step 1: Extract text from PDF using PyPDF2 (same as before - good part!)
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
        return None  # Return None to indicate failure

    if not text: # Check if text extraction actually resulted in text
        print("No text extracted from PDF.")
        return None

    # Step 2: Get the Gemini API key and Configure Gemini API
    gemini_api_key = os.environ.get('GEMINI_API_KEY')
    if not gemini_api_key:
        print("Gemini API key not set in environment variables (GEMINI_API_KEY).")
        return None

    genai.configure(api_key=gemini_api_key) # Configure Gemini API with the key
    model = genai.GenerativeModel('gemini-pro') # Use 'gemini-pro' model


    # Step 3: Prepare the prompt for Gemini API -  Crucial for getting score!
    prompt_text = f"""
    Evaluate the following resume text and provide a score from 1 to 10,
    where 10 is an excellent resume and 1 is a very poor resume.
    Focus on clarity, conciseness, ATS freindlyness, relevance to typical job requirements,
    and overall presentation. Just return the score as a single integer number, no explanation needed.

    Resume Text:
    {text}
    """

    # Step 4: Call the Gemini API using the google-generativeai library
    try:
        response = model.generate_content(prompt_text)
        score_text = response.text.strip()

        try:
            score = int(score_text)
            if 1 <= score <= 10:
                return score
            else:
                print(f"Gemini returned score out of range: {score}")
                return None # Indicate invalid score range
        except ValueError:
            print(f"Gemini returned non-numeric score: {score_text}")
            return None # Indicate non-numeric score
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None # Indicate API call error
