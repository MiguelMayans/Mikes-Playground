"""this is the main file for the audio translator project"""

import gradio as gr


def translator():
    pass


web = gr.Interface(
    fn=translator,
    inputs=gr.Audio(sources=["microphone"],
                    type="filepath"),
    outputs=[],
    title="Audio Translator",
    description="Voice Transalator made with Brais Tutorial on Youtube",
)

web.launch()
