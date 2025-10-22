use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct TranscriptionEvent {
    pub text: String,
    pub timestamp: u64,
    pub speaker: String,
}

#[derive(Clone, Serialize)]
pub struct AnalysisEvent {
    pub objections: Vec<String>,
    pub important_points: Vec<String>,
    pub sentiment: String,
    pub suggestions: Vec<String>,
}
