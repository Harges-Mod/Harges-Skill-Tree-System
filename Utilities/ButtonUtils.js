import * as xna from "./XnaUtils.js";
let MakeVector = (x, y) => xna.vec2.instance(x, y);

export default class ButtonUtils {
    /**
     * @param {Texture2D} texture
     * @param {Vector2} drawPos
     * @param {float} scale
     * @returns {boolean}
     */
    static Hovering(texture, drawPos, scale) {
        let origin = MakeVector(texture.Width / 2, texture.Height / 2);
        let topLeft = MakeVector(drawPos.X - origin.X * scale, drawPos.Y - origin.Y * scale);
        let bottomRight = MakeVector(drawPos.X + origin.X * scale, drawPos.Y + origin.Y * scale);
        let mouseX = PlayerInput.MouseX;
        let mouseY = PlayerInput.MouseY;
        return mouseX >= topLeft.X && mouseX <= bottomRight.X && mouseY >= topLeft.Y && mouseY <= bottomRight.Y;
    }
}
