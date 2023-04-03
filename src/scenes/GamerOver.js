import { Scene } from "phaser";
import Level from "./Level";

export default class GamerOver extends Scene {
    constructor() {
        super('game-over');
    }


    preload(){
        this.load.image('game-over', 'assets/textGameOver.png');
        
    }

    create() {

        this.add.image(670,200,'game-over');

        let width = this.scale.width;
        let height = this.scale.height;

        
        let text =  Level.pointsText + " oi";
        this.add.text(width / 2, height / 2, text, {
            fontSize: 48, color: '#fff'
        }).setOrigin(0.5);


        //JOGAR DE NOVO
        this.input.keyboard.once('keydown-SPACE', () =>{
            this.scene.start('level');
        })
    }



}