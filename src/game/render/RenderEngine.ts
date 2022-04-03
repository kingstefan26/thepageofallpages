import type Screen from "../screen/IScreen";
import type game from "../Game";

export class RenderEngine {
  private parentgame: game;

  constructor(parent: game) {
    this.parentgame = parent;
  }

  private shouldStop: boolean = false;

  private avgFrameTime: number = 0;
  private frameTime: number = 0;
  private lastDraw: number = 0;
  private fps: string = '';

  public start = () => {
    console.log("starting render engine");
    const tharenderloop = setInterval(() => {
      if (!this.shouldStop) {
        this.render();
        const now = performance.now();
        this.frameTime = now - this.lastDraw;
        this.lastDraw = now;
        this.avgFrameTime += (this.frameTime - this.avgFrameTime) / 10;
        this.fps = (1000 / this.avgFrameTime).toFixed(1);
      } else {
        clearInterval(tharenderloop);
      }
    }, 0);

    const fpsptag = document.getElementById('fps')
    if(fpsptag) {
      const fpsloop = setInterval(() => {
        if (!this.shouldStop) {

          fpsptag.innerHTML = `${this.fps} FPS | ${this.avgFrameTime.toFixed(1)} ms`;

        } else {
          clearInterval(fpsloop);
        }
      }, 1000);

    }


  }


  public stop = () => {
    console.log("stopping render engine");
    this.shouldStop = true;
  }



  private currentscreen: Screen | undefined;

  set currentScreen(screen: Screen) {
    this.currentscreen = screen;
  }

  // clear => background => entities => particles => fx => ui
  public render() {

    this.parentgame.ctx?.rect(0, 0, this.parentgame.canvas.height, this.parentgame.canvas.width);

    // background
    this.currentscreen?.draw();

    // entities

    for (const entity of this.parentgame.entities){
      entity.draw();
    }

    // particles

    // fx

    // ui

  }

  public updatescreen() {
    this.currentscreen?.update();
  }


}

