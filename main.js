import { AUTO, Game } from "phaser";
import GamerOver from "./src/scenes/GamerOver";
import Level from "./src/scenes/Level";
import Primeira from "./src/scenes/Primeira";

const config = {
  width: 1340,   // largura
  height: 600,  //altura
  type: AUTO,   //tipo de renderização
  scene: [Level, GamerOver],
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
