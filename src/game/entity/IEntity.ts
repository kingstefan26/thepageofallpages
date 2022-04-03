import type { pos } from "../render/renderutils";
import screen from "../screen/impl/gamescreen";

export default abstract class IEntity {
    protected canvas!: HTMLCanvasElement;
    protected ctx!: CanvasRenderingContext2D;

    private _position: pos = { x: 0, y: 0 };

    public speed: number = 4;

    get position(): pos {
        return this._position;
    }

    set position(value: pos) {
        this._position = value;
    }

    public async create(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<IEntity> {
        return new Promise(resolve => {
            this.canvas = canvas;
            this.ctx = context;
            resolve(this);
        });
    };

    public abstract update(): void;
    public abstract draw(): void;
    public async destroy(): Promise<void> {
        return new Promise(resolve => {
            resolve();
        });
    };
}