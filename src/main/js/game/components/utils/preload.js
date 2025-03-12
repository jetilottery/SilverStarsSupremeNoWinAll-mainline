define(require => {
    const PIXI = require('com/pixijs/pixi');

    function preload(app, callback) {
        // Sprite sheets
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['backgrounds_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['game_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['i18n_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['numbers_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['plaques-0_image']);        
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['plaques-1_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['plaques-2_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['plaques-3_image']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['uiControls_image']); 
        //Preload
        app.renderer.plugins.prepare.upload(callback);
    }

    return {
        preload
    };    
});