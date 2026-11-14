(() => {
    const menu = window.HorrorMenuParams;

    if (!menu || !Array.isArray(menu.parsedCommands)) {
        throw new Error("[Bestiario_Menu] No se encontró la lista de comandos del menú.");
    }

    if (menu.iconAlignMode === "Absolute Center") {
        menu.iconOffsetX = -118;
    }

    if (typeof CGMZ_Scene_Encyclopedia !== "function") {
        throw new Error("[Bestiario_Menu] No se encontró la escena de la enciclopedia.");
    }

    if (menu.parsedCommands.some(command => command.Symbol === "bestiary")) {
        return;
    }

    menu.parsedCommands.push({
        Name: "Bestiario",
        Symbol: "bestiary",
        ActionType: "customScene",
        SceneClass: "CGMZ_Scene_Encyclopedia",
        CommonEventId: "0",
        IconIndex: "0"
    });

    const originalCreateVisualButtons = Scene_Menu.prototype.createVisualButtons;

    Scene_Menu.prototype.createVisualButtons = function() {
        originalCreateVisualButtons.call(this);

        const abilitiesButton = this._menuSprites.find(button =>
            button && button._cmd && button._cmd.Symbol === "abilities"
        );
        if (!abilitiesButton || !abilitiesButton._iconSprite) return;

        const label = typeof window.WTE_Translate === "function"
            ? window.WTE_Translate(abilitiesButton._cmd.Name)
            : abilitiesButton._cmd.Name;
        const textBitmap = new Bitmap(1, 1);
        textBitmap.fontFace = $gameSystem.mainFontFace();
        textBitmap.fontSize = $gameSystem.mainFontSize() || 26;
        const labelWidth = textBitmap.measureTextWidth(label);
        textBitmap.destroy();

        const iconWidth = ImageManager.iconWidth || 32;
        const labelLeft = (menu.btnWidth - labelWidth) / 2;
        const minIconX = 8 + iconWidth / 2;
        const maxIconX = labelLeft - 8 - iconWidth / 2;
        abilitiesButton._iconSprite.x = Math.max(
            minIconX,
            Math.min(abilitiesButton._iconSprite.x, maxIconX)
        );
    };

    const originalHandler = Scene_Menu.prototype.handleCustomCommand;

    Scene_Menu.prototype.handleCustomCommand = function(command) {
        if (command.Symbol === "bestiary") {
            SceneManager.push(CGMZ_Scene_Encyclopedia);
            SceneManager.prepareNextScene("bestiary");
            return;
        }

        originalHandler.call(this, command);
    };
})();
