use serde::{Deserialize, Serialize};
use std::io::{BufRead, BufReader, Write};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};

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
    pub segments: Option<Vec<TranscriptionSegment>>,
    pub error: Option<String>,
    pub language: Option<String>,
    pub duration: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
struct WhisperCommand {
    action: String,
    audio_path: Option<String>,
}

pub struct WhisperService {
    process: Option<Arc<Mutex<Child>>>,
}

impl WhisperService {
    pub fn new() -> Self {
        WhisperService { process: None }
    }

    /// Transcrição simples (um arquivo por vez)
    pub fn transcribe_file(&self, audio_path: &str, language: &str) -> Result<TranscriptionResult, String> {
        let python_cmd = if cfg!(target_os = "windows") {
            "python"
        } else {
            "python3"
        };

        println!("🎯 Transcrevendo arquivo: {}", audio_path);

        let output = Command::new(python_cmd)
            .args(&["whisper_service.py", audio_path, language])
            .output()
            .map_err(|e| format!("❌ Erro ao executar Python: {}. Certifique-se que Python está instalado e no PATH.", e))?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            return Err(format!("❌ Erro no script Python: {}", error));
        }

        let stdout = String::from_utf8(output.stdout.clone())
    .unwrap_or_else(|_| String::from_utf8_lossy(&output.stdout).to_string());
        println!("📝 Resposta do Python: {}", stdout);

        let result: TranscriptionResult = serde_json::from_str(&stdout)
            .map_err(|e| format!("❌ Erro ao parsear JSON: {}. Output: {}", e, stdout))?;

        Ok(result)
    }

    /// Iniciar modo streaming (processo persistente)
    pub fn start_realtime(&mut self) -> Result<(), String> {
        if self.process.is_some() {
            return Ok(()); // Já está rodando
        }

        let python_cmd = if cfg!(target_os = "windows") {
            "python"
        } else {
            "python3"
        };

        println!("🚀 Iniciando Whisper em modo real-time...");

        let mut child = Command::new(python_cmd)
            .args(&["whisper_realtime.py"])
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("❌ Erro ao iniciar processo Python: {}", e))?;

        // Ler linha "ready"
        if let Some(ref mut stdout) = child.stdout {
            let mut reader = BufReader::new(stdout);
            let mut ready_line = String::new();
            reader
                .read_line(&mut ready_line)
                .map_err(|e| format!("❌ Erro ao ler ready: {}", e))?;

            println!("✅ Whisper pronto: {}", ready_line);
        }

        self.process = Some(Arc::new(Mutex::new(child)));

        Ok(())
    }

    /// Parar processo streaming
    pub fn stop_realtime(&mut self) -> Result<(), String> {
        if let Some(process) = self.process.take() {
            let mut child = process.lock().unwrap();
            
            // Enviar comando de saída
            if let Some(stdin) = child.stdin.as_mut() {
                let _ = writeln!(stdin, r#"{{"action": "exit"}}"#);
            }

            // Aguardar término
            let _ = child.wait();
            println!("⏹️ Processo Whisper finalizado");
        }
        Ok(())
    }
}

impl Drop for WhisperService {
    fn drop(&mut self) {
        let _ = self.stop_realtime();
    }
}
