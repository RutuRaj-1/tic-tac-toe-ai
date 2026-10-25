
import Phaser from "phaser";
import TicTacToeScene from "./game/TicTacToeScene.js";

const config = {
    type: Phaser.AUTO,

    width: 600,
    height: 740,

    parent: "game-container",

    backgroundColor: "#11182B",

    scene: [TicTacToeScene],

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    render: {
        antialias: true,
        pixelArt: false
    }
};

const game = new Phaser.Game(config);

export default game;
