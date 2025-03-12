define((require) => {
  const PIXI = require('com/pixijs/pixi');
  const NumberCard = require('./NumberCard');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  
  class WinningNumber extends NumberCard {
    constructor() {
      super();
      if (PIXI.utils.TextureCache.luckyNumberBackground !== undefined) {
        this.background.texture = PIXI.Texture.fromFrame('luckyNumberBackground');
      }

      // Check if we should use the winning textures at all times
      if (gameConfig.luckyNumbersAsWinningState){
        this.useWinningFrameAtAllTimes = true;
      }

      // Set up the spine animations for winning/lucky numbers
      this.initSpine('lucky');
      // Reset all
      this.reset();
    }

    static fromContainer(container) {
      const card = new WinningNumber();
      container.addChild(card);
      return card;
    }
  }

  return WinningNumber;
});
