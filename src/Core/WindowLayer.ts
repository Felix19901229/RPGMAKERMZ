declare type Window_MapName=any;
declare type Window_Message=any;
declare type Window_ScrollText=any;
declare type Window_Gold=any;
declare type Window_NameBox=any;
declare type Window_ChoiceList=any;
declare type Window_NumberInput=any;
declare type Window_EventItem=any;
declare type Sprite_Button=any;
declare type children = (Window_MapName|Window_Message|Window_ScrollText|Window_Gold|Window_NameBox|Window_ChoiceList|Window_NumberInput|Window_EventItem|Sprite_Button)[];
//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class
 * @extends PIXI.Container
 */
export class WindowLayer extends PIXI.Container {
    children: children=[];
    constructor(...args:any[]) {
        super();
        this.initialize(...args);
    }
    public initialize(...args) {
        PIXI.Container.call(this);
    }

    /**
     * Updates the window layer for each frame.
     */
    public update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Renders the object using the WebGL renderer.
     *
     * @param {PIXI.Renderer} renderer - The renderer.
     */
    public render (renderer:PIXI.Renderer) {
        if (!this.visible) {
            return;
        }

        const graphics = new PIXI.Graphics();
        const gl = renderer.gl;
        const children = this.children.clone();

        (renderer.framebuffer as any).forceStencil();
        graphics.transform = this.transform;
        renderer.batch.flush();
        gl.enable(gl.STENCIL_TEST);

        while (children.length > 0) {
            const win = children.pop();
            if (win._isWindow && win.visible && win.openness > 0) {
                gl.stencilFunc(gl.EQUAL, 0, ~0);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                win.render(renderer);
                renderer.batch.flush();
                graphics.clear();
                win.drawShape(graphics);
                gl.stencilFunc(gl.ALWAYS, 1, ~0);
                gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
                gl.blendFunc(gl.ZERO, gl.ONE);
                graphics.render(renderer);
                renderer.batch.flush();
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            }
        }

        gl.disable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.clearStencil(0);
        renderer.batch.flush();

        for (const child of this.children) {
            if (!child._isWindow && child.visible) {
                child.render(renderer);
            }
        }

        renderer.batch.flush();
    }

}

