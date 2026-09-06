import os
import requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nova AI Backend")


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Home
# =========================

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Nova AI Backend Running 🚀"
    }


# =========================
# Health Check
# =========================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Nova AI is healthy 🚀"
    }


# =========================
# Ask Nova AI
# =========================

@app.get("/ask")
def ask(prompt: str):

    # Get OpenRouter API key
    api_key = os.getenv("OPENROUTER_API_KEY")

    # Check API key
    if not api_key:
        return {
            "success": False,
            "error": "OPENROUTER_API_KEY is not configured"
        }

    # Check empty prompt
    if not prompt.strip():
        return {
            "success": False,
            "error": "Prompt cannot be empty"
        }

    try:

        # OpenRouter API
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",

            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Nova AI"
            },

            json={
                "model": "openai/gpt-4.1-mini",

                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are Nova AI, a helpful, intelligent "
                            "and friendly AI assistant. "
                            "Answer clearly and accurately. "
                            "If the user speaks Bengali, answer in Bengali. "
                            "If the user speaks English, answer in English."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                # IMPORTANT:
                # Keep token limit low to avoid OpenRouter credit error
                "max_tokens": 2048,

                "temperature": 0.7
            },

            timeout=60
        )

        # Convert response to JSON
        data = response.json()

        # OpenRouter error
        if response.status_code != 200:

            return {
                "success": False,
                "error": data
            }

        # Make sure response contains choices
        if "choices" not in data:

            return {
                "success": False,
                "error": "Invalid response from AI provider",
                "details": data
            }

        # Get AI answer
        answer = data["choices"][0]["message"]["content"]

        # Successful response
        return {
            "success": True,
            "prompt": prompt,
            "answer": answer
        }

    except requests.exceptions.Timeout:

        return {
            "success": False,
            "error": "AI request timed out"
        }

    except requests.exceptions.ConnectionError:

        return {
            "success": False,
            "error": "Could not connect to OpenRouter"
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }