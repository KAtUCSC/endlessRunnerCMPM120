class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.targetY = this.y
        this.maxSpeed = 300
        this.acceleration = 15
        this.faltering = false
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
            if(this.y > this.targetY + this.maxSpeed/2) {
                //console.log(`y over ydiff plus maxspeed`)
                velocityTarget = -this.maxSpeed
            } else {
                //console.log(`y below ydiff plus maxspeed`)
                velocityTarget = Math.max(yDifference * 2)
            }
            //console.log(`y difference: ${yDifference}, ${velocityTarget}`)

            //set velocity
            //console.log(this.body.velocity.y)
            //console.log(this.body.velocity.y - this.acceleration, velocityTarget)
            let finalVelocity = Math.max(this.body.velocity.y - this.acceleration, velocityTarget)
            this.body.setVelocityY(finalVelocity)
        }
        //else, go to target y
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