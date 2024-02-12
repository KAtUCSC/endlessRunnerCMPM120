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
        //horizontal params (fixed?)
        this.maxSpeedX = 600
        this.accelerationX = 30

        //faltering setup
        this.faltering = false
        this.falterTimer = scene.time.addEvent({delay: 0, repeat: 0})
        this.falterTimer.paused = true
        console.log(this.falterTimer)
        
        //physics stuff
        this.body.setCollideWorldBounds(true)
        this.body.setSize(this.width/3, this.height/2).setOffset(this.width/3,this.height/16).setBounce(0.7)

        console.log(`ship added, target y is ${this.targetY}`)
    }

    update(xControlValue) {
        //either faltering or going
        //if faltering, flash thruster and fall backwards
        let yDifference = this.targetY - this.y
        let velocityTarget
        if(this.faltering) {
            console.log('faltering')
            //console.log(this.scene)
        } else {
            this.play('thrust', true)
            if(this.y > this.targetY + this.maxSpeed/2) {
                velocityTarget = -this.maxSpeed
            } else {
                velocityTarget = Math.max(yDifference * 2)
            }
            //set velocity
            let finalVelocity = Math.max(this.body.velocity.y - this.acceleration, velocityTarget)
            this.body.setVelocityY(finalVelocity)
        }
        //else, go to target y

        //x control
        //(-keyLEFT.isDown+keyRIGHT.isDown) controls direction, either 1, 0, or -1
        //xControlValue*this.maxSpeed*(-keyLEFT.isDown+keyRIGHT.isDown) is the target velocity
        let velocityTargetX = xControlValue*this.maxSpeedX*(-keyLEFT.isDown+keyRIGHT.isDown)
        let velocityChangeX = Math.min(this.accelerationX, Math.max(-this.accelerationX, velocityTargetX - this.body.velocity.x))
        this.body.setVelocityX(this.body.velocity.x + velocityChangeX)
    }

    setMaxSpeed(numValue) {
        console.log(`setting max speed to ${numValue}`)
        this.maxSpeed = numValue
    }

    setAcceleration(numValue) {
        console.log(`setting acceleration to ${numValue}`)
        this.acceleration = numValue
    }

    setTargetY(yValue) {
        console.log(`setting target y to ${yValue}`)
        this.targetY = yValue
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