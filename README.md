NOVA AI — Intelligent AI Personal Assistant

A Full-Stack AI Chat Application Powered by React, FastAPI, and OpenRouter

Nova AI is a software-based AI personal assistant designed to provide conversational AI interactions through a modern, responsive web interface. Built with a React frontend and a Python FastAPI backend, Nova AI connects to large language models through the OpenRouter API to generate responses to user prompts.

The project focuses on building a practical, accessible, and extensible AI assistant with a clean chat interface, backend API integration, and a foundation for future intelligent assistant capabilities.

Project Links

* GitHub Repository: https://github.com/abusayemnur/NovaAI
* Developer LinkedIn: https://www.linkedin.com/in/abusayemnur/
* AI Provider: OpenRouter
* Frontend Framework: React + Vite
* Backend Framework: FastAPI

⸻

Overview

Nova AI represents a full-stack AI application development project that combines modern frontend engineering, Python backend development, and third-party AI model integration.

The application follows a client-server architecture:

User Interface → Backend API → OpenRouter → AI Response → Chat Interface

The frontend manages user interaction and displays messages, while the backend processes requests, communicates with the configured AI model, and returns generated responses to the client.

Key Features

1. AI-Powered Conversational Interface

* Natural-language interaction through a chat-based user interface.
* AI responses generated through an OpenRouter-compatible language model.
* Support for submitting prompts and displaying generated answers.
* Conversation-focused interface designed for interactive assistance.
* Error handling for unsuccessful requests and unavailable responses.

2. Modern Frontend Application

Technology: React, Vite, JavaScript, and Tailwind CSS

* Component-based React architecture.
* Fast development workflow powered by Vite.
* Responsive chat layout for desktop and mobile browsers.
* Dedicated chat input and message display components.
* Loading indicators while AI responses are being generated.
* Sidebar interface designed for chat navigation and new conversations.
* Dark-themed interface with a modern application layout.

Note: Persistent chat history and other advanced interface features depend on their implementation in the current codebase.

3. FastAPI Backend

Technology: Python, FastAPI, Requests, and python-dotenv

* REST API for receiving user prompts.
* Backend integration with the OpenRouter chat completions API.
* JSON-based communication between frontend and backend.
* Environment-based API credential configuration.
* Exception handling and upstream API error reporting.
* CORS configuration to support frontend-backend communication.

4. Large Language Model Integration

Nova AI uses OpenRouter as its AI gateway, allowing the backend to communicate with a supported language model.

The current implementation has been configured to use:

openai/gpt-4.1-mini

The selected model can be changed to another compatible model, subject to provider availability, API access, and usage costs.

Core request workflow:

1. The user enters a prompt in the chat interface.
2. The frontend sends the prompt to the FastAPI backend.
3. The backend forwards the request to OpenRouter.
4. The configured language model generates a response.
5. The backend returns the response as JSON.
6. The frontend displays the answer in the conversation.

5. API Security and Configuration

* API credentials are intended to be stored in a local .env file or deployment environment variables.
* The API key should remain on the backend and must never be exposed in frontend source code.
* The .env file, virtual environments, and dependency-generated directories should be excluded from Git using .gitignore.
* Production deployment should use HTTPS, appropriate CORS restrictions, request validation, and suitable rate limiting.

6. Error Handling and Reliability

The application is designed to handle common integration issues, including:

* Missing API credentials.
* Unsuccessful upstream API requests.
* Invalid or missing response data.
* Backend connectivity failures.
* Loading-state management during requests.

These checks help make debugging and future improvements easier.

⸻

System Architecture

┌───────────────────────────────┐
│          User / Browser       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│     React + Vite Frontend     │
│                               │
│  Chat UI · Input · Messages   │
│  Loading State · Navigation   │
└───────────────┬───────────────┘
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│       Python FastAPI          │
│                               │
│  Request Handling             │
│  API Integration              │
│  Error Handling               │
│  Environment Configuration    │
└───────────────┬───────────────┘
                │ HTTPS
                ▼
┌───────────────────────────────┐
│        OpenRouter API         │
│                               │
│   Configured Language Model   │
└───────────────┬───────────────┘
                │
                ▼
       Generated AI Response
                │
                ▼
         Frontend Chat UI

Technology Stack

Layer	Technologies
Frontend	React, JavaScript, Vite
UI Styling	Tailwind CSS
Backend	Python, FastAPI
HTTP Requests	Requests, Fetch API
AI Integration	OpenRouter API
Configuration	python-dotenv, environment variables
Development Tools	Git, GitHub, VS Code
Deployment	Suitable frontend and Python backend hosting platforms

Project Structure

The following is a representative structure for the application; actual filenames may vary.

NovaAI/
├── backend/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Loader.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── ...
│   ├── package.json
│   └── index.html
├── .gitignore
├── requirements.txt
└── README.md

Installation and Local Setup

Prerequisites

* Python 3.9 or a compatible Python version.
* Node.js and npm.
* An OpenRouter account with an API key and access to a supported model.
* Git.

1. Clone the Repository

git clone https://github.com/abusayemnur/NovaAI.git
cd NovaAI

2. Configure the Python Environment

python3 -m venv venv
source venv/bin/activate

On Windows:

venv\Scripts\activate

Install the backend dependencies:

pip install -r requirements.txt

Ensure the requirements file contains the packages used by the backend, including FastAPI, Uvicorn, Requests, and python-dotenv.

3. Configure Environment Variables

Create a .env file in the project root:

OPENROUTER_API_KEY=your_openrouter_api_key

Replace the placeholder with your own API key.

Security: Never commit .env or publish your API key on GitHub.

4. Start the Backend

From the project root:

uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000

Check the backend status:

curl http://127.0.0.1:8000/

Test an AI request:

curl -G "http://127.0.0.1:8000/ask" \
  --data-urlencode "prompt=Hello Nova AI"

The backend should return a JSON response containing the generated reply when the API credentials and model request are valid.

5. Start the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open the local URL printed by Vite, typically:

http://localhost:5173

If the frontend uses a different API base URL, configure it to point to the running backend.

⸻

API Overview

Backend Health Check

GET /

Returns a message confirming that the backend server is running.

AI Prompt Endpoint

GET /ask?prompt=your_question

Accepts a prompt and forwards it to the configured AI model through OpenRouter.

A successful response is expected to contain a JSON field such as:

{
  "reply": "Hello! How can I help you?"
}

The exact response format depends on the backend implementation.

Production improvement: A POST endpoint with a validated JSON request body is preferable for longer prompts and more robust API design.

Development Roadmap

The following items are potential future improvements, not claims that they are already implemented.

* Conversation Management: Persistent chat history, conversation selection, renaming, and deletion.
* Streaming Responses: Display generated text incrementally as the model responds.
* Authentication: Secure user accounts and individual conversation storage.
* Long-Term Memory: Optional user-controlled preferences and contextual memory.
* Multimodal AI: Image understanding and document-based question answering where supported.
* File Uploads: Safe processing of supported documents.
* Model Selection: Allow users to select from compatible AI models.
* Production Deployment: Deploy the frontend and backend with secure environment configuration.
* Testing and Monitoring: Automated API tests, structured logging, and service health monitoring.

Testing Checklist

Before publishing a production release, verify:

* [ ]	The backend health endpoint responds successfully.
* [ ]	The .env file is loaded correctly.
* [ ]	The OpenRouter API key is valid and has the necessary access.
* [ ]	The backend returns a valid AI response.
* [ ]	The frontend successfully sends prompts to the backend.
* [ ]	AI answers appear correctly in the chat interface.
* [ ]	Loading indicators stop after successful and failed requests.
* [ ]	Missing credentials and upstream API errors are handled clearly.
* [ ]	.env and other sensitive files are excluded from Git.
* [ ]	Frontend and backend deployment URLs are configured correctly.

Project Status

Nova AI is an actively developed full-stack AI assistant project. Its current focus is reliable frontend-backend integration, language-model connectivity, and a functional chat experience. Additional capabilities can be introduced incrementally as the application evolves.

Research and Usage Disclaimer

Nova AI is an experimental software project intended for learning, development, and general-purpose AI interaction. AI-generated content may be inaccurate, incomplete, or misleading. Users should independently verify important information and avoid relying on the application as a substitute for qualified professional advice.

Author

MD. ABU SAYEM NUR

Computer Science & Technology | AI Application Development | Full-Stack Engineering

* GitHub: https://github.com/abusayemnur
* LinkedIn: https://www.linkedin.com/in/abusayemnur/

⸻

Nova AI — Building practical AI experiences through software engineering.
