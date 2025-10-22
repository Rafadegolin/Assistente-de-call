from faster_whisper import WhisperModel

print("🚀 Inicializando modelo Whisper...")
model = WhisperModel("tiny", device="cpu", compute_type="int8", download_root="./whisper-models")
print("✅ Modelo carregado com sucesso!")
print("📦 Sistema pronto para transcrição.")
