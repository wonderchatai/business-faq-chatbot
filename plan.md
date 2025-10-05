### AI Chatbot App Development Plan

This document outlines the steps to create, and deploy an AI-powered FAQ chatbot for a hair salon business.

#### 1. Project Scaffolding and CI/CD

- **Action:** Create a `workflow_dispatch` GitHub Actions workflow named `bootstrap-app.yml`.
- **Purpose:** To bootstrap the entire application structure in a single, automated step.
- **Steps within the workflow:**
    1.  Use `npx create-hono@latest` with the `x-create-hono-vite-react-cloudflare-pages` template to generate the project structure. This sets up a Hono backend and a React (Next.js compatible) frontend, optimized for Cloudflare Pages.
    2.  Generate a comprehensive `.gitignore` file to exclude `node_modules`, build artifacts (`.wrangler`, `dist`, `out`), and local environment files.
    3.  Commit and push the bootstrapped project files to the repository.

- **Action:** Create a second GitHub Actions workflow named `publish.yml`.
- **Purpose:** To build and deploy the application to Cloudflare Pages.
- **Steps within the workflow:**
    1.  Trigger on pushes to the `main` branch.
    2.  Install dependencies using `npm install`.
    3.  Build the project using `npm run build`. This will compile the frontend and backend into a Cloudflare Pages-compatible format, resulting in a `_workers.js` file in the output directory.
    4.  Use the `cloudflare/wrangler-action` to deploy the application. This action will be configured to point to the build output directory. Secrets will be used for Cloudflare API tokens and account ID.

#### 2. Content Generation

- **Action:** Create a system prompt for the chatbot.
- **File:** `app/src/system-prompt.txt`
- **Content:** The prompt will define the chatbot's persona as a helpful assistant for a hair salon. It will be instructed to answer questions based on a provided FAQ list and to maintain a friendly, professional tone.

- **Action:** Create a list of sample FAQs.
- **File:** `app/srcLAG.md`
- **Content:** A markdown file containing frequently asked questions and their answers, relevant to a hair salon (e.g., "What are your hours?", "How do I book an appointment?", "What are your prices for a haircut?").

#### 3. Backend Development (Hono)

- **Action:** Define an API endpoint for chat.
- **File:** `app/routes/api/chat.tsx`
- **Logic:**
    1.  Create a `POST` route at `/api/chat`.
    2.  The endpoint will receive a JSON object with the user's message (e.g., `{ "message": "Hello" }`).
    3.  It will read the system prompt from `app/src/system-prompt.txt`.
    4.  It will construct a request body compliant with the OpenAI API format, including the system prompt and the user's message.
    5.  It will use `fetch` to proxy the request to a placeholder URL for an OpenAI-compatible LLM.
    6.  The response from the LLM will be streamed back to the frontend.

#### 4. Frontend Development (Next.js)

- **Action:** Build the chat user interface.
- **File:** `app/routes/index.tsx`
- **UI Components:**
    1.  A chat window to display the conversation history.
    2.  A text input field for the user to type their message.
    3.  A "Send" button.
- **Styling:** Bootstrap will be used for a clean and responsive layout.

- **Action:** Implement frontend logic.
- **Logic:**
    1.  Manage the conversation state (messages, loading status).
    2.  On "Send", make a `POST` request to the `/api/chat` backend endpoint.
    3.  Handle the streaming response and update the chat window in real-time.
