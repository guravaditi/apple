# Adaptive Learning Content System - Backend

This is the backend for the Adaptive Learning System, built with **FastAPI**, **Supabase**, and **Google Gemini**.

## Features

- **Document Ingestion**: Supports raw text and file uploads (PDF support included).
- **Adaptive AI Generation**: Creates Flashcards, Quizzes, and Deep-Dive articles from source material.
- **Quota System**: Limits AI generation per user.
- **Secure**: Uses Supabase Auth and RLS.

## Setup

1. **Clone & Install**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Environment Functions**
   Copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (Service Role key recommended for backend, or Anon if using strictly RLS with passed tokens)
   - `GEMINI_API_KEY`

3. **Database Setup**
   Run the SQL from `schema.sql` in your Supabase SQL Editor.
   *Note: Ensure you have enabled the 'uuid-ossp' extension.*

4. **Run Server**
   ```bash
   uvicorn main:app --reload
   ```

## API Usage

- `POST /ingest/text`: Upload raw text.
- `POST /ingest/file-reference`: Link a file uploaded to Supabase Storage.
- `POST /generate`: request `{ "document_id": "...", "type": "flashcards" | "quiz" | "deep-dive" }`

## Notes
- "Hackathon-grade" architecture: Monolithic logic, direct API calls, simple quotas.
