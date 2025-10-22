# 🔐 Setup Instructions

## Prerequisites

Before running this project, you need to set up your environment properly.

## 1. Clone the Repository

```bash
git clone https://github.com/Rafadegolin/Assistente-de-call.git
cd Assistente-de-call
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your OpenAI API key:

```env
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

> ⚠️ **IMPORTANT:** Never commit the `.env` file to Git! It's already in `.gitignore`.

## 4. Setup Python Environment

The project uses Python for the Whisper transcription. Create a virtual environment:

```bash
# Windows PowerShell
python -m venv whisper-env
.\whisper-env\Scripts\Activate.ps1

# Install Python dependencies
pip install faster-whisper openai python-dotenv
```

## 5. Download Whisper Models

The Whisper models will be automatically downloaded on first run. The models are stored in `whisper-models/` directory (excluded from Git).

## 6. Run the Application

```bash
npm run tauri dev
```

## Project Structure

```
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── services/          # Tauri services
│   └── styles/           # CSS styles
├── src-tauri/             # Rust backend
│   ├── src/              # Rust source code
│   └── *.py              # Python scripts for Whisper
├── whisper-models/        # Whisper AI models (not in Git)
├── whisper-env/          # Python virtual environment (not in Git)
├── .env                  # Environment variables (not in Git)
└── .env.example          # Example environment file
```

## Security Notes

- **Never commit API keys** to the repository
- The `.env` file contains sensitive information and must not be shared
- If you accidentally commit a secret, GitHub will block the push
- Always use `.env.example` as a template

## Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy it to your `.env` file

## Troubleshooting

### "Secret detected" error when pushing to GitHub

If you see this error:

```
remote: error: GH013: Repository rule violations found
remote: - Push cannot contain secrets
```

**Solution:**

1. Remove the `.env` file from Git: `git rm --cached .env`
2. Make sure `.env` is in `.gitignore`
3. Commit the changes: `git commit -m "Remove .env from tracking"`
4. Force push: `git push -f origin main`

### Models not downloading

Make sure you have an active internet connection and the Python environment is properly activated.

---

**Made with 💜 by VDV Tech**
