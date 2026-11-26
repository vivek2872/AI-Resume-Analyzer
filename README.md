# AI Resume Analyzer (GenAI + LLM)

A student project built with React + FastAPI. Upload a PDF/DOCX resume, optionally paste a job description, and receive extracted details, skill analysis, matching score, skill gaps, role suggestions, and improvement feedback.

## Requirements
- Python 3.10+
- Node.js 18+
- Optional: Google Gemini API key for LLM-generated feedback

## 1. Backend setup (Windows PowerShell)
Open a terminal in the project folder:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --port 8000
```

If PowerShell blocks activation, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

Backend API: http://127.0.0.1:8000
API docs: http://127.0.0.1:8000/docs

## 2. Frontend setup
Open a SECOND terminal in the project folder:

```powershell
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

## 3. Enable Gemini (optional)
Get an API key from Google AI Studio, then place it in `backend/.env`:
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```
Restart the backend. Without a key, the project still works using local rule-based analysis; the UI will identify that AI feedback is in fallback mode.

## How to use
1. Open the website.
2. Upload your resume in PDF or DOCX format.
3. Optionally paste a target job description.
4. Click **Analyze Resume**.
5. Review the score, extracted details, skills, gaps and recommendations.

## Project structure
```
AI_Resume_Analyzer/
  backend/
    app/main.py
    requirements.txt
    .env.example
  frontend/
    src/App.jsx
    src/main.jsx
    src/style.css
    package.json
    index.html
```

## Notes
- Resume matching score is an indicative keyword/skill overlap score, not a hiring decision or guarantee.
- Check extracted text after upload; scanned/image-only PDFs may need OCR, which is not included.
- Avoid uploading sensitive personal information unless you are comfortable processing it. If Gemini is enabled, resume text is sent to Google's Gemini API for feedback.
- This is an educational prototype, not a validated recruitment or applicant-tracking system.
