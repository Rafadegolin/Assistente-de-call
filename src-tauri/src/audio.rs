use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::{Arc, Mutex};
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct AudioRecorder {
    is_recording: Arc<Mutex<bool>>,
    base_dir: PathBuf,
}

impl AudioRecorder {
    pub fn new() -> Self {
        let mut base_dir = std::env::temp_dir();
        base_dir.push("assistente-call");
        let _ = std::fs::create_dir_all(&base_dir);
        
        println!("📁 Diretório base: {:?}", base_dir);
        
        AudioRecorder {
            is_recording: Arc::new(Mutex::new(false)),
            base_dir,
        }
    }
    
    pub fn get_base_dir(&self) -> String {
        self.base_dir.to_string_lossy().to_string()
    }

    pub fn start_recording(&self) -> Result<(), String> {
        let host = cpal::default_host();
        
        let device = host
            .default_input_device()
            .ok_or("Nenhum dispositivo de entrada disponível")?;

        println!("🎤 Dispositivo: {}", device.name().unwrap());

        let config = device
            .default_input_config()
            .map_err(|e| format!("Erro ao obter configuração: {}", e))?;

        println!("⚙️ Config: {:?}", config);

        let spec = hound::WavSpec {
            channels: config.channels(),
            sample_rate: config.sample_rate().0,
            bits_per_sample: 16,
            sample_format: hound::SampleFormat::Int,
        };

        let is_recording = Arc::clone(&self.is_recording);
        let is_recording_stream = Arc::clone(&self.is_recording);
        let base_dir = self.base_dir.clone();
        let chunk_duration = 5u64;

        *is_recording.lock().unwrap() = true;

        std::thread::spawn(move || {
            // Usar Arc<Mutex> para compartilhar o writer
            let current_writer: Arc<Mutex<Option<hound::WavWriter<std::io::BufWriter<std::fs::File>>>>> = Arc::new(Mutex::new(None));
            let current_writer_clone = Arc::clone(&current_writer);
            
            let samples_written = Arc::new(Mutex::new(0u64));
            let samples_written_clone = Arc::clone(&samples_written);
            
            let samples_per_chunk = (config.sample_rate().0 as u64 * chunk_duration) * config.channels() as u64;

            let device_clone = host.default_input_device().unwrap();
            let config_clone = device_clone.default_input_config().unwrap();

            let stream = device_clone
                .build_input_stream(
                    &config_clone.into(),
                    move |data: &[f32], _: &cpal::InputCallbackInfo| {
                        if !*is_recording_stream.lock().unwrap() {
                            return;
                        }

                        let mut samples = samples_written_clone.lock().unwrap();
                        let mut writer_guard = current_writer_clone.lock().unwrap();

                        // Criar novo chunk se necessário
                        if writer_guard.is_none() || *samples >= samples_per_chunk {
                            // Fechar writer anterior
                            if writer_guard.is_some() {
                                *writer_guard = None;
                                println!("✅ Chunk finalizado");
                            }

                            // Criar novo arquivo
                            let timestamp = SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_millis();
                            
                            let mut chunk_path = base_dir.clone();
                            chunk_path.push(format!("chunk_{}.wav", timestamp));

                            if let Ok(writer) = hound::WavWriter::create(&chunk_path, spec) {
                                println!("🎙️ Novo chunk: {:?}", chunk_path);
                                *writer_guard = Some(writer);
                                *samples = 0;
                            }
                        }

                        // Escrever samples
                        if let Some(ref mut writer) = *writer_guard {
                            for &sample in data {
                                let amplitude = (sample * i16::MAX as f32) as i16;
                                let _ = writer.write_sample(amplitude);
                            }
                            *samples += data.len() as u64;
                        }
                    },
                    |err| eprintln!("❌ Erro no stream: {}", err),
                    None,
                )
                .unwrap();

            stream.play().unwrap();
            
            // Manter stream vivo
            while *is_recording.lock().unwrap() {
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
            
            // Finalizar último chunk
            *current_writer.lock().unwrap() = None;
            println!("🛑 Gravação finalizada");
        });

        Ok(())
    }

    pub fn stop_recording(&self) -> Result<(), String> {
        *self.is_recording.lock().unwrap() = false;
        std::thread::sleep(std::time::Duration::from_millis(200));
        println!("⏹️ Gravação parada");
        Ok(())
    }
}
