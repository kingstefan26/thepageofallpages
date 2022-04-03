import IScreen from "../IScreen";
import { getImage } from "../../render/renderutils";

export default class screen extends IScreen {


  private backbroudimage: HTMLImageElement | undefined = undefined;

  async create(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // const game = document.getElementById("trashyhoe");

      this.backbroudimage = await getImage("assets/me.png");


      // const backgroudimagewitdh = this.width;
      // const backgroudimageheight = this.height;
      //
      // if(game){
      //   game.style.width = backgroudimagewitdh + "px";
      // }

      resolve();
    })
  }

  draw(): void {
    if (this.backbroudimage) {
      this.context.drawImage(this.backbroudimage, 0, 0, this.backbroudimage.width, this.backbroudimage.height, 0, 0, this.width, this.height);
    }
  }

  handleLMB(x: number, y: number): void {
  }

  handleMouse(x: number, y: number): void {
  }

  handleRMB(x: number, y: number): void {
  }

  resize(): void {
  }

  update(): void {
  }


}