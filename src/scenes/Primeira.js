import { Scene } from "phaser";

export default class Primeira extends Scene{

    p2;

    constructor(){
        //chamar o construtor da classe mãe
        //Passar o nome unico dessa cena
        super('primeira');
    }


    //carrega seus arquivos para uso(imagens, sons)
    preload(){
        this.load.image('plataforma', 'assets/ground_grass.png');

    }

    //inicializa os objetos graficos na tela
    create(){
        const p = this.add.image(240,320, 'plataforma');
        p.setScale(0.5);
        p.x = 100;
        p.y = 200;
        p.angle = 20;

        this.p2 = this.add.image(240,320, 'plataforma')
            .setScale(0.5)
            .setAngle(15);

    }

    //chamado a cada atualização
    update(time, delta){
        this.p2.angle += 0.5;
        this.p2.x -= 3;
        if (this.p2.x <= 0){
            this.p2.x = 480;
        }
    }












}


