import gradio as gr
import whisper
from translate import Translator
from dotenv import dotenv_values
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings

config = dotenv_values(".env")

ELEVEN_LABS_API_KEY = config["ELEVEN_LABS_API_KEY"]

def translator(audio_file):

    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_file, fp16=False)
        transcription = result["text"]

    except Exception as e:
        raise gr.Error(f"An error occured transcribing the audio: {e}")
    
    try:
        en_transciption = Translator(from_lang="es", to_lang="en").translate(transcription)

    except Exception as e:
        raise gr.Error(f"An error occured translating the text: {e}")
    
    client = ElevenLabs(api_key=ELEVEN_LABS_API_KEY)

    response = client.text_to_speech.convert(
        voice_id="pNInz6obpgDQGcFmaJgB",
        optimize_streaming_latency="0",
        output_format="mp3_22050_32",
        text=en_transciption,
        model_id="eleven_turbo_v2",
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
        ),
    )

    save_file_path = "audios/output.mp3"

    with open(save_file_path, "wb") as f:
        for chunk in response:
            if chunk:
                f.write(chunk)

    return save_file_path

web = gr.Interface(
    fn=translator,
    inputs=gr.Audio(sources=["microphone"],
                    type="filepath"),
    outputs=[gr.Audio()],
    title="Audio Translator",
    description="Voice Transalator made with Brais Tutorial on Youtube",
)

web.launch()
