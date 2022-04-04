import gerls from './trashyhoe/gerls';
import gurl from './game/gurls';
import game from "./game/Game";

export default class Main {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  public readonly width: number | undefined;
  public readonly height: number | undefined;
  private currentgame: Gameinterface | undefined;

  constructor(CanvasElement: string) {
    this.canvas = document.getElementById(CanvasElement) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    const elem = document.querySelector("#gamecontainer");
    if(elem) {
      const rect = elem.getBoundingClientRect();
      this.width = this.canvas.width = rect.width;
      this.height = this.canvas.height = rect.height;
      // this.currentgame = new gurl(this.canvas, this.ctx, this.width, this.height);
      this.currentgame = new game(this.canvas, this.ctx, this.width, this.height);

    }
  }

  start = () => {
    if(this.currentgame) {
      this.currentgame.start();
    }
  }
}


export interface Gameinterface {
  start(): void;
}