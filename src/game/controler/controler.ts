import type game from "../Game";

export default class Controler {
  constructor(private readonly canvas: HTMLCanvasElement, private readonly game: game) {
    this.init();
  }

  init() {
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);
  }

  public static keymap: Map<string, boolean> = new Map();

  onKeyDown(event: KeyboardEvent) {
    Controler.keymap.set(event.key, true);
  }

  onKeyUp(event: KeyboardEvent) {
    Controler.keymap.set(event.key, false);
  }
}