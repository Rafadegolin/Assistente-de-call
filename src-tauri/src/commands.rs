use tauri::{AppHandle, Emitter, State};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use crate::audio::AudioRecorder;
use crate::whisper::{WhisperService, TranscriptionResult};
use crate::llm::{OpenAIService, AnalysisResult};
use crate::events::{TranscriptionEvent, AnalysisEvent};

pub struct AppState {
    pub recorder: Mutex<AudioRecorder>,
    pub whisper: Mutex<WhisperService>,
    pub llm: Arc<Mutex<Option<OpenAIService>>>,
    pub is_realtime: Arc<Mutex<bool>>,
}

#[tauri::command]
pub async fn initialize_openai(
    api_key: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let openai = OpenAIService::new(api_key);
    *state.llm.lock().unwrap() = Some(openai);
    Ok("OpenAI inicializado".to_string())
}

#[tauri::command]
pub async fn start_realtime_capture(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let base_dir = {
        let recorder = state.recorder.lock().unwrap();
        let dir = recorder.get_base_dir();
        recorder.start_recording()?;
        dir
    };
    
    *state.is_realtime.lock().unwrap() = true;
    
    let app_clone = app.clone();
    let base_dir_clone = base_dir.clone();
    let is_realtime_clone = Arc::clone(&state.is_realtime);
    let whisper_clone = Arc::new(Mutex::new(WhisperService::new()));
    let llm_clone = Arc::clone(&state.llm);
    
    tokio::spawn(async move {
        let mut processed_chunks = std::collections::HashSet::new();
        
        loop {
            if !*is_realtime_clone.lock().unwrap() {
                break;
            }
            
            if let Ok(entries) = std::fs::read_dir(&base_dir_clone) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.extension().and_then(|s| s.to_str()) == Some("wav") {
                        let path_str = path.to_string_lossy().to_string();
                        
                        if !processed_chunks.contains(&path_str) {
                            processed_chunks.insert(path_str.clone());
                            
                            let timestamp = SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_secs();
                            
                            let _ = app_clone.emit("new-chunk", path_str.clone());
                            
                            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
                            
                            let transcription_result = {
                                let whisper = whisper_clone.lock().unwrap();
                                whisper.transcribe_file(&path_str, "pt")
                            };
                            
                            if let Ok(result) = transcription_result {
                                if result.success && result.full_text.is_some() {
                                    let text = result.full_text.unwrap();
                                    
                                    println!("Texto: {}", text);
                                    
                                    let event = TranscriptionEvent {
                                        text: text.clone(),
                                        timestamp,
                                        speaker: "user".to_string(),
                                    };
                                    
                                    let _ = app_clone.emit("new-transcription", event);
                                    
                                    let llm_option = {
                                        let llm_guard = llm_clone.lock().unwrap();
                                        llm_guard.clone()
                                    };
                                    
                                    if let Some(llm) = llm_option {
                                        println!("Analisando...");
                                        
                                        match llm.analyze_transcription(&text).await {
                                            Ok(analysis) => {
                                                println!("Analise OK");
                                                
                                                let analysis_event = AnalysisEvent {
                                                    objections: analysis.objections,
                                                    important_points: analysis.important_points,
                                                    sentiment: analysis.sentiment,
                                                    suggestions: analysis.suggestions,
                                                };
                                                
                                                let _ = app_clone.emit("new-analysis", analysis_event);
                                            }
                                            Err(e) => {
                                                eprintln!("Erro: {}", e);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
        
        println!("Thread finalizada");
    });
    
    Ok("Real-time iniciado".to_string())
}

#[tauri::command]
pub async fn stop_realtime_capture(state: State<'_, AppState>) -> Result<String, String> {
    *state.is_realtime.lock().unwrap() = false;
    
    let recorder = state.recorder.lock().unwrap();
    recorder.stop_recording()?;
    
    Ok("Real-time parado".to_string())
}

#[tauri::command]
pub async fn analyze_text(
    text: String,
    state: State<'_, AppState>,
) -> Result<AnalysisResult, String> {
    // CORRECAO: Clonar ANTES do await
    let llm_option = {
        let llm_guard = state.llm.lock().unwrap();
        llm_guard.clone()
    };
    
    match llm_option {
        Some(openai) => openai.analyze_transcription(&text).await,
        None => Err("OpenAI nao inicializado".to_string()),
    }
}

#[tauri::command]
pub async fn start_audio_capture(state: State<'_, AppState>) -> Result<String, String> {
    let recorder = state.recorder.lock().unwrap();
    recorder.start_recording()?;
    Ok("Gravacao iniciada".to_string())
}

#[tauri::command]
pub async fn stop_audio_capture(state: State<'_, AppState>) -> Result<String, String> {
    let recorder = state.recorder.lock().unwrap();
    recorder.stop_recording()?;
    Ok("Gravacao parada".to_string())
}

#[tauri::command]
pub async fn get_recording_path(state: State<'_, AppState>) -> Result<String, String> {
    let recorder = state.recorder.lock().unwrap();
    Ok(recorder.get_base_dir())
}

#[tauri::command]
pub async fn transcribe_audio(
    audio_path: String,
    state: State<'_, AppState>,
) -> Result<TranscriptionResult, String> {
    let whisper = state.whisper.lock().unwrap();
    whisper.transcribe_file(&audio_path, "pt")
}
