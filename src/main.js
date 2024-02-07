let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    physics:{
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [Menu]
}

let game = new Phaser.Game(config);