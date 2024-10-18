import k from "../kaplayCtx"
import { makeSonic } from "../entities/sonic"

export default function mainMenu() {
  if (!k.getData("best-score")) k.setData("best-score", 0) // accede al local storage
  k.onButtonPress("jump", () => k.go("game")) // si presiono el boton de jump voy al juego

  // infinite background
  const bgPieceWidth = 1920
  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(bgPieceWidth * 2, 0), // la segunda pieza empieza en el final de la primera y por 2 por el scale
      k.scale(2),
      k.opacity(0.8),
    ]),
  ]

  const platformWidth = 1280
  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
    k.add([k.sprite("platforms"), k.pos(platformWidth * 4, 450), k.scale(4)]),
  ]

  k.add([
    k.text("SONIC RING RUNNER", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, 200),
  ])

  k.add([
    k.text("Press Space or Touch to Play", { font: "mania", size: 48 }),
    k.anchor("center"),
    k.pos(k.center().x, 400),
  ])

  makeSonic(k.vec2(200, 745)) // crea a sonic en la posición 200, 745

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0)
      bgPieces.push(bgPieces.shift()) // saca el primer elemento y lo pone al final
    }

    bgPieces[0].move(-100, 0)
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0)

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450)
      platforms.push(platforms.shift())
    }

    platforms[0].move(-3000, 0)
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450)
  })

  // Efecto de fondo infinito. Cuando una de las piezas del fondo sale de la pantalla por la izquierda, se mueve a una nueva posición a la derecha, justo después de la otra pieza del fondo. Luego, las piezas se reorganizan en el array para que el proceso pueda repetirse continuamente.
}
