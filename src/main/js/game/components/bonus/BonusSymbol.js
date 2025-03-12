define(require => {
  const PIXI = require('com/pixijs/pixi');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const utils = require('game/components/utils/utils');

  class BonusSymbol extends PIXI.Container {
    constructor() {
      super();

      const _this = this;

      this.WIDTH = 60;
      this.HEIGHT = 60;

      this.baseMeterBackground = new PIXI.Sprite();
      this.baseMeterBackground.texture = PIXI.Texture.fromFrame('baseMeterBackground');

      // Center everything
      this.baseMeterBackground.anchor.set(0.5);

      // Spine anim
      this.spineAnim = new PIXI.spine.Spine( resLib.spine['basegameMeterIcon_land'].spineData);           

      // Add all to the master container
      this.addChild(this.baseMeterBackground, this.spineAnim);

      // Hide spine anim by default
      this.spineAnim.renderable = false;

      // Add a listener for complete
      this.spineAnim.state.addListener({
        complete: () => {
          _this.setState('MATCH');
        }
      });

      // State
      this.revealed = false;
    }

    setState(inVal) {
      switch (inVal){
        case 'OFF':
          this.baseMeterBackground.visible = true;
          this.revealed = false;
          utils.stopSpineAnim(this.spineAnim);
          break;
        case 'MATCH':
          this.baseMeterBackground.visible = false;
          this.revealed = true;
          break;
      }
    }

    reset() {
      this.setState('OFF');
    }

    bonusLand(auto) {      
      this.spineAnim.renderable = true;
      const anim = auto ? 'meterIconLand_autoPlay' : 'meterIconLand';
      this.spineAnim.state.setAnimationByName(0, anim, false);      
    }

    static fromContainer(container) {
      const sym = new BonusSymbol();
      container.addChild(sym);
      return sym;
    }
  }

  return BonusSymbol;
});
