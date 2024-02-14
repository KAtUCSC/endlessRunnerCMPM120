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

        /*
        adapted from samme from the phaser form's work while answering someone's multi body question
        https://phaser.discourse.group/t/arcade-physics-create-one-sprite-with-multiple-collision-bodies-compounded-sprite/3773
        */
        //asteroids
        this.asteroidGroup = this.add.group({
            runChildUpdate: true
        })
        console.log(this.asteroidGroup)
        this.physics.add.collider([this.spaceship, this.spaceship.noseCone], this.asteroidGroup, this.handleCollision, null, this)
        //testing
        this.testFunction()
        this.testFunction()
    }

    update() {
        this.spaceship.update(true)
        //this.addAsteroid(1, 1, 100)
        //this.addAsteroid(2, 1, 100)
        //this.addAsteroid(3, 1, 100)
    }

    //add asteroid to asteroid group
    addAsteroidRandom(astSize, stun, initialVelocityY) {
        let asteroid = new Asteroid(this, Phaser.Math.Between(-32, game.config.width + 32), astSize, stun, initialVelocityY, Phaser.Math.Between(-20, 20)).setScale(2)
        this.asteroidGroup.add(asteroid)
        //console.log(this)
    }

    /*
    adapted from samme from the phaser form's work while answering someone's multi body question
    https://phaser.discourse.group/t/arcade-physics-create-one-sprite-with-multiple-collision-bodies-compounded-sprite/3773
    */
    handleCollision(shipPart, asteroid) {
        //boost asteroid away to avoid multi hits
        //get if the asteroid is on the left or right of the thing it hit, redirect it that way and give it a boost
        let bounceDir = (asteroid.x > shipPart.x) ? 1 : -1;
        asteroid.body.setVelocityX(bounceDir * (Math.abs(asteroid.body.velocity.x) + 10))
        //change velocity to down for funsies
        asteroid.body.setVelocityY(Math.abs(asteroid.body.velocity.y))

        //console.log(shipPart)
        //sync velocity changes
        let shipVelocity = shipPart.body.velocity
        this.spaceship.body.velocity.copy(shipVelocity)
        this.spaceship.noseCone.body.velocity.copy(shipVelocity)

        //falter
        this.spaceship.falter(asteroid.stun)
    }

    testFunction() {
        this.time.delayedCall(350, () => {
            this.time.delayedCall(Phaser.Math.Between(0, 350), () => {
                let asteroidSize = Phaser.Math.Between(1, 3)
                this.addAsteroidRandom(asteroidSize, asteroidSize, 100)
            })
            this.testFunction()
        })
    }
}