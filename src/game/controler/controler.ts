import type game from "../Game";
import JoyStick from "../../lib/joy";

export default class Controler {
  constructor(private readonly canvas: HTMLCanvasElement, private readonly game: game) {
    this.init();
  }

  init() {
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);

    document.getElementById('actionbtn')?.addEventListener('click', () => {
      this.game.player.doaction();
    }, false);


    const elem = document.querySelector("#joysticken");
    if(elem) {
      const rect = elem.getBoundingClientRect();
      console.log(`height: ${rect.height} width: ${rect.width}`);
      new JoyStick('joysticken', {
        title: "AFUCKINGJoystick",
        width: rect.width,
        height: rect.height,
        internalFillColor: "rgba(255,0,0,0.5)",
        internalLineWidth: 4,
        internalStrokeColor: "#330000",
        externalLineWidth: 4,
        externalStrokeColor: "#d00000",
        autoReturnToCenter: true,
      }, (data) => {
        switch (data.cardinalDirection) {
          case "N":
            this.game.player.moveUp();
            break;
          case "S":
            this.game.player.moveDown();
            break;
          case "E":
            this.game.player.moveRight();
            break;
          case "W":
            this.game.player.moveLeft();
            break;
          case "NE":
            this.game.player.moveUp();
            this.game.player.moveRight();
            break;
          case "NW":
            this.game.player.moveUp();
            this.game.player.moveLeft();
            break;
          case "SE":
            this.game.player.moveDown();
            this.game.player.moveRight();
            break;
          case "SW":
            this.game.player.moveDown();
            this.game.player.moveLeft();
            break;
          default:
            break;
        }
      });
    }
  }

  public static keymap: Map<string, boolean> = new Map();

  onKeyDown(event: KeyboardEvent) {
    Controler.keymap.set(event.key, true);
  }

  onKeyUp(event: KeyboardEvent) {
    Controler.keymap.set(event.key, false);
  }
}