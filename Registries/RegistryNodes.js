import Node from "../Common/Node.js";
import LoadNC from "../Utilities/LoadNC.js";

LoadNC('Utilities')

let MakeVector = (x, y) => vec2.instance(x, y)

Node.Create("Starter", 1, null, "Textures/DefaultIcon.png", MakeVector(0, 0));
Node.Create("Begginer", 1, "Starter", "Textures/Class/Melee.png", MakeVector(0, -60)); // down
Node.Create("Summoner", 1, "Starter", "Textures/Class/Summoner.png", MakeVector(0, 60));

Node.Create("Mage", 1, "Starter", "Textures/Class/Mage.png", MakeVector(-60, 0));
Node.Create("Ranged", 1, "Starter", "Textures/Class/Ranged.png", MakeVector(60, 0));

// Node.Create('Boats', 2, 'Mage', 'Textures/DefaultIcon.png', MakeVector(-60, -60))