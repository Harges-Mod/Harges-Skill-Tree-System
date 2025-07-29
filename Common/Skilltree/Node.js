import {using} from "../../Utilities/ModClasses.js";
import LoadNC from '../../Utilities/LoadNC.js'

LoadNC('Utilities')
using("Terraria", "Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics", "Terraria.GameInput");

let level = 100

export default class Node {
    static RegisteredNodes = [];
    static MapOffset = UVector2.instance(0, 0)
    static Dragging = false
    static lastMousePos = UVector2.instance(0,0)
    static currentMouse = UVector2.instance(0, 0)
    
    static DrawState = false;
    static States = {
        Nothing: 0,
        MapNode: 1
    };

    constructor(name, minLevel = 0, children = null, TexturePath = null, Position = Vector2.Zero) {
        this.name = name;
        this.children = children;
        this.unlock = false;
        this.minLevel = minLevel;
        this.visibility = false;
        this.TexturePath = TexturePath;
        this.Position = Position;
        this.Color = Color.Gray;
        Node.RegisteredNodes.push(this);
    }

    UpdateColor() {
        this.Color = this.unlock ? Color.White : Color.Gray;
    }

    static ResetMap = () => (Node.MapOffset = UVector2.instance(0, 0));

    static MapControl = () => {
        Node.currentMouse = UVector2.instance(Main.mouseX, Main.mouseY);

        if (Main.mouseLeft && !Node.Dragging) {
            Node.Dragging = true;
            Node.lastMousePos = Node.currentMouse;
        } else if (!Main.mouseLeft) {
            Node.Dragging = false;
        }

        if (Node.Dragging) {
            let deltaX = Node.currentMouse.X - Node.lastMousePos.X;
            let deltaY = Node.currentMouse.Y - Node.lastMousePos.Y;
            Node.MapOffset.X += deltaX * 0.5;
            Node.MapOffset.Y += deltaY * 0.5;
            Node.lastMousePos = Node.currentMouse;
        }
    };

    static NodeMouseLogic = () => {
        let mouseCentered = UVector2.instance((PlayerInput.MouseX - Main.screenWidth / 2) / (Main.screenWidth / 2), (PlayerInput.MouseY - Main.screenHeight / 2) / (Main.screenHeight / 2));

        /*Main.NewText("mouseCentered.x" + mouseCentered.X, 100, 0, 0);  
    Main.NewText("mouseCentered.y" + mouseCentered.Y, 100, 0, 0);  
    */
        let scale = Main.screenHeight / 246;
        Node.RegisteredNodes.forEach(n => {
            if (!n.Texture || !n.Position || !n.visibility) return;

            let playerPos = UVector2.instance(Main.screenWidth / 2, Main.screenHeight / 2);
            let drawPos = UVector2.instance(playerPos.X + (n.Position.X + Node.MapOffset.X) * scale, playerPos.Y + (n.Position.Y + Node.MapOffset.Y) * scale);

            n.hovering = ButtonUtils.Hovering(n.Texture, drawPos, scale);

            if (n.hovering && Main.mouseLeftRelease && Main.mouseLeft) {
                if (level >= n.minLevel && !n.unlock) {
                    level -= n.minLevel;
                    Node.UnlockNode(n.name);
                    Main.NewText("Node " + n.name + " desbloqueado!", 100, 0, 0);
                }
            }

            n.UpdateColor();
        });
    };
    static DrawNodeBrackGround = () => {
        let screenCenter = UVector2.instance(Main.screenWidth / 2, Main.screenHeight / 2);
        let origin = UVector2.instance(0.5, 0.5); // Centraliza o pixel mágico

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float layerDepth)"
        ](
            GameContent.TextureAssets.MagicPixel.Value,
            screenCenter,
            null,
            Color.Lerp(Color.Blue, Color.Transparent, 0.5), // Cor mais apropriada para fundo
            0,
            origin,
            UVector2.instance(Main.screenWidth, Main.screenHeight),
            SpriteEffects.None,
            0
        );
    };

    static drawLine(start, target, color, thickness) {
    let direction = UVector2.instance(target.X - start.X, target.Y - start.Y);
    let length = Math.sqrt(direction.X * direction.X + direction.Y * direction.Y);
    let rotation = Math.atan2(direction.Y, direction.X);
    let origin = UVector2.instance(0, 0.5);
    let scale = UVector2.instance(length, thickness * 0.001);

    Main.spriteBatch[
        "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float layerDepth)"
    ](
        GameContent.TextureAssets.MagicPixel.Value,
        start,
        null,
        color,
        rotation,
        origin,
        scale,
        SpriteEffects.None,
        0
    );
}

    static DrawNode = () => {
        let scale = Main.screenHeight / 246;
        let playerPos = UVector2.instance(Main.screenWidth / 2, Main.screenHeight / 2);

        Node.RegisteredNodes.forEach(n => {
            if (!n.children || !n.Position || !n.visibility) return;

            let start = UVector2.instance(playerPos.X + (n.Position.X + Node.MapOffset.X) * scale, playerPos.Y + (n.Position.Y + Node.MapOffset.Y) * scale);

            n.children.forEach(child => {
                if (!child || !child.Position || !child.visibility) return;

                let end = UVector2.instance(playerPos.X + (child.Position.X + Node.MapOffset.X) * scale, playerPos.Y + (child.Position.Y + Node.MapOffset.Y) * scale);

                Node.drawLine(start, end, UColor.hexToRgb('#bbd2fe'), 3);
            });
        });

        Node.RegisteredNodes.forEach(n => {
            if (!n.Texture || !n.Position || !n.visibility) return;

            let drawPos = UVector2.instance(playerPos.X + (n.Position.X + Node.MapOffset.X) * scale, playerPos.Y + (n.Position.Y + Node.MapOffset.Y) * scale);
            let origin = UVector2.instance(n.Texture.Width / 2, n.Texture.Height / 2);
            let highOrigin = UVector2.instance(n.HighlightTexture.Width / 2, n.HighlightTexture.Height / 2);

            Main.spriteBatch[
                "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
            ](n.Texture, drawPos, null, n.Color, 0, origin, scale, SpriteEffects.None, 0.0);

            if (n.hovering) {
                Main.spriteBatch[
                    "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
                ](n.HighlightTexture, drawPos, null, Color.White, 0, highOrigin, scale, SpriteEffects.None, 0.0);
            }
        });
    };

    static UpdateNode = () => {
        Node.UpdateNodeVisibility();
        Node.NodeMouseLogic();
    };

    static LoadAssets = () => {
        try {
            Node.RegisteredNodes.forEach(n => {
                n.Texture = tl.texture.load(n.TexturePath);
                n.HighlightTexture = tl.texture.load("Textures/DefaultIconHighlight.png");
                // n.Back = tl.texture.load("Textures/Back.png");
            });
        } catch (e) {
            tl.log(e);
        }
    };
    static UpdateNodeVisibility = () => {
        Node.RegisteredNodes.forEach(n => {
            if (!n.children || n.children.length === 0) {
                n.visibility = true;
            } else {
                n.visibility = n.children.every(child => child && child.unlock);
            }
        });
    };

    static UnlockNode = nodeType => Node.RegisteredNodes.forEach(n => (n.unlock = n.name === nodeType ? true : n.unlock));

    static Create = (name = "", levelMin = 0, children = null, TexturePath = null, Position = Vector2.Zero) => {
        if (children && Array.isArray(children)) {
            children = children.map(childName => Node.GetNodeByName(childName));
        } else if (typeof children === "string") {
            children = [Node.GetNodeByName(children)];
        }
        return new Node(name, levelMin, children, TexturePath, Position);
    };

    static GetNodeByName = name => Node.RegisteredNodes.find(n => n.name === name);
}