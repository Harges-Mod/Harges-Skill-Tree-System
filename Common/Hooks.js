import ModSystem from './ModSystem.js'
import ModButton from './ModButton.js'
import Node from './SkillTree/Node.js'

import {using} from '../Utilities/ModClasses.js'

using('Terraria')



Main.DrawInfernoRings.hook((orig, sf) => {
    orig(sf);

    if (Node.DrawState) {
        Node.DrawNodeBrackGround();
        Node.DrawNode();
        Node.DrawRequisits()
        Node.MapControl();
        Node.UpdateNode();
        
    }
    
    ModButton.AddHook('Update')
});

Main.DrawInterface.hook((orig, sf, gameTime) => {
    if (!Node.DrawState) orig(sf, gameTime);
});

Main.Initialize_AlmostEverything.hook((orig, self) => {
    orig(self);

    ModSystem.AddHook("OnGameInitialize");
    ModButton.AddHook('LoadAssets')

    Node.LoadAssets();
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
