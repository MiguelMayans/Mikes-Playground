import k from "../kaplayCtx"

export function makeMotobug(pos) {
  return k.add([
    k.sprite("motobug", { anim: "run" }),
    k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }), // hitbox más pequeño que el sprite para que sea más fácil de esquivar
    k.scale(4),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(), // nos permite acceder a metodos para cuando el objeto sale de la pantalla
    "enemy", // un tag para identificar a los enemigos (puede ser cualquier string)
  ])
}
