import IEntity from "../IEntity";
import { getImage } from "../../render/renderutils";
import Controler from "../../controler/controler";

export default class Player extends IEntity {

  playerSprite!: HTMLImageElement;

  frame: number = 0;
  readonly size = {
    w: 44,
    h: 70,
    frames: 8
  };
  private scale: number = 2;


  public async create(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<IEntity> {
    return new Promise(async (resolve) => {
      this.canvas = canvas;
      this.ctx = context;

      this.playerSprite = await getImage("assets/walking-girl2.png");

      resolve(this);
    });
  };

  readonly animationSpeed: number = 2;


  currentAnimFrame: number = 0;
  animate(): void {
    this.currentAnimFrame ++;
    if(this.currentAnimFrame % this.animationSpeed === 0) {
      this.currentAnimFrame = 0;
      this.frame++;
      if (this.frame > this.size.frames) {
        this.frame = 0;
      }
    }
  }


  draw(): void {
    if (this.playerSprite) {
      const offset = (this.frame % this.size.frames) * this.size.w;

      this.ctx.drawImage(this.playerSprite,
        offset,
        0,
        this.size.w,
        this.size.h,
        this.position.x,
        this.position.y,
        this.size.w * this.scale,
        this.size.h * this.scale);
    }
  }

  reqestanimation: boolean = false;

  update(): void {
    Controler.keymap.forEach((value, key) => {
      switch (key) {
        case "ArrowUp":
          if (value) this.moveUp();
          break;
        case "ArrowDown":
          if (value) this.moveDown();
          break;
        case "ArrowLeft":
          if (value) this.moveLeft();
          break;
        case "ArrowRight":
          if (value) this.moveRight();
          break;
      }
    });

    if(this.reqestanimation) {
      this.animate();
      this.reqestanimation = false;
    }

  }


  moveUp() {

    this.position.y -= this.position.y > 0 ? 2 * this.speed : 0;

    this.position.y = this.position.y < 0 ? 0 : this.position.y;

    this.reqestanimation = true;
  }

  moveDown() {

    this.position.y += (this.position.y - 2 * this.speed + this.playerSprite.height) <= this.canvas.height ? 2 * this.speed : 0;


    this.position.y = this.position.y > 400 - this.playerSprite.height ? 400 - this.playerSprite.height : this.position.y;

    this.reqestanimation = true;
  }

  moveLeft() {
    this.position.x -= this.position.x > 0 ? 2 * this.speed : 0;

    this.position.x = this.position.x < 0 ? 0 : this.position.x;
    this.reqestanimation = true;
  }

  moveRight() {

    this.position.x += (this.position.x - (2 * this.speed) + this.size.w) <= this.canvas.width ? 2 * this.speed : 0;

    this.position.x = this.position.x > 400 ? 400 : this.position.x;
    this.reqestanimation = true;
  }


}