import sys
import json
from faster_whisper import WhisperModel

def transcribe_audio(audio_path, language="pt"):
    """
    Transcreve um arquivo de áudio usando Faster-Whisper
    """
    try:
        # Inicializar modelo
        # Opções: tiny, base, small, medium, large-v3
        # Para tempo real, use 'base' ou 'small'
        model = WhisperModel(
            "base",
            device="cpu",  # Use "cuda" se tiver GPU NVIDIA
            compute_type="int8",  # Otimizado para CPU
            download_root="./whisper-models"  # Cache dos modelos
        )
        
        # Transcrever
        segments, info = model.transcribe(
            audio_path,
            language=language,
            beam_size=5,
            vad_filter=True,  # Voice Activity Detection
            vad_parameters=dict(
                min_silence_duration_ms=500
            )
        )
        
        # Coletar segmentos
        transcription = []
        for segment in segments:
            transcription.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip()
            })
        
        # Retornar JSON
        result = {
            "success": True,
            "language": info.language,
            "language_probability": info.language_probability,
            "duration": info.duration,
            "segments": transcription,
            "full_text": " ".join([seg["text"] for seg in transcription])
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Uso: python whisper_service.py <caminho_audio> [idioma]"
        }))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "pt"
    
    transcribe_audio(audio_path, language)
