use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TranscriptionSegment {
    pub start: f64,
    pub end: f64,
    pub text: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TranscriptionResult {
    pub success: bool,
    pub full_text: Option<String>,
    pub error: Option<String>,
    pub language: Option<String>,
    pub duration: Option<f64>,
}

pub struct GroqWhisperService {
    api_key: String,
}

impl GroqWhisperService {
    pub fn new(api_key: String) -> Self {
        GroqWhisperService { api_key }
    }

    pub fn transcribe_file(&self, audio_path: &str) -> Result<TranscriptionResult, String> {
        // O current_dir() quando executado pelo Tauri já está na raiz do projeto
        // mas precisamos garantir que estamos na raiz, não em src-tauri
        let mut project_dir = std::env::current_dir()
            .map_err(|e| format!("Erro ao obter diretório: {}", e))?;
        
        // Se estamos em src-tauri, voltar para a raiz
        if project_dir.ends_with("src-tauri") {
            project_dir.pop();
        }
        
        let python_path = if cfg!(target_os = "windows") {
            project_dir.join("whisper-env").join("Scripts").join("python.exe")
        } else {
            project_dir.join("whisper-env").join("bin").join("python")
        };
        
        let script_path = project_dir.join("src-tauri").join("whisper_groq.py");

        println!("🐍 Python path: {:?}", python_path);
        println!("📜 Script path: {:?}", script_path);
        println!("🚀 Transcrevendo com Groq: {}", audio_path);

        let output = Command::new(&python_path)
            .args(&[
                script_path.to_str().unwrap(),
                audio_path,
                &self.api_key
            ])
            .env("PYTHONIOENCODING", "utf-8")
            .output()
            .map_err(|e| format!("❌ Erro ao executar Python: {}", e))?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            println!("❌ Erro stderr: {}", error);
            return Err(format!("Erro no script: {}", error));
        }

        // Forçar UTF-8 ao ler a saída
        let stdout = String::from_utf8(output.stdout.clone())
            .unwrap_or_else(|_| {
                println!("⚠️ Fallback para UTF-8 lossy");
                String::from_utf8_lossy(&output.stdout).to_string()
            });

        println!("📝 Stdout do Python: {}", stdout);

        let result: TranscriptionResult = serde_json::from_str(&stdout)
            .map_err(|e| format!("❌ Erro parse JSON: {}. Output: {}", e, stdout))?;

        println!("✅ Transcrição sucesso: {:?}", result.full_text);

        Ok(result)
    }
}
