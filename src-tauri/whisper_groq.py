# -*- coding: utf-8 -*-
import sys
import json
import os
from groq import Groq

# Garantir UTF-8 no stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def transcribe_with_groq(audio_path, api_key):
    try:
        # Verificar se arquivo existe
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Arquivo não encontrado: {audio_path}")
        
        # Verificar tamanho mínimo (evitar arquivos vazios)
        file_size = os.path.getsize(audio_path)
        if file_size < 1000:  # menos de 1KB
            raise ValueError(f"Arquivo muito pequeno: {file_size} bytes")
        
        client = Groq(api_key=api_key)
        
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3-turbo",
                language="pt",
                response_format="verbose_json"
            )
        
        result = {
            "success": True,
            "full_text": transcription.text,
            "language": "pt",
            "duration": getattr(transcription, 'duration', 0)
        }
        
        print(json.dumps(result, ensure_ascii=False), flush=True)
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"{type(e).__name__}: {str(e)}"
        }
        print(json.dumps(error_result, ensure_ascii=False), flush=True)
        sys.stderr.write(f"ERRO: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "error": "Uso: python whisper_groq.py <audio_path> <api_key>"
        }))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    api_key = sys.argv[2]
    
    transcribe_with_groq(audio_path, api_key)
