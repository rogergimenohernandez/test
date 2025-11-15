namespace SpriteKind {
    export const Ghost = SpriteKind.create()
    export const Power = SpriteKind.create()
}
// -------- BLOQUEO CON MUROS --------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (p, muro) {
    p.x -= p.vx
p.y -= p.vy
music.thump.play()
})
// -------- CHOQUE CON FANTASMA --------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Ghost, function (_, g) {
    if (powerMode) {
        music.smallCrash.play()
        g.destroy()
    } else {
        music.siren.play()
        game.over(false)
    }
})
sprites.onOverlap(SpriteKind.Ghost, SpriteKind.Projectile, function (g, muro) {
    g.x -= g.vx
g.y -= g.vy
g.vx = 0 - g.vx
    g.vy = 0 - g.vy
})
// -------- COMER COMIDA --------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (_, food) {
    food.destroy()
    music.baDing.play()
    info.changeScoreBy(1)
})
// -------- FANTASMAS --------
function crearFantasma (color: number) {
    g = sprites.create(img`
        . . f f f . . 
        . f 1 1 1 f . 
        f 1 f 1 f 1 f 
        f 1 1 1 1 1 f 
        f 1 1 1 1 1 f 
        . f 1 1 1 f . 
        . . f f f . . 
        `, SpriteKind.Ghost)
    g.x = randint(40, 150)
    g.y = randint(40, 100)
    return g
}
// Cada # será muro, . comida, O powerball
function crearMapa () {
    for (let y = 0; y <= map.length - 1; y++) {
        for (let x = 0; x <= map[y].length - 1; x++) {
            c = map[y][x]
            // --- MUROS ---
            if (c == "#") {
                muro = sprites.create(img`
                    b b b b 
                    b b b b 
                    b b b b 
                    b b b b 
                    `, SpriteKind.Projectile)
                muro.x = x * 8 + 4
                muro.y = y * 8 + 4
                // sólido para TODOS
                muro.setFlag(SpriteFlag.Ghost, false)
                muro.setFlag(SpriteFlag.AutoDestroy, false)
            }
            // --- COMIDA ---
            if (c == ".") {
                dot = sprites.create(img`
                    . 2 . 
                    2 2 2 
                    . 2 . 
                    `, SpriteKind.Food)
                dot.x = x * 8 + 4
                dot.y = y * 8 + 4
            }
            // --- POWERBALLS ---
            if (c == "O") {
                p = sprites.create(img`
                    . 6 6 . 
                    6 6 6 6 
                    6 6 6 6 
                    . 6 6 . 
                    `, SpriteKind.Power)
                p.x = x * 8 + 4
                p.y = y * 8 + 4
            }
        }
    }
}
// -------- POWER BALLS --------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Power, function (_, p) {
    p.destroy()
    music.magicWand.play()
    powerMode = true
    powerTimer = 50
})
let powerTimer = 0
let p: Sprite = null
let dot: Sprite = null
let muro: Sprite = null
let c = ""
let powerMode = false
let ghosts: Sprite[] = []
let map: string[] = []
let g: Sprite = null
let d = ""
let muro2 = null
let dot2 = null
let q = null
// -------- ANIMACIONES PACMAN --------
let pacRight = [img`
    . . f f f . . 
    . f 5 5 5 f . 
    f 5 5 5 5 5 f 
    f 5 5 f f 5 f 
    f 5 5 5 5 5 f 
    . f 5 5 5 f . 
    . . f f f . . 
    `, img`
    . . f f f . . 
    . f 5 5 5 f . 
    f 5 5 5 5 5 f 
    f 5 5 5 f f f 
    f 5 5 5 5 5 f 
    . f 5 5 5 f . 
    . . f f f . . 
    `]
let pacLeft = [img`
    . . f f f . . 
    . f 5 5 5 f . 
    f 5 5 5 5 5 f 
    f 5 f f 5 5 f 
    f 5 5 5 5 5 f 
    . f 5 5 5 f . 
    . . f f f . . 
    `, img`
    . . f f f . . 
    . f 5 5 5 f . 
    f 5 5 5 5 5 f 
    f f f 5 5 5 f 
    f 5 5 5 5 5 f 
    . f 5 5 5 f . 
    . . f f f . . 
    `]
map = [
"####################",
"#........##........#",
"#.####...##...####.#",
"#.#  #.........#  #.#",
"#O#  #.#####.#.#  #O#",
"#.#  #.#   #.#.#  #.#",
"#......#   #......#.#",
"###.###.....###.###.#",
"#.................. #",
"##########  #########"
]
crearMapa()
// -------- PACMAN --------
let pac = sprites.create(pacRight[0], SpriteKind.Player)
controller.moveSprite(pac, 60, 60)
pac.setStayInScreen(true)
pac.x = 20
pac.y = 20
for (let i = 0; i <= 2; i++) {
    ghosts.push(crearFantasma(i))
}
game.onUpdate(function () {
    // Pac-Man
    if (pac.x < 0) {
        pac.x = 160
    }
    if (pac.x > 160) {
        pac.x = 0
    }
    // Fantasmas
    for (let j of sprites.allOfKind(SpriteKind.Ghost)) {
        if (j.x < 0) {
            j.x = 160
        }
        if (j.x > 160) {
            j.x = 0
        }
    }
})
// Animaciones
game.onUpdate(function () {
    if (controller.right.isPressed()) {
        animation.runImageAnimation(
        pac,
        pacRight,
        120,
        true
        )
    } else if (controller.left.isPressed()) {
        animation.runImageAnimation(
        pac,
        pacLeft,
        120,
        true
        )
    } else {
        animation.stopAnimation(animation.AnimationTypes.All, pac)
    }
})
// -------- GANAR --------
game.onUpdate(function () {
    if (sprites.allOfKind(SpriteKind.Food).length == 0 && sprites.allOfKind(SpriteKind.Power).length == 0) {
        game.over(true)
    }
})
game.onUpdateInterval(200, function () {
    for (let h of ghosts) {
        if (powerMode) {
            // Fantasmas huyen cuando hay powerball
            h.vx = pac.x > h.x ? -40 : 40
            h.vy = pac.y > h.y ? -40 : 40
        } else {
            // Persiguen
            h.vx = pac.x > h.x ? 40 : -40
            h.vy = pac.y > h.y ? 40 : -40
        }
    }
    if (powerMode) {
        powerTimer += -1
        if (powerTimer <= 0) {
            powerMode = false
            music.powerDown.play()
        }
    }
})
