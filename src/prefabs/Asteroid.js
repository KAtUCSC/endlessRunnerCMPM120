class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, stun) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //asteroid params
        this.stun = stun
    }
}