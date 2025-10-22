import sys
import json
import time
import os
from faster_whisper import WhisperModel
from collections import deque

class RealtimeTranscriber:
    def __init__(self, model_size="base", language="pt"):
        # Usar diretório de usuário para cache dos modelos
        models_dir = os.path.join(os.path.expanduser("~"), ".cache", "whisper-models")
        os.makedirs(models_dir, exist_ok=True)
        
        self.model = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
            download_root=models_dir  # MUDANÇA: usar diretório do usuário
        )
        self.language = language
        self.buffer = deque(maxlen=10)
        
    def transcribe_chunk(self, audio_path):
        """
        Transcreve um chunk de áudio
        """
        try:
            segments, info = self.model.transcribe(
                audio_path,
                language=self.language,
                beam_size=5,
                vad_filter=True,
                vad_parameters=dict(
                    min_silence_duration_ms=300
                )
            )
            
            chunks = []
            for segment in segments:
                chunk = {
                    "timestamp": time.time(),
                    "start": segment.start,
                    "end": segment.end,
                    "text": segment.text.strip()
                }
                chunks.append(chunk)
                self.buffer.append(chunk)
            
            return {
                "success": True,
                "chunks": chunks,
                "context": list(self.buffer)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

def main():
    """
    Modo interativo: recebe comandos via stdin
    """
    transcriber = RealtimeTranscriber()
    
    # Sinalizar que está pronto
    print(json.dumps({"status": "ready"}), flush=True)
    
    for line in sys.stdin:
        try:
            command = json.loads(line.strip())
            
            if command["action"] == "transcribe":
                audio_path = command["audio_path"]
                result = transcriber.transcribe_chunk(audio_path)
                print(json.dumps(result, ensure_ascii=False), flush=True)
                
            elif command["action"] == "change_language":
                transcriber.language = command["language"]
                print(json.dumps({"success": True}), flush=True)
                
            elif command["action"] == "exit":
                break
                
        except Exception as e:
            error = {"success": False, "error": str(e)}
            print(json.dumps(error), flush=True)

if __name__ == "__main__":
    main()
