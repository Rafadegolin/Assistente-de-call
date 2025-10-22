use cpal::traits::{DeviceTrait, HostTrait};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AudioDeviceInfo {
    pub name: String,
    pub is_default: bool,
}

/// Lista todos os dispositivos de entrada de áudio disponíveis
pub fn list_input_devices() -> Result<Vec<AudioDeviceInfo>, String> {
    let host = cpal::default_host();
    
    let default_device = host.default_input_device();
    let default_name = default_device
        .as_ref()
        .and_then(|d| d.name().ok());
    
    let mut devices = Vec::new();
    
    for device in host.input_devices().map_err(|e| e.to_string())? {
        if let Ok(name) = device.name() {
            let is_default = Some(&name) == default_name.as_ref();
            devices.push(AudioDeviceInfo {
                name,
                is_default,
            });
        }
    }
    
    Ok(devices)
}

/// Obtém um dispositivo de entrada pelo nome
pub fn get_input_device_by_name(device_name: &str) -> Result<cpal::Device, String> {
    let host = cpal::default_host();
    
    for device in host.input_devices().map_err(|e| e.to_string())? {
        if let Ok(name) = device.name() {
            if name == device_name {
                return Ok(device);
            }
        }
    }
    
    Err(format!("Dispositivo '{}' não encontrado", device_name))
}
