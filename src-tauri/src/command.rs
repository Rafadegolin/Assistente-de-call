use tauri::State;
use std::sync::Mutex;
use crate::audio::AudioRecorder;

// Estado compartilhado para o gravador
pub struct AppState {
    pub recorder: Mutex<AudioRecorder>,
}

#[tauri::command]
pub async fn start_audio_capture(state: State<'_, AppState>) -> Result<String, String> {
    let recorder = state.recorder.lock().unwrap();
    recorder.start_recording()?;
    Ok("Gravação iniciada".to_string())
}

#[tauri::command]
pub async fn stop_audio_capture(state: State<'_, AppState>) -> Result<String, String> {
    let recorder = state.recorder.lock().unwrap();
    recorder.stop_recording()?;
    Ok("Gravação parada".to_string())
}

#[tauri::command]
pub async fn transcribe_audio(audio_path: String) -> Result<String, String> {
    // Aqui você vai integrar com AssemblyAI, Deepgram ou Whisper local
    // Por enquanto, retorna um mock
    Ok("Transcrição de teste: Esta é uma chamada de vendas...".to_string())
}

#[tauri::command]
pub async fn analyze_text(text: String) -> Result<serde_json::Value, String> {
    // Aqui você vai integrar com LLM para análise
    // Por enquanto, retorna um mock
    Ok(serde_json::json!({
        "objections": ["Preço muito alto", "Não temos orçamento agora"],
        "important_points": ["Cliente interessado em demo", "Decisor é o CFO"],
        "sentiment": "neutral"
    }))
}
