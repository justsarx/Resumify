def calculate_score(file_path):
    """
    A basic keyword matching approach:
    Reads the resume file, counts the occurrence of the word 'python',
    and returns that count as a score.
    """
    try:
        with open(file_path, 'rb') as f:
            content = f.read().decode('utf-8', errors='ignore')
        # Example: score based on the occurrence of the keyword 'python'
        score = content.lower().count('python')
        return score
    except Exception as e:
        print(f"Error processing file: {e}")
        return 0.0
