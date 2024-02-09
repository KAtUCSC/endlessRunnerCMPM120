//

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.spritesheet('spaceship', './assets/spaceship.png', {
            frameWidth: 16,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 3
        })
    }

    create() {
        console.log('Menu: create')
        //animations
        this.anims.create({
            key: 'thrust',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('spaceship', {
                start: 0,
                end: 3,
                first: 0
            }),
            frameRate: 20
        })

        //menu text
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
        this.add.text(game.config.width/2, game.config.height/2-30, 'GRAVITY WELL IMMINENT', menuText).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2+2, 'PRESS ←→ TO BEGIN NAVIGATION', menuText).setOrigin(0.5)

        //keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.started = false

        this.spaceship = new Spaceship(this, game.config.width/2, game.config.height*7/8, 'spaceship').setScale(2)
        this.spaceship.anims.play('thrust')
    }

    update() {
        this.spaceship.update()
        //console.log(Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT))
        let inputs = Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)
        if(inputs && !this.started) {
            this.started = true
            this.spaceship.setTargetY(game.config.height/2)
            //remove/fade out text, have ship move from near bottom to screen center
            console.log('starting play scene')
            //this.scene.start('playScene')
            this.startCall = this.time.delayedCall(3000, () => {this.scene.start('playScene')}, null, this)
        }
    }
}