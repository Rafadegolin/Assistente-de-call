import sys
import json
import os
from faster_whisper import WhisperModel

def transcribe_audio(audio_path, language="pt"):
    """
    Transcreve um arquivo de áudio usando Faster-Whisper
    """
    try:
        # Usar diretório de usuário para cache dos modelos
        models_dir = os.path.join(os.path.expanduser("~"), ".cache", "whisper-models")
        os.makedirs(models_dir, exist_ok=True)
        
        print(f"📦 Cache de modelos: {models_dir}", file=sys.stderr)
        
        # Inicializar modelo
        model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8",
            download_root=models_dir  # MUDANÇA: usar diretório do usuário
        )
        
        # Transcrever
        segments, info = model.transcribe(
            audio_path,
            language=language,
            beam_size=5,
            vad_filter=True,
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
