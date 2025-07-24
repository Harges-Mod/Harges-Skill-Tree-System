import { using } from "./ModClasses.js";

using("Terraria", "Microsoft.Xna.Framework", "Microsoft.Xna.Framework.Graphics", "Terraria.GameInput");

let RegisteredNodes = [];
let level = 80;

const MakeVector = (x, y) => {
    let v = Vector2.new();
    v.X = x;
    v.Y = y;
    return v;
};

let MapOffset = MakeVector(0, 0);
let dragging = false;
let lastMousePos = MakeVector(0, 0);
class ButtonUtils {
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

class Button {
    constructor(TexturePath, Position = Vector2.Zero) {
        this.TexturePath = TexturePath;
        this.Position = Position;
    }

    LoadAssets() {
        try {
            this.Texture = tl.texture.load(this.TexturePath);
        } catch (e) {
            tl.log(e);
        }
    }

    Draw() {}
}
class NodeButton extends Button {
    constructor(TexturePath, Position) {
        super(TexturePath, Position);
        this.hovering = false;
    }

    Draw() {
        if (!this.Texture) return;

        const scale = Main.screenHeight / 246;
        const playerPos = MakeVector(Main.screenWidth / 2, Main.screenHeight / 2);

        const drawPos = MakeVector(playerPos.X + this.Position.X * scale, playerPos.Y + this.Position.Y * scale);
        const origin = MakeVector(this.Texture.Width / 2, this.Texture.Height / 2);

        this.hovering = ButtonUtils.Hovering(this.Texture, drawPos, scale);

        if (this.hovering && Main.mouseLeftRelease && Main.mouseLeft) {
            Main.NewText("Clicado", 100, 0, 0);
            if (Node.DrawState === Node.States.Nothing) {
                Node.DrawState = Node.States.MapNode;
            } else {
                Node.DrawState = Node.States.Nothing;
            }
        }

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
        ](this.Texture, drawPos, null, Color.White, 0, origin, scale, SpriteEffects.None, 0.0);
    }
}

class Node {
    static DrawState = 0;
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
        RegisteredNodes.push(this);
    }

    UpdateColor() {
        this.Color = this.unlock ? Color.White : Color.Gray;
    }

    static ResetMap = () => (MapOffset = MakeVector(0, 0));

    static MapControl = () => {
        let currentMouse = MakeVector(Main.mouseX, Main.mouseY);

        if (Main.mouseLeft && !dragging) {
            dragging = true;
            lastMousePos = currentMouse;
        } else if (!Main.mouseLeft) {
            dragging = false;
        }

        if (dragging) {
            let deltaX = currentMouse.X - lastMousePos.X;
            let deltaY = currentMouse.Y - lastMousePos.Y;
            MapOffset.X += deltaX * 0.5;
            MapOffset.Y += deltaY * 0.5;
            lastMousePos = currentMouse;
        }
    };

    static NodeMouseLogic = () => {
        let mouseCentered = MakeVector((PlayerInput.MouseX - Main.screenWidth / 2) / (Main.screenWidth / 2), (PlayerInput.MouseY - Main.screenHeight / 2) / (Main.screenHeight / 2));

        if (Node.mouseLeft) {
            Main.NewText("Clicked", 100, 0, 0);
        }

        /*Main.NewText("mouseCentered.x" + mouseCentered.X, 100, 0, 0);
        Main.NewText("mouseCentered.y" + mouseCentered.Y, 100, 0, 0);
        */
        let scale = Main.screenHeight / 246;
        RegisteredNodes.forEach(n => {
            if (!n.Texture || !n.Position || !n.visibility) return;

            let playerPos = MakeVector(Main.screenWidth / 2, Main.screenHeight / 2);
            let drawPos = MakeVector(playerPos.X + (n.Position.X + MapOffset.X) * scale, playerPos.Y + (n.Position.Y + MapOffset.Y) * scale);

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
        RegisteredNodes.forEach(n => {
            let playerPos = MakeVector(Main.screenWidth / 2, Main.screenHeight / 2);
            let origin = MakeVector(n.Texture.Width / 2, n.Texture.Height / 2);
            Main.spriteBatch[
                "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
            ](n.Back, playerPos, null, Color.White, 0, origin, 50, SpriteEffects.None, 0.0);
        });
    };
    static drawLine = (start, end, color, thickness = 2) => {
        let direction = MakeVector(end.X - start.X, end.Y - start.Y);
        let length = Math.sqrt(direction.X * direction.X + direction.Y * direction.Y);
        let rotation = Math.atan2(direction.Y, direction.X);
        let origin = MakeVector(0, 0.5); // alinha ao centro vertical
        let scale = MakeVector(thickness, length); // X = espessura, Y = comprimento

        Main.spriteBatch[
            "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects effects, float layerDepth)"
        ](GameContent.TextureAssets.MagicPixel.Value, start, null, color, rotation, origin, scale, SpriteEffects.None, 0);
    };

    static DrawNode = () => {
        let scale = Main.screenHeight / 246;
        let playerPos = MakeVector(Main.screenWidth / 2, Main.screenHeight / 2);

        // 1. Desenhar links pai-filho com linha fina
        RegisteredNodes.forEach(n => {
            if (!n.children || !n.Position || !n.visibility) return;

            let start = MakeVector(playerPos.X + (n.Position.X + MapOffset.X) * scale, playerPos.Y + (n.Position.Y + MapOffset.Y) * scale);

            n.children.forEach(child => {
                if (!child || !child.Position || !child.visibility) return;

                let end = MakeVector(playerPos.X + (child.Position.X + MapOffset.X) * scale, playerPos.Y + (child.Position.Y + MapOffset.Y) * scale);

                // Aqui ajustamos a espessura para 0.3 pra linha fina
                // Node.drawLine(start, end, Color.Gray, 0.3);
            });
        });

        // 2. Desenhar os nodes normalmente
        RegisteredNodes.forEach(n => {
            if (!n.Texture || !n.Position || !n.visibility) return;

            let drawPos = MakeVector(playerPos.X + (n.Position.X + MapOffset.X) * scale, playerPos.Y + (n.Position.Y + MapOffset.Y) * scale);
            let origin = MakeVector(n.Texture.Width / 2, n.Texture.Height / 2);
            let highOrigin = MakeVector(n.HighlightTexture.Width / 2, n.HighlightTexture.Height / 2);

            Main.spriteBatch[
                "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
            ](n.Texture, drawPos, null, n.Color, 0, origin, scale, SpriteEffects.None, 0.0);

            if (n.hovering) {
                Main.spriteBatch[
                    "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
                ](n.HighlightTexture, drawPos, null, n.Color, 0, highOrigin, scale, SpriteEffects.None, 0.0);
            }
        });
    };

    static UpdateNode = () => {
        Node.UpdateNodeVisibility();
        Node.NodeMouseLogic();
    };

    static LoadAssets = () => {
        try {
            RegisteredNodes.forEach(n => {
                n.Texture = tl.texture.load(n.TexturePath);
                n.HighlightTexture = tl.texture.load("Textures/DefaultIconHighlight.png");
                n.Back = tl.texture.load("Textures/Back.png");
            });
        } catch (e) {
            tl.log(e);
        }
    };
    static UpdateNodeVisibility = () => {
        RegisteredNodes.forEach(n => {
            if (!n.children || n.children.length === 0) {
                n.visibility = true;
            } else {
                n.visibility = n.children.every(child => child && child.unlock);
            }
        });
    };

    static UnlockNode = nodeType => RegisteredNodes.forEach(n => (n.unlock = n.name === nodeType ? true : n.unlock));

    static Create = (name = "", levelMin = 0, children = null, TexturePath = null, Position = Vector2.Zero) => {
        if (children && Array.isArray(children)) {
            children = children.map(childName => Node.GetNodeByName(childName));
        } else if (typeof children === "string") {
            children = [Node.GetNodeByName(children)];
        }
        return new Node(name, levelMin, children, TexturePath, Position);
    };

    static GetNodeByName = name => RegisteredNodes.find(n => n.name === name);
}

// Testing Nodes
Node.Create("Starter", 1, null, "Textures/DefaultIcon.png", MakeVector(0, 0));

Node.Create("Begginer", 1, "Starter", "Textures/DefaultIcon.png", MakeVector(60, -30));

Node.Create("Begginer2", 1, "Starter", "Textures/DefaultIcon.png", MakeVector(-60, -30));

Node.Create("Experto", 1, ["Begginer", "Begginer2"], "Textures/DefaultIcon.png", MakeVector(0, -60));

let NodeMainButton = new NodeButton("Textures/DefaultIcon.png", MakeVector(200, 0));

Main.DrawInfernoRings.hook((orig, sf) => {
    orig(sf);

    if (Node.DrawState == 1) {
        Node.DrawNodeBrackGround();
        Node.DrawNode();
        Node.MapControl();
        Node.UpdateNode();
    }
    NodeMainButton.Draw();
});

Main.DrawInterface.hook((orig, sf, gameTime) => {
    if (Node.DrawState == 0) orig(sf, gameTime);
});

Main.Initialize_AlmostEverything.hook((orig, self) => {
    orig(self);
    Node.LoadAssets();
    NodeMainButton.LoadAssets();
    Node.UpdateNodeVisibility();
});

/*
// Draw in Screen and World Position Bizarre.
Main.DrawLiquid.hook((orig, sf, bg, waterStyle, Alpha, drawSinglePassLiquids) => {
    orig(sf, bg, waterStyle, Alpha, drawSinglePassLiquids);
});
// Exelent But Draw before DrawDust.
Main.DrawGore.hook((orig, self) => {
});

Main.DrawInterface_12_IngameFancyUI.hook((orig, sf) => {
    return orig(sf);
});

**/
