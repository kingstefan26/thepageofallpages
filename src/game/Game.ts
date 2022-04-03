import type { Gameinterface } from "../main";
import type IEntity from "./entity/IEntity";
import { RenderEngine } from "./render/RenderEngine";
import Player from "./entity/impl/Player";
import screen from "./screen/impl/gamescreen";
import Controler from "./controler/controler";


export default class game {
  constructor(public readonly canvas: HTMLCanvasElement, public readonly ctx: CanvasRenderingContext2D | null, public readonly width: number, public readonly height: number) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }
  public entities: IEntity[] = [];

  private RenderEngine!: RenderEngine;


  private player!: Player;

  public start() {
    document.addEventListener("DOMContentLoaded", async () => {
      if(this.ctx === null) {
        console.error("Canvas context is null");
        return;
      }

      this.RenderEngine = new RenderEngine(this);

      this.player = <Player> await new Player().create(this.canvas, this.ctx)

      document.getElementById('speed')?.addEventListener('change', (e) => {
        // @ts-ignore
        this.player.speed = parseInt(e.target.value);
      });

      this.entities.push(this.player);

      const gamescreen = new screen(this.canvas, this.ctx, this.width, this.height);
      await gamescreen.create();

      this.RenderEngine.currentScreen = gamescreen;

      new Controler(this.canvas, this);

      this.RenderEngine.start();


      setInterval(() => {
        for (const entity of this.entities) {
          entity.update();
        }

        this.RenderEngine.updatescreen();

      }, 20);

    }, {
      once: true
    });
  }


}