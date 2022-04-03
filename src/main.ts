import gerls from './trashyhoe/gerls';
import gurl from './game/gurls';
import game from "./game/Game";

export default class Main {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  public readonly width: number;
  public readonly height: number;
  private currentgame: Gameinterface;

  constructor(CanvasElement: string) {
    this.canvas = document.getElementById(CanvasElement) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    // this.currentgame = new gurl(this.canvas, this.ctx, this.width, this.height);
    this.currentgame = new game(this.canvas, this.ctx, this.width, this.height);
  }

  start = () => {
    this.currentgame.start();
  }
}


export interface Gameinterface {
  start(): void;
}