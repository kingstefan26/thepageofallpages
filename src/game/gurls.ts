type Sprite = {
  speed: number;
  x: number;
  y: number;
  f: number;
};
import type { Gameinterface } from "../main";

export default class Game implements Gameinterface {
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

    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);


    document.getElementById('speed')?.addEventListener('change', (e) => {

      // @ts-ignore
      this.player.speed = parseInt(e.target.value);

    });

  }


  rightPressed: boolean = false;
  leftPressed: boolean = false;

  private keyDownHandler(e: { key: string; }) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = true;

      if(this.player) {
        // @ts-ignore
        if (this.player.x + this.size.w <= this.backbroudimage.width) {
          this.player.x += 2 * this.player.speed;
        }
      }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = true;
      if(this.player){
        // @ts-ignore
        if (this.player.x + this.size.w <= this.backbroudimage.width) {
          this.player.x -= 2 * this.player.speed;
        }
      }
    }
  }

  private keyUpHandler(e: { key: string; }) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = false;
    }
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


    this.player = {
      x: backgroudimagewitdh / 2,
      y: backgroudimageheight / 2,
      f: Math.round(Math.random() * 3),
      speed: 1
    }

  }




  lastDraw = performance.now();
  private player: Sprite | undefined = undefined;

  readonly size = {w: 44, h: 70, frames: 8};

  private renderLoop() {
    const tharenderloop = setInterval(() => {
      if (!this.shouldStop) {
        this.dorender();
      } else {
        clearInterval(tharenderloop);
      }
    }, 0);
  }



  private dorender() {
    // @ts-ignore
    this.ctx.drawImage(this.backbroudimage, 0, 0);


    // Draw player

    if(this.player){

      // // @ts-ignore
      // if (this.player.x + this.size.w >= this.backbroudimage.width) this.player.x -= 10;
      // // @ts-ignore
      // if (s.y + this.size.h >= this.backbroudimage.height) s.y -= 10;

      const offset = (this.player.f % this.size.frames) * this.size.w;

      // @ts-ignore
      this.ctx.drawImage(this.girlSprite, offset, 0, this.size.w, this.size.h, this.player.x, this.player.y, this.size.w, this.size.h);


    }


    const now = performance.now();
    const delay = now - this.lastDraw;
    this.avgDelay += (delay - this.avgDelay) / 10;
    this.lastDraw = now;
  }

}