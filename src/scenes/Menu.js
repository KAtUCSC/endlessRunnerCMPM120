//

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {}

    create() {
        console.log('Menu: create')
        let menuText = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0            
        }
        this.add.text(game.config.width/2, game.config.height/2, 'menu text temp', menuText)
    }

    update() {}
}