import Node from "../Common/SkillTree/Node.js";
import NodeReq from "../Common/SkillTree/NodeRequirement.js";
import LoadNC from "../Utilities/LoadNC.js";

LoadNC("Utilities");

let MakeVector = (x, y) => UVector2.instance(x, y);

Node.Create(
    "Starter",
    NodeReq.Create(1, [1]),
    null,
    "Textures/DefaultIcon.png",
    MakeVector(0, 0)
);

Node.Create(
    "Begginer",
    NodeReq.Create(1),
    "Starter",
    "Textures/Class/Melee.png",
    MakeVector(0, -60)
); // down

Node.Create(
    "Summoner",
    NodeReq.Create(1),
    "Starter",
    "Textures/Class/Summoner.png",
    MakeVector(0, 60)
);

Node.Create(
    "Mage",
    NodeReq.Create(1),
    "Starter",
    "Textures/Class/Mage.png",
    MakeVector(-60, 0)
);

Node.Create(
    "Ranged",
    NodeReq.Create(1),
    "Starter",
    "Textures/Class/Ranged.png",
    MakeVector(60, 0)
);

Node.Create(
    "Boats",
    NodeReq.Create(2),
    ["Mage", "Begginer"],
    "Textures/DefaultIcon.png",
    MakeVector(-60, -60)
);

Node.Create(
    "Boats2",
    NodeReq.Create(2),
    ["Ranged", "Begginer"],
    "Textures/DefaultIcon.png",
    MakeVector(60, -60)
);
