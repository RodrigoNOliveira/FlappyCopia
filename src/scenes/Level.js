import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrots";

export default class Level extends Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

     /** @type {Phaser.Physics.Arcade.StaticGroup} */
    pipes;

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    pipes2;


    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors


    /**@type {Phaser.Physics.Arcade.Group} */
    carrots;

    points = 0;
    /**@type {Phaser.GameObjects.Text} */
    pointsText;

    constructor(){
        super('level');
    }

    preload(){
        this.load.image('background', 'assets/backgroundColorGrass.png');
        this.load.image('pipe', 'assets/cano.png');
        this.load.image('pipe1', 'assets/cano2.png');
        this.load.image('plane1', 'assets/planeBlue1.png');
        this.load.image('plane2', 'assets/planeBlue2.png');
        this.load.image('plane3', 'assets/planeBlue3.png');

        this.load.image('carrot', 'assets/carrot.png');
        this.load.audio('jump', 'assets/sfx/jump.ogg');
        this.load.audio('gameover', 'assets/sfx/gameover.ogg');
    }

    create(){
        //BACKGROUND
        this.add.image(500 ,200, 'background').setScrollFactor(0,0).setScale(2);
        

        //platform
        ///const platform = this.physics.add.staticImage(240 ,320, 'platform')
            //.setScale(0.5);

            //platform.body.updateFromGameObject(); //atualiza o tamanho do corpo para a nova escala


        //GRUPO DE CANOS

        this.pipes = this.physics.add.staticGroup();
        this.pipes2 = this.physics.add.staticGroup();

        for (let i = 0; i < 5; i++){
            const y = Math.Between(100,300);
            const z = Math.Between(700,600);
            const x = 350 * i;
            

            const pipe = this.pipes.create(x,y, 'pipe');
            const pipe1 = this.pipes2.create(x,z, 'pipe1');

            pipe.setScale(0.5);
            pipe.body.updateFromGameObject();
            pipe1.setScale(0.5);
            pipe1.body.updateFromGameObject();
        }


        //CRIANDO O PLAYER

        this.player = this.physics.add.image(240 ,120, 'plane1')
            .setScale(1);

        //FAZ OS ELEMENTOS COLIDIREM
        this.physics.add.collider(this.player, this.pipes);
    
        //DESABILITAR A COLISÃO DO COELHO NAS LATERAIS E EM CIMA
        this.player.body.checkCollision.up = true;
        this.player.body.checkCollision.left = true;
        this.player.body.checkCollision.right = true;


        //CÂMERA
        //this.cameras.main.startFollow();


        //DEFINIR A DEAD ZONE PARA A CAMERA
        this.cameras.main.setDeadzone(this.scale.width * 0.5);



        //CURSORES  
        this.cursors = this.input.keyboard.createCursorKeys();

        //CENOURAS
        this.carrots = this.physics.add.group({
            classType: Carrot
        });
        this.physics.add.collider(this.carrots, this.pipes);
        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);


        //TEXTO DE PONTUAÇÃO
        const style = { color: '#000', frontSize: 24};
        this.pointsText = this.add.text(240, 10, 'Cenouras: 0', style);
        this.pointsText.setScrollFactor(0);
        this.pointsText.setOrigin(0.5, 0);


        let rect = this.add.rectangle(240,300,100,50,0xffcc00);


    }


    update(time ,delta){
        //PULANDO
        /*const touchingGround = this.player.body.touching.down;
       
        if ( touchingGround){
            this.player.setVelocityY(-300);
            this.sound.play('jump');


            //MUDA A IMAGEM DO COELHO
            this.player.setTexture('plane3');
        }
        else*/ if (this.cursors.up.isDown){
            this.player.setTexture('plane2');
        }

        let velocityY = this.player.body.velocity.y;
        if (velocityY > 0 && this.player.texture.key != 'plane1'){
            this.player.setTexture('plane1');
        }


        //REUSANDO OS pipes
        this.pipes.children.iterate(child =>{
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const pipe = child;


            //PEGAR A POSIÇÃO Y DA CAMERA
            const scrollY = this.cameras.main.scrollY;
            if (pipe.y >= scrollY + 650){
                pipe.x = Math.Between(80,400);
                pipe.y = scrollY - Math.Between(0,10);
                pipe.body.updateFromGameObject();


                //criar uma cenoura
                this.addCarrotAbove(pipe);

            }

        })
        this.pipes2.children.iterate(child =>{
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const pipe2 = child;


            //PEGAR A POSIÇÃO Y DA CAMERA
            const scrollY = this.cameras.main.scrollY;
            if (pipe2.y >= scrollY + 650){
                pipe2.x = Math.Between(80,400);
                pipe2.y = scrollY - Math.Between(0,10);
                pipe2.body.updateFromGameObject();


                //criar uma cenoura
                this.addCarrotAbove(pipe2);

            }

        })



        //CURSORES DIREITA E ESQUERDA
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200);

        } else if (this.cursors.right.isDown){
            this.player.setVelocityX(200);
        }else if (this.cursors.up.isDown){
            this.player.setVelocityY(-200);
         } else{
            this.player.setVelocityX(0);
        }


        //Testando se o aviao morrwu
        /*let bottompipe = this.findBottompipe();
        if (this.player.y > bottompipe.y + 200){
            this.scene.start('game-over');
            this.sound.play('gameover');
        } else*/ if(this.player.y >= 550){
            this.scene.start('game-over');
            this.sound.play('gameover');
        } else if(this.player.y <= 1){
            this.scene.start('game-over');
            this.sound.play('gameover');
        } else if( this.player.body.touching.up ||this.player.body.touching.right /*|| this.player.body.touching.down*/ ){
            this.scene.start('game-over');
            this.sound.play('gameover');
        }

    }



    addCarrotAbove(pipe){
        const y = pipe.y - pipe.displayHeight;


        const carrot = this.carrots.get(pipe.x, y, 'carrot');

        carrot.setActive(true);
        carrot.setVisible(true);

        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot);
    }

    handleCollectCarrot(player, carrot){
        this.carrots.killAndHide(carrot);
        this.physics.world.disableBody(carrot.body);
        this.points++;
        this.pointsText.text = 'Cenouras: ' + this.points;
    }


    findBottomPipe(){
        let pipes = this.pipes.getChildren();
        let bottomPipe = pipes[0];

        for(let i = 1; i < pipes.length; i++){
            let pipe = pipes[i];

            if(pipe.y < bottomPipe.y){
                continue;
            }
            bottomPipe = pipe;
        }

        return bottomPipe;
    }


}