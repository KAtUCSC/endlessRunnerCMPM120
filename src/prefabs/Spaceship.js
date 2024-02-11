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

        this.faltering = false
        
        //physics stuff
        this.body.setCollideWorldBounds(false)

        console.log(`ship added, target y is ${this.targetY}`)
    }

    update(xControlValue) {
        //either faltering or going
        //if faltering, flash thruster and fall backwards
        let yDifference = this.targetY - this.y
        let velocityTarget
        if(this.faltering) {
            console.log('faltering')
        } else {
            this.play('thrust', true)
            if(this.y > this.targetY + this.maxSpeed/2) {
                //console.log(`y over ydiff plus maxspeed`)
                velocityTarget = -this.maxSpeed
            } else {
                //console.log(`y below ydiff plus maxspeed`)
                velocityTarget = Math.max(yDifference * 2)
            }
            //set velocity
            //console.log(`y difference: ${yDifference}, ${velocityTarget}`)
            //console.log(this.body.velocity.y - this.acceleration, velocityTarget)
            let finalVelocity = Math.max(this.body.velocity.y - this.acceleration, velocityTarget)
            this.body.setVelocityY(finalVelocity)
        }
        //else, go to target y

        //x control
        //console.log(this.body.velocity.x)
        //(-keyLEFT.isDown+keyRIGHT.isDown) controls direction, either 1, 0, or -1
        //xControlValue*this.maxSpeed*(-keyLEFT.isDown+keyRIGHT.isDown) is the target velocity
        let velocityTargetX = xControlValue*this.maxSpeedX*(-keyLEFT.isDown+keyRIGHT.isDown)
        let velocityChangeX = Math.min(this.accelerationX, Math.max(-this.accelerationX, velocityTargetX - this.body.velocity.x))
        //console.log(velocityChangeX)
        //let finalVelocityX = 0
        this.body.setVelocityX(this.body.velocity.x + velocityChangeX)
        //this.body.acceleration.x = xControlValue*this.accelerationX*(-keyLEFT.isDown+keyRIGHT.isDown)*30
        //this.body.setVelocityX(Math.max(-this.maxSpeedX, Math.min(this.maxSpeedX, this.body.velocity.x)))
        //console.log(Math.max(-this.maxSpeedX, Math.min(this.maxSpeedX, this.body.velocity.x)))
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
}