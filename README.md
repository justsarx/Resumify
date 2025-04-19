# [ResumiFy: AI-Powered Resume Screening and Candidate Matching Platform 🚀](https://resumify.up.railway.app/)

[![Project Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)](https://github.com/your-github-username/your-repo-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Django-green?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20API-purple?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

---

![ResumiFy Demo](./frontend/public/Resumify.gif)  

## ✨ Overview
**ResumiFy** is an AI-powered web platform that revolutionizes the recruitment process through two key functionalities:

1. **Resume Screening & Analysis**: Provides instant AI-driven feedback on resumes, including:
   - Resume score (1-10)
   - Detailed review of strengths and weaknesses
   - ATS (Applicant Tracking System) friendliness assessment
   - Actionable improvement suggestions

2. **Smart Candidate Matching**: Enables recruiters to find the perfect candidates by:
   - AI-powered job-candidate matching
   - Advanced filtering and search capabilities
   - Candidate profile management
   - Direct communication channels

This project leverages the **Google Gemini API** for intelligent resume evaluation and candidate matching, built with a modern tech stack to provide a responsive and efficient user experience.

---

## 🌟 Key Features

### For Job Seekers:
- **Resume Upload & Analysis** – Upload resumes in PDF format and receive comprehensive AI feedback
- **Resume Scoring** – Get an overall quality score (1-10) with detailed breakdown
- **ATS Compatibility Check** – Ensure your resume passes automated screening systems
- **Improvement Suggestions** – Receive actionable recommendations to enhance your resume
- **Profile Management** – Create and maintain a professional profile for recruiters
- **Job Matching** – Get matched with relevant job opportunities based on your profile

### For Recruiters:
- **Smart Candidate Search** – Find candidates using AI-powered matching algorithms
- **Advanced Filtering** – Filter candidates by skills, experience, education, and more
- **Resume Analysis** – Get AI-generated insights about candidate resumes
- **Candidate Management** – Save and organize potential candidates
- **Direct Communication** – Connect with candidates through the platform
- **Job Posting** – Create and manage job listings with detailed requirements

---

## 🛠️ Tech Stack

### **Frontend:**
- [**React.js**](https://reactjs.org/) – Interactive and dynamic user interface
- [**Vite**](https://vitejs.dev/) – Fast frontend development and build tooling
- [**Axios**](https://axios-http.com/) – HTTP requests to the backend API
- [**Ant Design**](https://ant.design/) – Modern UI components and design system
- [**Tailwind CSS**](https://tailwindcss.com/) – Utility-first CSS framework
- [**React Router**](https://reactrouter.com/) – Client-side routing
- [**Framer Motion**](https://www.framer.com/motion/) – Animation library
- [**Headless UI**](https://headlessui.com/) – Unstyled, accessible UI components

### **Backend:**
- [**Django**](https://www.djangoproject.com/) – High-level Python web framework
- [**Django REST Framework**](https://www.django-rest-framework.org/) – RESTful API development
- [**Python**](https://www.python.org/) – Backend programming language
- [**PyPDF2**](https://pypdf2.readthedocs.io/en/stable/) – PDF text extraction

### **AI & NLP:**
- [**Google Gemini API**](https://ai.google.dev/) – AI-driven resume analysis and matching
- [**google-generativeai Python library**](https://pypi.org/project/google-generativeai/) – API interaction library

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone [repository-url]  # Replace with your repository URL
cd ResumiFy  # Navigate to project directory
```

### **2. Backend Setup (Django)**
```bash
cd resume_ranking_backend  # Navigate to the backend folder
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate virtual environment (Linux/macOS)
# venv\Scripts\activate (Windows)

pip install -r requirements.txt  # Install dependencies
```

#### **Configure Environment Variables**
Create a `.env` file in `resume_ranking_backend` and add:
```ini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE  # Replace with your actual API key
```

#### **Run Database Migrations**
```bash
python manage.py makemigrations resume_app
python manage.py migrate resume_app
```

#### **Start the Backend Server**
```bash
python manage.py runserver
```
Backend runs at: **http://127.0.0.1:8000/**

---

### **3. Frontend Setup (React)**
```bash
cd ../frontend  # Navigate to the frontend folder
npm install  # Install dependencies
```

#### **Configure Frontend Environment Variables**
Create a `.env.local` file in `frontend` and add:
```ini
VITE_BACKEND_API_URL=http://localhost:8000  # Backend URL
```

#### **Run Frontend Development Server**
```bash
npm run dev  # Start frontend development server
```
Frontend runs at: **http://localhost:5173/**

---

## 🚀 Usage

### For Job Seekers:
1. Create an account and complete your profile
2. Upload your resume in PDF format
3. Receive AI-powered analysis and suggestions
4. Get matched with relevant job opportunities
5. Connect with recruiters directly through the platform

### For Recruiters:
1. Create a recruiter account
2. Post job listings with detailed requirements
3. Use the AI-powered search to find candidates
4. Review candidate profiles and resumes
5. Connect with potential candidates
6. Manage your candidate pipeline

---

## 🤝 Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make changes and commit:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

Please follow the project's coding guidelines.

---

## 📜 License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).


---

🎉 **Happy Resume Building!** 🎉

