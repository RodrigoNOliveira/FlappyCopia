import { AUTO, Game } from "phaser";
import GamerOver from "./src/scenes/GamerOver";
import Level from "./src/scenes/Level";
import Inicio from "./src/scenes/Inicio";


const config = {
  width: 540,   // largura
  height: 650,  //altura
  type: AUTO,   //tipo de renderização
  scene: [Inicio, Level, GamerOver],
  physics: {
    default: 'arcade',
    arcade:{
      gravity: {
        y: 200
      },
      debug: true
    }
  }
}


new Game(config);
