use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub objections: Vec<String>,
    pub important_points: Vec<String>,
    pub sentiment: String,
    pub suggestions: Vec<String>,
}

#[derive(Clone)]
pub struct OpenAIService {
    api_key: String,
    client: reqwest::Client,
}

impl OpenAIService {
    pub fn new(api_key: String) -> Self {
        OpenAIService {
            api_key,
            client: reqwest::Client::new(),
        }
    }

    pub async fn analyze_transcription(&self, text: &str) -> Result<AnalysisResult, String> {
        let prompt = format!(
            "Analise esta transcricao e retorne JSON com objections, important_points, sentiment e suggestions. Transcricao: {}",
            text
        );

        let request_body = json!({
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": "Responda APENAS em JSON valido."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 500
        });

        let response = self
            .client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await
            .map_err(|e| format!("Erro: {}", e))?;

        if !response.status().is_success() {
            return Err("Erro na API".to_string());
        }

        let response_json: serde_json::Value = response
            .json()
            .await
            .map_err(|e| format!("Erro: {}", e))?;

        let content = response_json["choices"][0]["message"]["content"]
            .as_str()
            .ok_or("Erro")?;

        let clean = content.trim().to_string();
        let clean = clean.replace("```json", "");
        let clean = clean.replace("```", "");
        let clean = clean.trim();

        let analysis: AnalysisResult = serde_json::from_str(&clean)
            .map_err(|e| format!("Erro: {}", e))?;

        Ok(analysis)
    }
}