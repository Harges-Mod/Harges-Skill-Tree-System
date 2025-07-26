import Node from "../Common/Node.js";
import * as xna from "../Utilities/XnaUtils.js";

let MakeVector = (x, y) => xna.vec2.instance(x, y);

Node.Create("Starter", 1, null, "Textures/DefaultIcon.png", MakeVector(0, 0));
Node.Create("Begginer", 1, "Starter", "Textures/Class/Melee.png", MakeVector(60, -30));
Node.Create("Summoner", 1, "Starter", "Textures/Class/Summoner.png", MakeVector(60, 30));

Node.Create("Mage", 1, "Starter", "Textures/Class/Mage.png", MakeVector(-60, 30));
Node.Create("Ranged", 1, "Starter", "Textures/Class/Ranged.png", MakeVector(-60, -30));
