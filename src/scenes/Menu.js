//

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.path = './assets/'
        for (let astSize = 1; astSize <= 3; astSize++) {
            console.log(`loading asteroid size ${astSize} variants`)
            for (let astVar = 1; astVar <= 3; astVar++) {
                console.log(`loading asteroid ${astSize} ${astVar}`)
                this.load.image(`asteroid${astSize}-${astVar}`, `asteroid${astSize}-${astVar}.png`)
            }
        }

        this.load.spritesheet('spaceship', 'spaceship.png', {
            frameWidth: 16,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })
        
        this.load.spritesheet('blackhole', 'blackhole.png', {
            frameWidth: 250,
            frameHeight: 400,
            startFrame: 0,
            endFrame: 8
        })
    }

    create() {
        console.log('Menu: create')
        //animations
        this.anims.create({
            key: 'thrust',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('spaceship', {
                start: 6,
                end: 9
            }),
            frameRate: 10
        })
        
        this.anims.create({
            key: 'falter',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spaceship', {
                start: 0,
                end: 1
            }),
            frameRate: 10
        })
        
        
        this.anims.create({
            key: 'recover',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spaceship', {
                start: 2,
                end: 5
            }),
            frameRate: 10
        })
        
        //test
        this.anims.create({
            key: 'idle',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('blackhole', {
                start: 0,
                end: 7,
                first: 0
            }),
            frameRate: 10
        })

        //keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.started = false
        
        //bg
        this.background = this.add.sprite(0, 0, 'blackhole').setOrigin(0).setScale(2)
        this.moveMe = this.physics.add.sprite(0, game.config.height*3/8, 'blackhole').setOrigin(0).setScale(2).setImmovable(true)
        this.moveMe.play('idle')

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
        this.topText = this.add.text(game.config.width/2, game.config.height/2-90, 'GRAVITY WELL IMMINENT', menuText).setOrigin(0.5)
        this.bottomText = this.add.text(game.config.width/2, game.config.height/2-60, 'PRESS ←→ TO BEGIN NAVIGATION', menuText).setOrigin(0.5)

        //spaceship
        this.spaceship = new Spaceship(this, game.config.width/2, game.config.height*7/8, 'spaceship')
        this.spaceship.shipScale(4)
        
        //testing
    }

    update() {
        //console.log(this.spaceship.anims)
        this.spaceship.update(false)
        //this.moveMe.body.velocity = this.spaceship.body.velocity
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
        if(this.startCall) {
            //scale ship
            this.spaceship.shipScale(2+2*(-this.startCall.getProgress()+1)**3)
            
            //move black hole
            //console.log((-this.startCall.getProgress()+1)**3)
            this.moveMe.y = Math.min(game.config.height*3/8, game.config.height*3/8 * (-this.startCall.getProgress()+1)**3)

            //fade text
            this.topText.alpha = 1-2*this.startCall.getProgress()
            this.bottomText.alpha = 1-2*this.startCall.getProgress()
        }
    }
}