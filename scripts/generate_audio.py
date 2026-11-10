import os
import json
import math
import numpy as np
import soundfile as sf

def generate_ambient_bed(output_path, duration_seconds=240, sample_rate=24000):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    t = np.linspace(0, duration_seconds, int(sample_rate * duration_seconds), endpoint=False)
    
    # 3B1B warm harmonic chords (C2, G2, Eb3, Bb3, C4)
    freqs = [65.41, 98.00, 155.56, 233.08, 261.63]
    audio = np.zeros_like(t)
    
    for i, f in enumerate(freqs):
        lfo = 0.5 + 0.5 * np.sin(2 * np.pi * (0.07 + 0.02 * i) * t)
        sine = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * (f * 1.003) * t)
        weight = 1.0 / (i + 1)
        audio += weight * sine * lfo

    audio = audio / np.max(np.abs(audio) + 1e-6)
    audio = audio * 0.22
    
    fade_len = int(4.0 * sample_rate)
    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)
    audio[:fade_len] *= fade_in
    audio[-fade_len:] *= fade_out

    sf.write(output_path, audio.astype(np.float32), sample_rate)
    print(f"Generated warm 3B1B ambient bed at {output_path} ({duration_seconds}s)")

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    manifest_path = os.path.join(root_dir, "scripts", "narration_manifest.json")
    audio_out_dir = os.path.join(root_dir, "public", "audio")
    timings_out_path = os.path.join(root_dir, "src", "audioTimings.json")
    
    model_path = os.path.join(root_dir, "scripts", "tts_assets", "kokoro-v1.0.onnx")
    voices_path = os.path.join(root_dir, "scripts", "tts_assets", "voices-v1.0.bin")

    os.makedirs(audio_out_dir, exist_ok=True)
    os.makedirs(os.path.dirname(timings_out_path), exist_ok=True)

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    print("Initializing Kokoro TTS Engine...")
    tts = None
    try:
        from kokoro_onnx import Kokoro
        if os.path.exists(model_path) and os.path.exists(voices_path):
            tts = Kokoro(model_path, voices_path)
            print("Kokoro-82M ONNX model successfully loaded.")
        else:
            print("Kokoro model assets not found locally.")
    except Exception as e:
        print(f"Failed to load Kokoro-82M: {e}")

    timings = {}
    fps = 30

    scene_map = {
        "scene1_intro": "scene1",
        "scene2_mathTheory": "scene2",
        "scene3_frameSetup": "scene3",
        "scene4_divisionWalkthrough": "scene4",
        "scene5_receiverValid": "scene5",
        "scene6_receiverError": "scene6",
    }

    for scene_id, data in manifest["scenes"].items():
        text = data["text"]
        voice = data.get("voice", "bm_george")
        speed = data.get("speed", 1.0)
        
        out_wav = os.path.join(audio_out_dir, f"{scene_id}.wav")
        legacy_id = scene_map.get(scene_id, scene_id)
        legacy_wav = os.path.join(audio_out_dir, f"{legacy_id}.wav")

        print(f"Synthesizing {scene_id} with voice '{voice}'...")

        if tts:
            audio, sample_rate = tts.create(text, voice=voice, speed=speed, lang="en-us")
            sf.write(out_wav, audio, sample_rate)
            if legacy_wav != out_wav:
                sf.write(legacy_wav, audio, sample_rate)
        else:
            print(f"Warning: TTS not available for {scene_id}")

        info = sf.info(out_wav)
        duration_s = round(float(info.duration), 2)
        duration_frames = int(math.ceil(duration_s * fps))

        entry = {
            "title": data.get("title", ""),
            "durationInSeconds": duration_s,
            "durationInFrames": duration_frames,
            "sampleRate": info.samplerate,
            "file": f"audio/{scene_id}.wav",
        }

        timings[scene_id] = entry
        timings[legacy_id] = entry
        print(f"  -> {scene_id}: {duration_s}s ({duration_frames} frames @ {fps}fps)")

    # Synthesize Ambient Bed
    ambient_wav = os.path.join(audio_out_dir, "ambient_bed.wav")
    ambient_mp3 = os.path.join(audio_out_dir, "ambient_bed.mp3")
    total_duration = sum(timings[k]["durationInSeconds"] for k in manifest["scenes"].keys()) + 15
    generate_ambient_bed(ambient_wav, duration_seconds=max(180, total_duration))
    
    try:
        import subprocess
        subprocess.run(["ffmpeg", "-y", "-i", ambient_wav, "-b:a", "192k", ambient_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Exported ambient_bed.mp3 via FFmpeg.")
    except Exception:
        with open(ambient_wav, "rb") as fin, open(ambient_mp3, "wb") as fout:
            fout.write(fin.read())

    with open(timings_out_path, "w", encoding="utf-8") as f:
        json.dump(timings, f, indent=2)

    print(f"\nAll audio synchronized and exported to {timings_out_path}")

if __name__ == "__main__":
    main()
