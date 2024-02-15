//asteroid fall, can hit ship
//ship falters every hit

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {}

    init() {}

    create() {
        //keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        
        //bg
        this.background = this.add.sprite(0, 0, 'blackhole').setOrigin(0).setScale(2)
        this.background.play('idle')

        //ship
        this.spaceship = new Spaceship(this, game.config.width/2, game.config.height*4/8, 'spaceship')
        this.spaceship.shipScale(2)

        //death collider
        let deathZoneSize = game.config.width * 3/2
        this.deathZone = this.physics.add.sprite(game.config.width/2, game.config.height + deathZoneSize/3, 'spaceship')
        this.deathZone.body.setCircle(deathZoneSize, -deathZoneSize, -deathZoneSize*3/7)
        this.deathZone.setImmovable(true)

        //score stuff and timer
        this.scoreTimer = this.time
        let menuText = {
            fontFamily: 'Courier',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#ffffff',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }
        this.secondsPlaying = 0
        this.scoreText = this.add.text(game.config.width/2, game.config.height*1/30, this.secondsPlaying, menuText).setOrigin(0.5)
        this.playTimer = this.time.delayedCall(1000, this.updateTimer, null, this)

        /*
        adapted from samme from the phaser form's work while answering someone's multi body question
        https://phaser.discourse.group/t/arcade-physics-create-one-sprite-with-multiple-collision-bodies-compounded-sprite/3773
        */
        //asteroids
        this.asteroidGroup = this.add.group({
            runChildUpdate: true
        })
        //console.log(this.asteroidGroup)

        //colliders
        this.asteroidCollider = this.physics.add.collider([this.spaceship, this.spaceship.noseCone], this.asteroidGroup, this.handleCollision, null, this)
        this.deathCollider = this.physics.add.overlap(this.spaceship, this.deathZone, this.handleDeath, null, this)

        //start asteroids
        this.obstacleSpawner = this.time.delayedCall(100, this.startObstacles, null, this)

        //testing
    }

    update() {
        this.spaceship.update(true)
    }

    updateTimer() {
        this.secondsPlaying += 1
        this.scoreText.text = this.secondsPlaying
        this.playTimer = this.time.delayedCall(1000, this.updateTimer, null, this)
    }

    /*
    adapted from samme from the phaser form's work while answering someone's multi body question
    https://phaser.discourse.group/t/arcade-physics-create-one-sprite-with-multiple-collision-bodies-compounded-sprite/3773
    */
    handleCollision(shipPart, asteroid) {
        //boost asteroid away to avoid multi hits
        //get if the asteroid is on the left or right of the thing it hit, redirect it that way and give it a boost
        let bounceDir = (asteroid.x > shipPart.x) ? 1 : -1;
        asteroid.body.setVelocityX(bounceDir * (Math.abs(asteroid.body.velocity.x) + 100))
        //change velocity to down for funsies
        asteroid.body.setVelocityY(Math.abs(asteroid.body.velocity.y))

        //sync velocity changes
        let shipVelocity = shipPart.body.velocity
        this.spaceship.body.velocity.copy(shipVelocity)
        this.spaceship.noseCone.body.velocity.copy(shipVelocity)

        //falter
        this.spaceship.falter(asteroid.stun)
        this.spaceship.body.setVelocityY(Math.max(asteroid.size * asteroid.stun * 10, this.spaceship.body.velocity.y))
    }

    handleDeath(ship, deathZone) {
        console.log('dead')
        this.physics.world.removeCollider(this.asteroidCollider)
        this.physics.world.removeCollider(this.deathCollider)
        //console.log(this.playTimer)
        this.playTimer.paused = true
        this.spaceship.dead = true
    }

    startObstacles() {
        //start asteroid spawn loops
        this.randAstLoopTime = 3000
        this.randomAsteroidLoop()

        this.rowAstLoopTime = 5000
        this.time.delayedCall(10000, this.rowAsteroidLoop, null, this)

        this.fastAstLoopTime = 5000
        this.time.delayedCall(20000, this.fastAsteroidLoop, null, this)

        this.showerAstLoopTime = 10000
        this.time.delayedCall(30000, this.showerAsteroidLoop, null, this)

        //start player slowdown loop
        this.time.delayedCall(30000, this.slowShip, null, this)
    }

    slowShip() {
        this.spaceship.acceleration = Math.max(this.spaceship.acceleration - 1, 5)
        this.spaceship.maxSpeed = Math.max(this.spaceship.maxSpeed - 10, 50)
        console.log(this.spaceship.acceleration, this.spaceship.maxSpeed)
        this.time.delayedCall(10000, this.slowShip, null, this)
    }

    addAsteroidRandom(astSize, stun, initialVelocityY) {
        let asteroid = new Asteroid(this, Phaser.Math.Between(-32, game.config.width + 32), astSize, stun, initialVelocityY, Phaser.Math.Between(-20, 20)).setScale(2)
        this.asteroidGroup.add(asteroid)
    }

    addAsteroidRow(count, astSize, stun, initialVelocityY) {
        let maxRightSpawnPos = game.config.width - (count - 1) * 48 * (astSize)
        let startX = Phaser.Math.Between(0, maxRightSpawnPos)
        for(let i = 0; i < count; i++) {
            let asteroid = new Asteroid (this, startX + 48 * astSize * i, astSize, stun, initialVelocityY, Phaser.Math.Between(-20, 20)).setScale(2)
            this.asteroidGroup.add(asteroid)
        }

    }

    addAsteroidShower(count, astSize, stun, initialVelocityY) {
        let spawnX = Phaser.Math.Between(0, game.config.width)
        for(let i = 0; i < count; i++) {
            this.time.delayedCall(i*100, () => {
                let asteroid = new Asteroid (this, spawnX + astSize * Phaser.Math.Between(-16, 16), astSize, stun, initialVelocityY, Phaser.Math.Between(-20, 20)).setScale(2)
                this.asteroidGroup.add(asteroid)
            }, null, this)
        }
    }

    randomAsteroidLoop() {
        //console.log('random')
        this.time.delayedCall(Phaser.Math.Between(0, this.randAstLoopTime), () => {
            let asteroidSize = Phaser.Math.Between(1, 3)
            this.addAsteroidRandom(asteroidSize, asteroidSize, 100)
        })
        if(this.randAstLoopTime > 250) {
            this.randAstLoopTime -= 250
        }
        this.time.delayedCall(this.randAstLoopTime, this.randomAsteroidLoop, null, this)
    }

    rowAsteroidLoop() {
        //console.log('row')
        this.time.delayedCall(Phaser.Math.Between(0, this.rowAstLoopTime), () => {
            let asteroidSize = Phaser.Math.Between(1, 3)
            let asteroidCount = 4 - asteroidSize
            this.addAsteroidRow(asteroidCount, asteroidSize, asteroidSize, 100)
        })
        if(this.rowAstLoopTime > 1500) {
            this.rowAstLoopTime -= 250
        }
        this.time.delayedCall(this.rowAstLoopTime, this.rowAsteroidLoop, null, this)
    }

    fastAsteroidLoop() {
        //console.log('fast')
        this.time.delayedCall(Phaser.Math.Between(0, this.fastAstLoopTime), () => {
            let asteroidSize = Phaser.Math.Between(1, 2)
            this.addAsteroidRandom(asteroidSize, asteroidSize + 1, 800)
        })
        if(this.fastAstLoopTime > 1000) {
            this.fastAstLoopTime -= 250
        }
        this.time.delayedCall(this.fastAstLoopTime, this.fastAsteroidLoop, null, this)
    }

    showerAsteroidLoop() {
        //console.log('shower')
        this.time.delayedCall(Phaser.Math.Between(0, this.showerAstLoopTime), () => {
            let asteroidSize = Phaser.Math.Between(1, 2)
            let asteroidCount = Phaser.Math.Between(6, 10) - 2 * asteroidSize
            this.addAsteroidShower(asteroidCount, asteroidSize, asteroidSize, 300)
        })
        if(this.showerAstLoopTime > 1500) {
            this.showerAstLoopTime -= 250
        }
        this.time.delayedCall(this.showerAstLoopTime, this.fastAsteroidLoop, null, this)
    }
}