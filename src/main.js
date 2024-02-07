/*
Name: Kira Way
Game Title: Gravity Well
Creative Tilt: working on it :)
*/

let config = {
    type: Phaser.AUTO,
    width: 500,
    height: 800,
    render: {
        pixelArt:true,
    },
    physics:{
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//define keys
let keyLEFT, keyRIGHT