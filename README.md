# 🎯 AI Call Assistant

> Real-time call transcription and intelligent analysis powered by AI

[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-Latest-orange.svg)](https://www.rust-lang.org/)

## ✨ Features

- 🎤 **Real-time Audio Capture** - Capture system audio automatically
- 📝 **Live Transcription** - Powered by Whisper AI for accurate transcription
- 🤖 **AI Analysis** - Real-time sentiment analysis and insights using OpenAI GPT
- 🎨 **Modern UI** - Beautiful, responsive interface with glassmorphism design
- 🔒 **Secure** - All processing happens locally, only API calls to OpenAI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust (latest stable)
- Python 3.8+
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/Rafadegolin/Assistente-de-call.git
cd Assistente-de-call

# Install dependencies
npm install

# Setup environment (see SETUP.md for details)
cp .env.example .env
# Edit .env and add your OpenAI API key

# Setup Python environment
python -m venv whisper-env
.\whisper-env\Scripts\Activate.ps1
pip install faster-whisper openai python-dotenv

# Run the application
npm run tauri dev
```

For detailed setup instructions, see [SETUP.md](SETUP.md)

## 🎨 Design

The application features a modern, professional design with:

- Dark theme with purple gradients
- Glassmorphism effects
- Animated backgrounds
- Real-time status indicators
- Smooth transitions and animations

For design details, see [DESIGN.md](DESIGN.md)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite 7** - Build tool

### Backend
- **Tauri 2** - Desktop framework (Rust)
- **Whisper AI** - Speech-to-text
- **OpenAI GPT** - Natural language analysis
- **Python** - AI integration

## 📁 Project Structure

```
assistente-call/
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── services/          # Tauri services
│   ├── styles/           # CSS and animations
│   └── types/            # TypeScript definitions
├── src-tauri/             # Rust backend
│   ├── src/              # Rust source code
│   └── *.py              # Python AI scripts
├── whisper-models/        # AI models (not in Git)
├── whisper-env/          # Python venv (not in Git)
└── .env                  # Environment vars (not in Git)
```

## 🔐 Security

- **Never commit** `.env` files or API keys
- Use `.env.example` as a template
- The `.gitignore` is configured to exclude sensitive files
- All secrets should be in environment variables

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Amazing desktop framework
- [OpenAI](https://openai.com/) - AI models
- [Whisper AI](https://github.com/openai/whisper) - Speech recognition
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Made with 💜 by VDV Tech**

