export default class ModSystem {
    static Add = data => ModSystem.Registered.push(new data());
    static Registered = [];
    static AddHook = data => ModSystem.Registered.forEach(h => h[data]());

    static GetSystem = data => ModSystem.Registered.find(n => n == data);

    OnGameInitialize() {}
    OnNodeClicked() {
        // AFTER ADD LOGIC.
    }
}
