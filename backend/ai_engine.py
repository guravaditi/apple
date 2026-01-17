import google.generativeai as genai
from .config import settings
import json

genai.configure(api_key=settings.GEMINI_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-pro')

def generate_learning_content(text_content: str, mode: str) -> dict:
    """
    Generates adaptive learning content using Gemini.
    Modes: 'flashcards', 'quiz', 'deep-dive'
    """
    
    prompts = {
        "flashcards": """
            Analyze the following text and create a set of educational flashcards.
            Output ONLY valid JSON in the following format:
            {
                "flashcards": [
                    {"front": "Question or Term", "back": "Answer or Definition"}
                ]
            }
            Ensure the content is accurate and covers key concepts.
        """,
        "quiz": """
            Analyze the following text and create a quiz with multiple choice questions.
            Output ONLY valid JSON in the following format:
            {
                "quiz": [
                    {
                        "question": "The question text",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct_answer": "Option A",
                        "explanation": "Why this is correct"
                    }
                ]
            }
        """,
        "deep-dive": """
            Analyze the following text and generate a structured research-paper style deep dive.
            Output ONLY valid JSON in the following format:
            {
                "title": "Title of the Deep Dive",
                "abstract": "Summary of the topic",
                "sections": [
                    {
                        "heading": "Section Heading",
                        "content": "Detailed explanation...",
                        "key_points": ["Point 1", "Point 2"]
                    }
                ],
                "further_reading": ["Topic 1", "Topic 2"]
            }
            Expand on the concepts with external knowledge where appropriate but stay grounded in the source text.
        """
    }

    if mode not in prompts:
        raise ValueError(f"Invalid mode: {mode}")

    full_prompt = f"{prompts[mode]}\n\nTEXT TO PROCESS:\n{text_content}"

    try:
        response = model.generate_content(full_prompt)
        # Clean up weird markdown formatting if Gemini adds ```json ... ```
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error generating content: {e}")
        return {"error": str(e)}
