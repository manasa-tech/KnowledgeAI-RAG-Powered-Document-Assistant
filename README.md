# 🧠 KnowledgeAI – AI-Powered Document Assistant

KnowledgeAI is an AI-powered document assistant that uses Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) to answer questions from uploaded documents. Users can upload PDFs, generate summaries, ask questions, and create quizzes from their study materials.

## 🚀 Features

- 📄 Upload and analyze PDF documents.
- 💬 Ask questions about uploaded documents.
- 📝 Generate concise document summaries.
- 🎯 Create quizzes and practice questions.
- 🔍 Retrieve relevant information using semantic search.
- 📚 Generate context-aware answers with source references.
- 🖥️ Run the LLM locally using Ollama.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- CSS

**Backend**
- Python
- FastAPI

**AI & Machine Learning**
- Large Language Models (LLMs)
- Retrieval-Augmented Generation (RAG)
- Sentence Transformers
- LangChain
- Ollama
- Gemma 3

**Vector Database**
- ChromaDB

**Document Processing**
- PyPDF

## 🏗️ System Architecture

1. **Document Upload:** The user uploads a PDF.
2. **Text Extraction:** PyPDF extracts text from the document.
3. **Text Chunking:** The extracted text is divided into smaller chunks.
4. **Embedding Generation:** Sentence Transformers converts chunks into vector embeddings.
5. **Vector Storage:** ChromaDB stores the embeddings for semantic search.
6. **Question Processing:** The user's question is converted into an embedding.
7. **Relevant Retrieval:** ChromaDB retrieves the most relevant document chunks.
8. **Answer Generation:** The retrieved context is sent to the Gemma LLM through Ollama.
9. **Response Display:** The frontend displays the generated answer and relevant sources.

## 📁 Project Structure

```text
KnowledgeAI/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   ├── uploads/
│   └── chroma_db/
│
├── .gitignore
└── README.md
```

*Note: The structure may change as the project develops. The `.env` file should contain secrets only when required and must not be committed to GitHub.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Python 3.10 or newer
- Node.js and npm
- Git
- Ollama

Install Ollama from the official website: https://ollama.com/download

### 1. Download the Project

```bash
git clone https://github.com/YOUR_USERNAME/KnowledgeAI.git
cd KnowledgeAI
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Download the LLM

```bash
ollama pull gemma3:4b
```

Make sure Ollama is running before using the application.

### 3. Set Up the Backend

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the required packages:

```bash
python -m pip install --upgrade pip
pip install fastapi "uvicorn[standard]" python-multipart pypdf sentence-transformers chromadb ollama langchain langchain-ollama
```

Save the installed dependencies:

```bash
pip freeze > requirements.txt
```

Start the backend:

```bash
python -m uvicorn main:app --reload
```

The backend should be available at:

`http://127.0.0.1:8000`

FastAPI documentation:

`http://127.0.0.1:8000/docs`

### 4. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in your terminal, usually:

`http://localhost:5173`

## 🔄 How RAG Works

KnowledgeAI uses Retrieval-Augmented Generation to provide answers grounded in uploaded documents.

**User Question → Embedding Generation → Semantic Search → Relevant Context Retrieval → LLM Response → Answer with Sources**

This approach helps the model answer using the document's content instead of relying only on its general knowledge.

## 🎯 Use Cases

- Student study assistance
- Research paper analysis
- Notes summarization
- Interview preparation
- Quiz and flashcard generation
- Document question answering

## 🔮 Future Enhancements

- Support for DOCX and TXT files.
- Conversation history and chat memory.
- Multiple document support.
- Multilingual question answering.
- Voice-based interaction.
- Improved source citations.
- User authentication and document management.

## 🔐 Security

- Validate uploaded files and enforce size limits.
- Never upload API keys, passwords, or private credentials to GitHub.
- Add `.env`, `.venv/`, `chroma_db/`, and uploaded private documents to `.gitignore` as appropriate.
- Keep uploaded documents private and provide a way to delete them.

## 👩‍💻 Author

**Your Name**

GitHub: `https://github.com/YOUR_USERNAME`

## 📄 License

This project can be distributed under the MIT License. Add a `LICENSE` file if you choose to use that license.
