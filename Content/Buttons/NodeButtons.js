import * as xna from '../../Utilities/XnaUtils.js'
import Button from '../../Common/ModButton.js'
import Node from '../../Common/Node.js'
import {using} from '../../Utilities/ModClasses.js'

using('Terraria')

 let MakeVector = (x, y) => xna.vec2.instance(x, y)

export default class NodeButton extends Button {
   constructor() {
        super();
        this.TexturePath = "Textures/DefaultIcon.png";
        this.Position = MakeVector(0, 0);
    }

    OnHover() {}
    Clicked() {
        Node.ResetMap();
        Main.NewText("Hover", 100, 0, 0);
        Node.DrawState = !Node.DrawState;
    }

    Draw() {
        if (!this.Texture) return;

        const scale = Main.screenHeight / 246;
        const playerPos = MakeVector(Main.screenWidth / 2, Main.screenHeight / 2);

        const drawPos = MakeVector(playerPos.X + this.Position.X * scale, playerPos.Y + this.Position.Y * scale);
        const origin = MakeVector(this.Texture.Width / 2, this.Texture.Height / 2);

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
        ](this.Texture, drawPos, null, Color.White, 0, origin, scale, SpriteEffects.None, 0.0);
    }
}