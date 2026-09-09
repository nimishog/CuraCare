#!/usr/bin/env python3
"""
Generate synthetic test audio file (silent WAV) using built-in wave module
"""
import wave
import struct

# WAV parameters
sample_rate = 16000
duration = 5  # seconds
channels = 1
sample_width = 2  # 16-bit
num_frames = sample_rate * duration

# Create silent frames (all zeros)
frames = b'\x00' * (num_frames * channels * sample_width)

output_path = "tests/fixtures/test_audio.wav"
with wave.open(output_path, 'wb') as wav_file:
    wav_file.setnchannels(channels)
    wav_file.setsampwidth(sample_width)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(frames)

print(f"Created {output_path}: {duration}s, {sample_rate}Hz, {channels} channel(s), {sample_width*8}-bit")