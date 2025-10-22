mod audio;
mod audio_devices;
mod commands;
mod whisper;
mod groq_whisper;
mod events;
mod llm;

use commands::{
    analyze_text, get_recording_path, initialize_groq_whisper, initialize_openai,
    list_audio_devices, start_audio_capture, start_realtime_capture, stop_audio_capture,
    stop_realtime_capture, transcribe_audio, AppState,
};
use audio::AudioRecorder;
use whisper::WhisperService;
use groq_whisper::GroqWhisperService;
use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            recorder: Mutex::new(AudioRecorder::new()),
            whisper: Mutex::new(WhisperService::new()),
            groq_whisper: Arc::new(Mutex::new(None)),
            llm: Arc::new(Mutex::new(None)),
            is_realtime: Arc::new(Mutex::new(false)),
        })
        .invoke_handler(tauri::generate_handler![
            initialize_groq_whisper,
            initialize_openai,
            list_audio_devices,
            start_audio_capture,
            stop_audio_capture,
            start_realtime_capture,
            stop_realtime_capture,
            get_recording_path,
            transcribe_audio,
            analyze_text
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
