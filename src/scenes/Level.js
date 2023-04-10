import { Math, Scene } from "phaser";


export default class Level extends Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

     /** @type {Phaser.Physics.Arcade.Sprite} */
    pipes;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    pipes1;

    
    /**@type {Phaser.Physics.Arcade.Group} */
    star;

    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors


    points = -1;
    /**@type {Phaser.GameObjects.Text} */
    pointsText;

    constructor(){
        super('level');
    }

    preload(){
        this.load.image('background', 'assets/backgroundColorGrass.png');
        this.load.image('pipe', 'assets/canoG.png');
        this.load.image('pipe1', 'assets/canoG2.png');
        this.load.image('plane1', 'assets/planeBlue1.png');
        this.load.image('plane2', 'assets/planeBlue2.png');
        this.load.image('plane3', 'assets/planeBlue3.png');
        this.load.image('star', 'assets/starGold.png');
        this.load.audio('gameover', 'assets/sfx/big-impact-7054.mp3');
    }

    create(){
        //BACKGROUND
        this.add.image( this.scale.width/2 ,this.scale.height/2, 'background').setScrollFactor(0,0).setScale(0.85);
        
        //TEXTO DE PONTUAÇÃO
        const style = { color: '#000', frontSize: 24};
        this.pointsText = this.add.text(240, 10, 'Pipes: 0', style);
        this.pointsText.setScrollFactor(0);
        this.pointsText.setOrigin(0.5, 0);
        
        
        
        //GRUPO DE CANOS
        this.pipes = this.physics.add.staticGroup();
        this.pipes1 = this.physics.add.staticGroup();

        for (let i = 0; i < 5; i++){
            // if(this.pipe.x < this.cameras.main.scrollX){
            //     this.points++;
            // this.pointsText.text = 'Pipes: ' + this.points;
            // }
            const y = Math.Between(200,450);
            const x = 300 *i;
            

            const pipe = this.pipes.create(x,y, 'pipe');
            pipe.setOrigin(0, 0);
            pipe.setScale(0.15);
            pipe.body.updateFromGameObject();
        

            const pipe1 = this.pipes1.create(x,y-150 , 'pipe1');
            pipe1.setOrigin(0, 1);
            pipe1.setScale(0.15);
            pipe1.body.updateFromGameObject();
            
        }


        //CRIANDO O PLAYER

        this.player = this.physics.add.image(120,240, 'plane1')
            .setScale(0.5);
        
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
        //this.cameras.main.setFollowOffset(230, 360);
        this.cameras.main.setLerp(1,0);


        //DEFINIR A DEAD ZONE PARA A CAMERA
        this.cameras.main.setDeadzone(undefined, this.scale.x-200);
        




        //CURSORES  
        this.cursors = this.input.keyboard.createCursorKeys();

        // Estrela
        // this.stars = this.physics.add.group({
        //     classType: Star
        // });
        // this.physics.add.collider(this.stars, this.pipes);
        // this.physics.add.overlap(this.player, this.stars, this.handleCollectStar);


        


      


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
        this.pipes1.children.iterate(child =>{
             /** @type {Phaser.Physics.Arcade.Sprite} */
            const pipe1 = child;

        //PEGAR A POSIÇÃO X DA CAMERA
        const scrollX = this.cameras.main.scrollX;

         if(pipe.getBounds().right < this.player.getBounds().left && !pipe.scored){
                pipe.scored = true;
                this.points++;
                this.pointsText.text = 'Pipes: ' + this.points;
            }
        if (pipe.x <= scrollX - 500 && pipe1.x <=scrollX -500){

           


            pipe.setOrigin(0, 0);
            //pipe.setScale(0.25);
            pipe.y = Math.Between(200,520);
            pipe.x = scrollX + 1050;
            pipe.body.updateFromGameObject();
            
            //this.addStarAbove(pipe);
            
            pipe1.setOrigin(0, 1);
            //pipe1.setScale(0.25);
            pipe1.x = pipe.x;
            pipe1.y = pipe.y -150;
            pipe1.body.updateFromGameObject();
             }
         })})
        


        //CURSOR CIMA
        if (this.cursors.up.isDown){
            this.player.setVelocityY(-200);
         }


        //Testando se o aviao morrwu
        if(this.player.y > this.scale.height){
            this.scene.start('game-over', this.pointsText.text);
            this.sound.play('gameover');
            this.points = -1;
         } else if(this.player.y < -100){
             this.scene.start('game-over', this.pointsText.text);
             this.sound.play('gameover');
             this.points = -1;
        } 
        else if( this.player.body.touching.up ||this.player.body.touching.right || this.player.body.touching.down || this.player.body.touching.left){
            this.scene.start('game-over', this.pointsText.text);
            this.sound.play('gameover');
            this.points = -1;
        }

    }



    // addStarAbove(pipe){
    //     const y = pipe.y - pipe.displayHeight;


    //     const star = this.stars.get(x, pipe.y, 'star');

    //     star.setActive(true);
    //     star.setVisible(true);

    //     this.add.existing(star);
    //     star.body.setSize(star.width, star.height);
    //     this.physics.world.enable(star);
    // }

    // handleCollectStar(player, star){
    //     this.stars.killAndHide(star);
    //     this.physics.world.disableBody(star.body);
        
    // }


    // findBottomPipe(){
    //     let pipes = this.pipes.getChildren();
    //     let bottomPipe = pipes[0];

    //     for(let i = 1; i < pipes.length; i++){
    //         let pipe = pipes[i];

    //         if(pipe.y < bottomPipe.y){
    //             continue;
    //         }
    //         bottomPipe = pipe;
    //     }

    //     return bottomPipe;
    // }


}