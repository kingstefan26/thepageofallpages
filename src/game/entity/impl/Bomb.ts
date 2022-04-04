import IEntity from "../IEntity";
import { getImage } from "../../render/renderutils";

export default class Bomb extends IEntity {

  bombsprite: HTMLImageElement | undefined;

  private destroyTimer: number = 0;

  public async create(): Promise<IEntity> {
    return new Promise(async (resolve) => {

      this.bombsprite = await getImage("assets/bomb_circle.png");


      const url = new Array(15).fill(null).map((_, i) => `/assets/bomb/${i}.gif`);


      for (let i = 0; i < 15; i++) {
        (this.waitingWolf)[i] = await getImage(url[i]);
      }

      console.log(this.waitingWolf);

      this.destroyTimer = performance.now() + 3000;

      resolve(this);
    });
  };

  drawAnimatedImage(arr: string | any[], x: number, y: number, angle: number, factor: number, changespeed: number) {
    console.log('drawing expostion');
    if (!factor) {
      factor = 1;
    }
    if (!changespeed) {
      changespeed = 1;
    }
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle * Math.PI / 180);
    if (!!arr[Math.round(Date.now()/changespeed) % arr.length]) {
      this.ctx.drawImage(arr[Math.round(performance.now()/changespeed) % arr.length], -(arr[Math.round(performance.now()/changespeed) % arr.length].width * factor / 2), -(arr[Math.round(Date.now()/changespeed) % arr.length].height * factor / 2), arr[Math.round(performance.now()/changespeed) % arr.length].width * factor, arr[Math.round(performance.now()/changespeed) % arr.length].height * factor);
    }
    this.ctx.restore();
  }

  waitingWolf: HTMLImageElement[] = [];


  draw(): void {


    if(this.destroyTimer < (performance.now() + 300)) {

      if (this.waitingWolf.length == 15) {
        this.drawAnimatedImage(this.waitingWolf,this.position.x + ( this.waitingWolf[0].width / 2) ,this.position.y  + ( this.waitingWolf[0].height / 2) ,0,1,60)
      }
    }else {
      if (this.bombsprite) {
        this.ctx.drawImage(this.bombsprite, this.position.x, this.position.y, this.bombsprite.width, this.bombsprite.height);
        this.ctx.font = '200px';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText((this.destroyTimer - performance.now()).toFixed(1), this.position.x, this.position.y);
      }
    }

  }

  update(): Promise<void> {
    return new Promise(async (resolve) => {
      if(this.destroyTimer < performance.now()) {
        console.log("Bomb destroyed");
        await this.destroy();
      }
      resolve();
    });
  }

}