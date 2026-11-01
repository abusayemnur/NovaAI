import os
import requests
from dotenv import load_dotenv
from typing import List
from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# .env ফাইল লোড করা
load_dotenv()

app = FastAPI(title="Nova AI Backend")

# =========================
# CORS Configuration
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Request Body Models
# =========================
class Message(BaseModel):
    role: str  # 'user' অথবা 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

# =========================
# Endpoints
# =========================
@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Nova AI Backend Running 🚀"
    }

@app.post("/ask")
def ask(request: ChatRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        return {
            "success": False,
            "error": "OPENROUTER_API_KEY is not configured"
        }

    if not request.messages:
        return {
            "success": False,
            "error": "Messages list cannot be empty"
        }

    try:
        # সিস্টেম প্রম্পট (AI-কে গাইড করার জন্য)
        system_prompt = {
            "role": "system",
            "content": (
                "You are Nova AI, a helpful, intelligent and friendly AI assistant. "
                "Answer clearly and accurately. "
                "If the user speaks Bengali, answer in Bengali. "
                "If the user speaks English, answer in English."
            )
        }

        # সিস্টেম প্রম্পট এবং ইউজারের পাঠানো হিস্ট্রি একত্র করা
        formatted_messages = [system_prompt] + [msg.dict() for msg in request.messages]

        # OpenRouter API Call
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Nova AI"
            },
            json={
                "model": "openai/gpt-4o-mini",  # নিশ্চিত এবং সচল মডেল
                "messages": formatted_messages,
                "max_tokens": 2048,
                "temperature": 0.7
            },
            timeout=60
        )

        data = response.json()

        if response.status_code != 200:
            return {
                "success": False,
                "error": data
            }

        if "choices" not in data:
            return {
                "success": False,
                "error": "Invalid response from AI provider",
                "details": data
            }

        answer = data["choices"][0]["message"]["content"]

        return {
            "success": True,
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