import type { pos } from "../render/renderutils";
import screen from "../screen/impl/gamescreen";
import game from "../Game";

export default abstract class IEntity {
    protected canvas!: HTMLCanvasElement;
    protected ctx!: CanvasRenderingContext2D;

    constructor(protected gameinstance: game) {
        this.canvas = gameinstance.canvas;
        // @ts-ignore
        this.ctx = gameinstance.ctx;
    }

    private _position: pos = { x: 0, y: 0 };

    public speed: number = 4;

    get position(): pos {
        return this._position;
    }

    set position(value: pos) {
        this._position = value;
    }

    public async create(): Promise<IEntity> {
        return new Promise(resolve => {
            resolve(this);
        });
    };


    public async update(): Promise<void> {
        return new Promise(resolve => {
            resolve();
        });
    };


    public abstract draw(): void;
    public async destroy(): Promise<void> {
        return new Promise(resolve => {
            if(game.entities){
                game.entities.splice(game.entities.indexOf(this), 1);
            }
            resolve();
        });
    };
}