class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, astSize, stun, initialVelocityY, initialVelocityX) {
        //thinking
        /*
        size is a number
        pick random number 1-3
        texture is asteroid<size><num>

        REMEMBER TO DESTROY ASTEROIDS AFTER TOO LOW OR TOO FAR X
        */
        let astVar = Phaser.Math.Between(1, 3)
        let texture = `asteroid${astSize}-${astVar}`
        //console.log(texture)
        super(scene, x, -32, texture);

        //add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //asteroid params
        this.body.setCircle(this.width/2, 0, 0).setBounce(1.5, 0.5)
        this.stun = stun
        this.body.setVelocity(initialVelocityX, initialVelocityY)
        //console.log('asteroid made')

        this.body.setAccelerationY(800)
        this.body.setAccelerationX((game.config.width/2 - this.x) / 3)
    }

    update(){
        if(this.y > game.config.height + this.height) {
            //console.log('destroying asteroid')
            this.destroy()
        }
    }
}