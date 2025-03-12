define(require => {
  const PIXI = require('com/pixijs/pixi');

  class BonusLifeIndicator extends PIXI.Container {
    constructor() {
      super();

      this.WIDTH = 60;
      this.HEIGHT = 60;

      this.background = new PIXI.Sprite();
      this.matched = new PIXI.Sprite();
      this.background.texture = PIXI.Texture.fromFrame('bonusMeterBackground');
      this.matched.texture = PIXI.Texture.fromFrame('bonusMeterSymbol');     

      // Center everything
      this.background.anchor.set(0.5);
      this.matched.anchor.set(0.5);

      // Add children
      this.addChild(this.background, this.matched);

      // Hide matched by default
      this.matched.visible = false;

      // Position
      this.x = this.WIDTH >> 1;
      this.y = this.HEIGHT >> 1;

      // State
      this.revealed = false;
    }

    setState(inVal) {
      switch (inVal){
        case false:
          this.matched.visible = false;
          this.revealed = false;
          break;
        case true:
          this.matched.visible = true;
          this.revealed = true;
          break;
      }
    }

    static fromContainer(container) {
        const indicator = new BonusLifeIndicator();
        container.addChild(indicator);
        return indicator;
    }
  }

  return BonusLifeIndicator;   
});