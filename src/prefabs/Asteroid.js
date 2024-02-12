class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, astSize, stun, initialVelocity) {
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
        super(scene, Phaser.Math.Between(0, game.config.width), -32, texture);

        //add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //asteroid params
        this.body.setCircle(this.width/2, 0, 0).setBounce(0.7)
        this.stun = stun
        this.body.setVelocityY(initialVelocity)
        //console.log('asteroid made')

        this.body.setAccelerationY(100)
    }
}