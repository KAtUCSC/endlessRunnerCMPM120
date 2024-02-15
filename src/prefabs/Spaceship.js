class Spaceship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        //vertical move params (change as game goes on)
        this.targetY = this.y
        this.maxSpeed = 300
        this.acceleration = 15
        this.gravPull = 50
        //horizontal params (fixed?)
        this.maxSpeedX = 600
        this.accelerationX = 30
        this.falterXMultiplier = 1

        //faltering setup
        //this.falterTimer = scene.time.addEvent({delay: 0, repeat: 0})
        this.falterTimer = scene.time.delayedCall(0, this.doneFaltering, null, this)
        this.falterTimer.repeat = -1
        this.falterTimer.loop = true
        this.falterTimer.paused = true
        this.playedFalter = false
        //console.log(this.falterTimer)
        
        //physics stuff
        this.bounceFactor = 0.4
        this.bounceFactorY = 0.0
        this.body.setCollideWorldBounds(true, 0.7, 0)
        this.body.setSize(this.width/3, this.height/2).setOffset(this.width/3,this.height/8).setBounce(this.bounceFactor, this.bounceFactorY)

        //death
        this.dead = false
        
        /*
        adapted from samme from the phaser form's work while answering someone's multi body question
        https://phaser.discourse.group/t/arcade-physics-create-one-sprite-with-multiple-collision-bodies-compounded-sprite/3773
        */
        //nose cone hitbox
        this.noseCone = scene.physics.add.sprite(this.x, this.y, texture)
        this.noseCone.body.setCollideWorldBounds(true, 0.7, 0)
        this.noseCone.body.setCircle(this.width/6, this.width/3, 0).setBounce(this.bounceFactor, this.bounceFactorY)
        this.noseCone.setAlpha(0)

        //console.log(`ship added, target y is ${this.targetY}`)
    }

    update(xControlValue) {
        //desync bandaid, works like a charm :skull:
        this.x = this.noseCone.x
        this.y = this.noseCone.y

        //either faltering or going
        //if faltering, flash thruster and fall backwards
        //else, go to target y
        if(this.dead) {
            this.shipScale(2*Math.min(1, 8 * (game.config.height - this.y) / game.config.height))
            this.setAlpha(Math.min(1, 8 * (game.config.height - this.y) / game.config.height))
            this.noseCone.body.velocity.copy(this.body.velocity)
            this.setAccelerationY(this.gravPull * 3)
            //console.log(this.body.velocity.y)
            return
        }
        if(this.falterTimer.paused == false) {
            //console.log('FALTERING', this.falterTimer.elapsed, this.falterTimer.delay)
            if(this.falterTimer.elapsed >= -400) {
                this.playedFalter = false
                this.falterXMultiplier = 1
                this.play('recover', true)
                this.setAccelerationY(-this.body.velocity.y)
                //console.log('sputtering', this.body.acceleration.y)
            } else {
                this.falterXMultiplier = 0.5
                if(!this.playedFalter) {
                    this.play('falter', true)
                    this.playedFalter = true
                }
                this.setAccelerationY(this.gravPull)
                //console.log('recovering', -this.body.velocity.y)
            }
        } else {
            //animate
            this.play('thrust', true)

            let yDifference = this.targetY - this.y
            //set target velocity
            let velocityTarget = (this.y > this.targetY + this.maxSpeed/2) ? -this.maxSpeed: Math.max(yDifference * 2);
            
            //manual acceleration to target velocity, use built in acceleration next time
            let finalVelocity = Math.max(this.body.velocity.y - this.acceleration, velocityTarget)
            this.body.setVelocityY(finalVelocity)
        }

        //x control
        //(-keyLEFT.isDown+keyRIGHT.isDown) controls direction, either 1, 0, or -1
        //xControlValue*this.maxSpeed*(-keyLEFT.isDown+keyRIGHT.isDown) is the target velocity
        let velocityTargetX = xControlValue*this.maxSpeedX*(-keyLEFT.isDown+keyRIGHT.isDown)
        let velocityChangeX = this.falterXMultiplier * Math.min(this.accelerationX, Math.max(-this.accelerationX, velocityTargetX - this.body.velocity.x))
        this.body.setVelocityX(this.body.velocity.x + velocityChangeX)
        
        //link nose cone to ship velo
        this.noseCone.body.velocity.copy(this.body.velocity)
    }

    //max y speed for going to y target
    setMaxSpeed(numValue) {
        console.log(`setting max speed to ${numValue}`)
        this.maxSpeed = numValue
    }

    //max y accel for going to y target
    setAcceleration(numValue) {
        console.log(`setting acceleration to ${numValue}`)
        this.acceleration = numValue
    }

    //sets the y value the ship tries to go to
    setTargetY(yValue) {
        //console.log(`setting target y to ${yValue}`)
        this.targetY = yValue
    }

    //use this instead of directly scaling to keep the scale of the nose cone right
    shipScale(number) {
        this.setScale(number)
        this.noseCone.setScale(number)
    }

    falter(stun) {
        //console.log(`falter: add ${stun} stun`)
        this.falterTimer.paused = false
        let thisStun = -stun * 333
        this.falterTimer.elapsed = (this.falterTimer.elapsed < thisStun) ? this.falterTimer.elapsed: thisStun;
    }

    doneFaltering() {
        //console.log('done faltering')
        this.falterTimer.paused = true
        this.falterTimer.hasDispatched = false
    }

    //thinking
    /*
    timer is by default paused and duration + elapsed zeroed
    hit function will unpause the timer, add to the duration, and set faltering
    if elapsed >= duration, pause and zero, set not faltering
    which animation plays depends on duration - elapsed = stun time remaining
    
    2 stages of falter: falling and recovering
    falling: thrusters short or are out, starts accelerating down
    recovering: thrusters are turning back on, accelerates towards a y stop

    lose x control for half a second after being hit
    */
}