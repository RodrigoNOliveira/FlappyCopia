import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrots";

export default class Level extends Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

     /** @type {Phaser.Physics.Arcade.Sprite} */
    pipes;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    pipes1;


    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors


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

        this.load.audio('gameover', 'assets/sfx/gameover.ogg');
    }

    create(){
        //BACKGROUND
        this.add.image( this.scale.width/2 ,this.scale.height/2, 'background').setScrollFactor(0,0).setScale(1.5);
        

        //GRUPO DE CANOS
        this.pipes = this.physics.add.staticGroup();
        this.pipes1 = this.physics.add.staticGroup();

        for (let i = 0; i <= 5; i++){
            const y = Math.Between(390,700);
            const x = 600 *i;
            

            const pipe = this.pipes.create(x,y, 'pipe');
            pipe.setOrigin(0, 0);
            pipe.setScale(0.5);
            pipe.body.updateFromGameObject();
        

            const pipe1 = this.pipes1.create(x,y-250 , 'pipe1');
            pipe1.setOrigin(0, 1);
            pipe1.setScale(0.5);
            pipe1.body.updateFromGameObject();
        }


        //CRIANDO O PLAYER

        this.player = this.physics.add.image(240 ,120, 'plane1')
            .setScale(1);
        
        this.player.setVelocityX(100);

        //FAZ OS ELEMENTOS COLIDIREM
        this.physics.add.collider(this.player, this.pipes);
        this.physics.add.collider(this.player, this.pipes1);
        
        //COLISÃO DO AVIAO NAS LATERAIS E EM CIMA E EMBAIXO
        this.player.body.checkCollision.up = true;
        this.player.body.checkCollision.left = true;
        this.player.body.checkCollision.right = true;
        this.player.body.checkCollision.down = true;


        //CÂMERA
        this.cameras.main.startFollow(this.player);


        //DEFINIR A DEAD ZONE PARA A CAMERA
        this.cameras.main.setDeadzone(undefined, this.scale.x-200);
        




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
        this.pointsText = this.add.text(240, 10, 'Pipes: 0', style);
        this.pointsText.setScrollFactor(0);
        this.pointsText.setOrigin(0.5, 0);


      


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

        // let velocityY = this.player.body.velocity.y;
        // if (velocityY > 0 && this.player.texture.key != 'plane1'){
        //     this.player.setTexture('plane1');
        // }

        
        //REUSANDO OS pipes
        // this.pipes.children.iterate(child =>{
        //     /** @type {Phaser.Physics.Arcade.Sprite} */
        //     const pipe = child;


        //     //PEGAR A POSIÇÃO Y DA CAMERA
        //     const scrollY = this.cameras.main.scrollY;
        //     if (pipe.y >= scrollY + 650){
        //         pipe.x = Math.Between(80,400);
        //         pipe.y = scrollY - Math.Between(0,10);
        //         pipe.body.updateFromGameObject();

        //     }

        // })
        // this.pipes1.children.iterate(child =>{
        //     /** @type {Phaser.Physics.Arcade.Sprite} */
        //    const pipe1 = child;


        //     //PEGAR A POSIÇÃO Y DA CAMERA
        //     const scrollY = this.cameras.main.scrollY;
        //     if (pipe1.y >= scrollY + 650){
        //         pipe1.x = Math.Between(80,400);
        //         pipe1.y = scrollX - Math.Between(0,10);
        //         pipe1.body.updateFromGameObject();
        //     }

        // })
        


        //CURSORES DIREITA E ESQUERDA
        // if (this.cursors.left.isDown){
        //     this.player.setVelocityX(-200);

        // } else if (this.cursors.right.isDown){
        //     this.player.setVelocityX(200);
        // }else 
        if (this.cursors.up.isDown){
            this.player.setVelocityY(-200);
         }


        //Testando se o aviao morrwu
        if(this.player.y >= this.scale.height){
            this.scene.start('game-over');
            this.sound.play('gameover');
        } else if(this.player.y <= 1){
            this.scene.start('game-over');
            this.sound.play('gameover');
        } else if( this.player.body.touching.up ||this.player.body.touching.right || this.player.body.touching.down || this.player.body.touching.left){
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
        this.pointsText.text = 'Pipes: ' + this.points;
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