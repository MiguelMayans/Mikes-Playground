import k from "../kaplayCtx"

export function makeSonic(pos) {
  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(), // hitbox
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: 1700 }),
    {
      // estos métodos los nombramos nosotros
      ringCollectUI: null,
      setControls() {
        k.onButtonPress("jump", () => {
          if (this.isGrounded()) {
            this.play("jump")
            this.jump()
            k.play("jump", { volume: 0.5 })
          }
        })
      },
      setEvents() {
        this.onGround(() => {
          this.play("run")
        })
      },
    },
  ])

  sonic.ringCollectUI = sonic.add([
    k.text("", { font: "mania", size: 24 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(30, -10),
  ])
  return sonic
}