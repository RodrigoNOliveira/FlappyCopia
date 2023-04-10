import { Scene } from "phaser";


export default class GamerOver extends Scene {

    constructor() {
        super('inicial');
    }


    preload() {
        this.load.image('star', 'assets/textGetReady.png');

        this.load.image('background', 'assets/backgroundColorGrass.png');
        this.load.image('tapLeft', 'assets/tapLeft.png');
        this.load.image('tapRight', 'assets/tapRight.png');
        this.load.image('space', 'assets/buttonLarge.png');
        this.load.image('planeBlue1', 'assets/planeBlue1.png');
        this.load.image('planeRed1', 'assets/planeRed1.png');

    }


    create(data) {

        //BACKGROUND
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setScrollFactor(0, 0).setScale(0.85);
      

        //TAPS
        this.add.image(440, 450, 'tapLeft').setScrollFactor(0, 0).setScale(0.85);
        this.add.image(100, 450, 'tapRight').setScrollFactor(0, 0).setScale(0.85);

        //Space
        this.add.image(270, 450, 'space').setScrollFactor(0, 0).setScale(0.85);
    

        this.add.image(this.scale.width / 2, this.scale.height / 2 - 200, 'star').setScale(0.8);

        let width = this.scale.width;
        let height = this.scale.height;


        //Try again
        //let text = data;
        this.add.text(270, 450, "START", {
            fontSize: 24, color: '#000'
        }).setOrigin(0.5);

        


        //SKIN
        this.add.text(width / 2, height / 2-100, "SELECT SKIN", {
            fontSize: 48, color: '#000'
        }).setOrigin(0.5);

        var blue = this.add.image(340, 350, 'planeBlue1').setScrollFactor(0, 0).setScale(0.85).setInteractive();

        var red = this.add.image(200, 350, 'planeRed1').setScrollFactor(0, 0).setScale(0.85).setInteractive();

        red.once('pointerup', function(){
            this.once('complete', addSprites, this);
            this.opt = 1;
            this.load.console.log = "1";
        });
        
        blue.once('pointerup', function(){
            this.opt = 2;
            console.log = "2";
        });



        //JOGAR
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('level');
        })
    }



}