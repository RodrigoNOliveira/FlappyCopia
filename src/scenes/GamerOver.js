import { Scene } from "phaser";


export default class GamerOver extends Scene {

    points;

    constructor() {
        super('game-over');
    }


    preload() {
        this.load.image('game-over', 'assets/textGameOver.png');

        this.load.image('background', 'assets/backgroundColorGrass.png');
        this.load.image('tapLeft', 'assets/tapLeft.png');
        this.load.image('tapRight', 'assets/tapRight.png');
        this.load.image('space', 'assets/buttonLarge.png');

    }


    create(data) {

        //BACKGROUND
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setScrollFactor(0, 0).setScale(0.85);
      

        //TAPS
        this.add.image(440, 450, 'tapLeft').setScrollFactor(0, 0).setScale(0.85);
        this.add.image(100, 450, 'tapRight').setScrollFactor(0, 0).setScale(0.85);

        //Space
        this.add.image(270, 450, 'space').setScrollFactor(0, 0).setScale(0.85);
    

        this.add.image(this.scale.width / 2, this.scale.height / 2 - 100, 'game-over').setScale(0.8);

        let width = this.scale.width;
        let height = this.scale.height;


        //Try again
        //let text = data;
        this.add.text(270, 450, "TRY AGAIN", {
            fontSize: 24, color: '#000'
        }).setOrigin(0.5);




        //PIPES
        this.add.text(width / 2, height / 2, data, {
            fontSize: 48, color: '#000'
        }).setOrigin(0.5);


        //JOGAR DE NOVO
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('level');
        })
    }



}