// contexto de kaplay

import kaplay from "kaplay"

const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true, // matiene el aspect ratio de la ventana
  background: [0, 0, 0], // color de fondo
  global: false,
  touchToMouse: true,
  buttons: {
    jump: {
      keyboard: ["space"],
      mouse: "left",
    },
  },
  debugKey: "d",
  debug: true, // acordarse de ponerlo en false al terminar el juego
})

export default k
