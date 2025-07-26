import * as xna from '../Utilities/XnaUtils.js'
import ButtonUtils from '../Utilities/ButtonUtils.js'
import {using} from '../Utilities/ModClasses.js'
using('Terraria')

let MakeVector = (x, y) => xna.vec2.instance(x, y)

export default class ModButton {
    static Registered = []
    
    constructor(TexturePath, Position = Vector2.Zero) {
        this.TexturePath = TexturePath;
        this.Position = Position;
    }
   
    static AddHook = (data, ...param) => ModButton?.Registered?.forEach(h => h[data](...param))
    static GetButton = data => ModButton?.Registered.find(b => b?.constructor?.name == data)
    static Add = data => ModButton.Registered.push(new data());

    Clicked() {}
    OnHover() {}
    Draw() {}
   Update() {
        try {
            let playerPos = MakeVector(Main.screenWidth / 2, Main.screenHeight / 2);

            this.scale = Main.screenHeight / 246;
            this.hovering = ButtonUtils.Hovering(this.Texture, MakeVector(playerPos.X + this.Position.X * this.scale, playerPos.Y + this.Position.Y * this.scale), this.scale);
            if (this.hovering) this.OnHover();
            if (this.hovering && Main.mouseLeftRelease && Main.mouseLeft) this.Clicked();
            this.Draw();
        } catch (e) {
            tl.log(e);
        }
    }

    LoadAssets() {
        try {
            this.Texture = tl.texture.load(this.TexturePath);
        } catch (e) {
            tl.log(e);
        }
    }
    
}