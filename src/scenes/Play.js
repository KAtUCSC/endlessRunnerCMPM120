//asteroid fall, can hit ship
//ship falters every hit

//

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
        this.spaceship = new Spaceship(this, game.config.width/2, game.config.height*4/8, 'spaceship').setScale(2)
        
        //asteroids
        this.asteroidGroup = this.add.group()
        console.log(this.asteroidGroup)
        this.physics.add.collider(this.spaceship, this.asteroidGroup)
        //testing
    }

    update() {
        this.spaceship.update(true)
        this.addAsteroid(1, 1, 100)
        //this.addAsteroid(2, 1, 100)
        //this.addAsteroid(3, 1, 100)
    }

    //add asteroid to asteroid group
    addAsteroid(astSize, stun, initialVelocity) {
        let asteroid = new Asteroid(this, astSize, stun, initialVelocity)
        this.asteroidGroup.add(asteroid)
    }
}