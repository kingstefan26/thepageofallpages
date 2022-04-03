export default abstract class IScreen {

  constructor(protected canvas: HTMLCanvasElement, protected context: CanvasRenderingContext2D, protected width: number, protected height: number) {
    this.canvas = canvas;
    this.context = context;
    this.height = height;
    this.width = width;
  }

  public abstract draw(): void;
  public abstract update(): void;
  public abstract resize(): void;
  public async destroy(): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  };
  public async create(): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  };
  public abstract handleMouse(x: number, y: number): void;
  public abstract handleLMB(x: number, y: number): void;
  public abstract handleRMB(x: number, y: number): void;
}