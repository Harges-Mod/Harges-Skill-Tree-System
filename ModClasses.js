// EternalDev

const AppDomain = new NativeClass("System", "AppDomain");
const Assembly = new NativeClass("System.Reflection", "Assembly");

const GetAssemblies = AppDomain["Assembly[] GetAssemblies()"];
const GetTypes = Assembly["Type[] GetTypes()"];

function getAllTypes() {
    const assemblies = GetAssemblies(AppDomain.CurrentDomain);
    const allTypes = {};

    for (let i = 0; i < assemblies.length; i++) {
        const assembly = assemblies[i];
        const types = GetTypes(assembly);

        for (let j = 0; j < types.length; j++) {
            const type = types[j];
            const typeName = type.Name;
            const namespaceName = type.Namespace || "GLOBAL";

            if (!allTypes[namespaceName]) {
                allTypes[namespaceName] = new Set();
            }
            allTypes[namespaceName].add(typeName);
        }
    }
    return allTypes;
}

let allTypes = getAllTypes();
let NativeClasses = {};

function addClassToNamespace(structure, namespace, className) {
    const nativeClassInstance = new NativeClass(namespace, className);
    const namespaceParts = namespace.split('.');
    let current = structure;

    for (let i = 0; i < namespaceParts.length; i++) {
        const part = namespaceParts[i];
        if (!current[part]) {
            current[part] = {};
        }
        current = current[part];
    }
    
    current[className] = nativeClassInstance;
}

for (const namespace in allTypes) {
    const typesFromNamespace = allTypes[namespace];

    if (typesFromNamespace.size > 0) {
        for (const type of typesFromNamespace) {
            try {
                addClassToNamespace(NativeClasses, namespace, type);
            } catch (error) {
                // tl.log(`Erro ao carregar ${namespace}.${type}: ${error}`);
            }
        }
    } else {
        // tl.log(`Namespace ${namespace} não há class.`);
    }
}

export function using(...namespaces) {
    namespaces.forEach(namespace => {
    
        if (NativeClasses[namespace]) {
            const classes = NativeClasses[namespace];
            for (const className in classes) {
                const classObj = classes[className];
                globalThis[className] = classObj;
            }
        } else {
        
            const namespaceParts = namespace.split('.');
            let currentNamespace = NativeClasses;

            for (const part of namespaceParts) {
                if (currentNamespace[part]) {
                    currentNamespace = currentNamespace[part];
                } else {
                    //tl.log(`Namespace ${namespace} Not Found.`);
                    return;
                }
            }


            for (const className in currentNamespace) {
                globalThis[className] = currentNamespace[className];
            }
        }
    });
}
export function ModClass_register(namespace, className, classInstance) {
    addClassToNamespace(CustomClasses, namespace, className, classInstance);
    globalThis[className] = classInstance;
}

/*
// Terraria Path Cause Error
ModClass_register("Terraria.ID", "ItemRarityID", ItemRarityID);

// TL Path
ModClass_register("TL", "ModButton", ModButton);
ModClass_register("TL", "ModProjectile", ModProjectile);
ModClass_register("TL", "ModItem", ModItem);
ModClass_register("TL", "ModTexture", ModTexture);
ModClass_register("TL", "GlobalNPC", GlobalNPC);
ModClass_register("TL", "GlobalTile", GlobalTile);
ModClass_register("TL", "ModPlayer", ModPlayer);
ModClass_register("TL", "GlobalItem", GlobalItem);
ModClass_register("TL", "GlobalProjectile", GlobalProjectile);

// Myagiakr API
ModClass_register("Myagiakr", "vector2", vec2);
ModClass_register("Myagiakr", "color", color);
ModClass_register("Myagiakr", "MyagiakrPlayer", MyagiakrP);
ModClass_register("Myagiakr", "rectangle", rec);
ModClass_register("Myagiakr", "generic", generic);
**/
