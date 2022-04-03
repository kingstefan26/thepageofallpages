type Sprite = {
  x: number;
  y: number;
  f: number;
};
import type { Gameinterface } from '../main';

export default class Game implements Gameinterface{
  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D | null, private width: number, private height: number) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }


  public shouldStop: boolean = false;

  public start() {

    document.addEventListener("DOMContentLoaded", async () => {
      await this.prepareGame();
      this.renderLoop();
      const thafpsloop = setInterval(() => {
        if(this.fps){
          if(this.shouldStop){
            clearInterval(thafpsloop);
          } else {
            this.fps.innerHTML = (1000 / this.avgDelay).toFixed(1) + " fps";
          }
        }
      }, 2000);
    }, {
      once: true
    });
  }

  addImageProcess(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }


  private backbroudimage: HTMLImageElement | undefined = undefined;
  girlSprite: HTMLImageElement | undefined = undefined;
  private avgDelay: number = 0;

  private fps = document.getElementById("fps");

  private async prepareGame() {
    const game = document.getElementById("trashyhoe");


    this.backbroudimage = await this.addImageProcess("assets/me.jpg");

    const backgroudimagewitdh = 400;
    const backgroudimageheight = 400;
    this.canvas.width = backgroudimagewitdh;
    this.canvas.height = backgroudimageheight;

    if(game){
      game.style.width = backgroudimagewitdh + "px";
    }

    this.ctx?.drawImage(this.backbroudimage, 0, 0);


    this.girlSprite = await this.addImageProcess("assets/walking-girl2.png");

    const padding = 200;
    const number = 400;

    // create spriteAmmout of sprites
    this.sprites = new Array(number).fill(null).map(() => ({
        x: Math.random() * (backgroudimagewitdh - padding) + padding / 2,
        y: Math.random() * (backgroudimageheight - padding) + padding / 2,
        f: Math.round(Math.random() * 3)
      })
    );

  }


  lastDraw = performance.now();
  sprites: Array<Sprite> = [];

  readonly size = {w: 44, h: 70, frames: 8};

  private renderLoop() {

    // @ts-ignore
    this.ctx.drawImage(this.backbroudimage, 0, 0);


    // Draw sprites
    for (const s of this.sprites) {
      s.x += Math.random() * 4 - 2;
      s.y += Math.random() * 4 - 2;
      // @ts-ignore
      if (s.x + this.size.w >= this.backbroudimage.width) s.x -= 10;
      // @ts-ignore
      if (s.y + this.size.h >= this.backbroudimage.height) s.y -= 10;

      const offset = (s.f++ % this.size.frames) * this.size.w;


      // const animationspeed = 3;
      //
      // s.x = 100;
      // s.y = 100;
      // s.c = s.c >= (animationspeed +1) ? 0 : s.c + 1;
      // s.f = s.c === animationspeed ? s.f + 1 : s.f;
      // const offset = (s.f % size.frames) * size.w;
      // @ts-ignore
      this.ctx.drawImage(this.girlSprite, offset, 0, this.size.w, this.size.h, s.x, s.y, this.size.w, this.size.h);
    }

    const now = performance.now();
    const delay = now - this.lastDraw;
    this.avgDelay += (delay - this.avgDelay) / 10;
    this.lastDraw = now;


    const tharenderloop = setInterval(() => {
      if (!this.shouldStop) {
        this.renderLoop();
      } else {
        clearInterval(tharenderloop);
      }
    }, 0);
  }
}