/*
Name: Kira Way
Game Title: Gravity Well
Creative Tilt: 
Technical: I used multiple sprites to create a multi-body hitbox for the spaceship in order to bounce asteroids off of a rounded nosecone while still keeping a largely rectangular hitbox
Creative: I am rather proud of my asteroid sprites, I spent a great deal of care making them and believe they turned out excellent
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
            //debug: true
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//define keys
let keyLEFT, keyRIGHT, keyRESET