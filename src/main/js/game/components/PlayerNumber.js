define(require => {
  const PIXI = require('com/pixijs/pixi');
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const FittedText = require('skbJet/componentManchester/standardIW/components/fittedText');
  const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const NumberCard = require('./NumberCard');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');

  const TEXT_Y_POS = 65;
  const TEXT_PADDING = 10;
  const Y_OFFSET = -15;

  require('com/gsap/TweenMax');
  require('com/gsap/TimelineLite');
  const Tween = window.TweenMax;
  const TimelineLite = window.TimelineLite;

  class PlayerNumber extends NumberCard {
    constructor() {
      super();

      // Set background and cover textures
      if (PIXI.utils.TextureCache.yourNumberValueBackground !== undefined) {
        this.background.texture = PIXI.Texture.fromFrame('yourNumberValueBackground');
      }

      this.initSpine('player');

      // Add text for prize value
      this.valueText = new FittedText('XXXXXX');
      this.valueText.anchor.set(0.5);
      this.valueText.y = TEXT_Y_POS;
      this.valueText.style = textStyles.parse('prizeValueNoWin');
      this.valueText.maxWidth = this.WIDTH - TEXT_PADDING * 2;
      this.noWin.addChild(this.valueText);
      this.valueTextWin = new FittedText('XXXXXX');
      this.valueTextWin.anchor.set(0.5);
      this.valueTextWin.y = TEXT_Y_POS;
      this.valueTextWin.style = textStyles.parse('prizeValueWin');
      this.valueTextWin.maxWidth = this.WIDTH - TEXT_PADDING * 2;
      this.win.addChild(this.valueTextWin);

      //add some bonus symbols
      this.bonus1 = new PIXI.Sprite();
      this.bonus1.anchor.set(0.5);
      this.bonus1.texture = PIXI.Texture.fromFrame('baseIcon');
      this.bonus2 = new PIXI.Sprite();
      this.bonus2.anchor.set(0.5);
      this.bonus2.texture = PIXI.Texture.fromFrame('baseIcon');
      this.bonus1.y = -45;
      this.bonus2.y = -25;
      this.bonus1.x = this.bonus2.x = 44;
      this.bonus1.visible = this.bonus2.visible = false;
      this.addChildAt(this.bonus2, this.getChildIndex(this.resultContainer)+1);    
      this.addChildAt(this.bonus1, this.getChildIndex(this.resultContainer)+1);

      // Offset everything to account for the value text at the bottom
      this.win.y = Y_OFFSET;
      this.noWin.y = Y_OFFSET;

      this.reset();
    }

    populate([number, value, numBonus]) {
      this.number = number;
      this.value = value;
      this.numBonus = numBonus;

      //populate the fields
      this.valueText.text = SKBeInstant.formatCurrency(value).formattedAmount;      
      this.valueTextWin.text = this.valueText.text;

      //we need to show the number of bonus accumulator symbols found on this turn
      //fairly straightforward, if we have 1, show 1, if we have 2, show 1 and 2
      this.bonus1.visible = this.numBonus > 0;
      this.bonus2.visible = this.numBonus > 1;
      this.bonus1.scale.x = this.bonus1.scale.y = 0;
      this.bonus2.scale.x = this.bonus2.scale.y = 0;
            
      super.populate(number);
    }

    showBonus() {
      var _this = this;
      //we need to show the number of bonus symbols found on this turn
      //fairly straightforward, if we have 1, show 1, if we have 2, show 1 and 2
      if (_this.numBonus > 0){
        //to stop bonus symbols pulsing and going behind other pick points
        //we need to move this one to the front
        super.bringToFront();

        //check here if we've revealed this one during auto play
        let _auto = autoPlay.enabled;

        //TMP012-8 - Bonus Symbol shown before scratch animation in YOUR NUMBERS
        //TMP012-25 - Review feedback - create anticipation on star appearing.
        //scale the bonus symbols up from zero
        _this.scaleFromZero(_this.bonus1, (_this.numBonus === 1), _auto);
        if (_this.numBonus > 1){
          //slight delay before pulsing bonus2, so both are not pulsing at the same time
          Tween.delayedCall(gameConfig.delayBetweenBonusSymbolsInSeconds, function(){
            _this.scaleFromZero(_this.bonus2, (_this.numBonus === 2), _auto);  
          });
        }
      }
    }    

    scaleFromZero(sym, isFinal, auto) {
      var _this = this;
      const timeline = isFinal ? new TimelineLite({onStart:function(){
        // If we're in auto play, notify that we have found a bonus symbol immediately
        if (auto){_this.notifyBonus(_this, auto);}
      },onComplete:function(){
        // If we're in manual play, notify that we have found a bonus symbol after it has been fully revealed
        // This is so we can move it across the screen
        if (!auto){_this.notifyBonus(_this, auto);}        
      }}) : new TimelineLite({});
      timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x:2,y:2});
      timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x:1,y:1});

      if (!gameConfig.gravitateBonusItem && gameConfig.pulseBonusItemOnCollect){
        timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x:1.5,y:1.5});
        timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x:1,y:1});
        timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x:1.5,y:1.5});
        timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x:1,y:1});
      }
    }

    notifyBonus(inThis, auto) {
      var _this = inThis;
      // Publish an event with the info for this number
      msgBus.publish('Game.BonusSymFound', {
        symbol: _this, 
        numBonus: _this.numBonus, 
        bonus1: _this.bonus1, 
        bonus2: _this.bonus2, 
        auto: auto
      });
    }

    reset() {
      super.reset();
      this.valueText.text = '';
      this.valueTextWin.text = '';
      this.bonus1.visible = false;
      this.bonus2.visible = false;
    }

    static fromContainer(container) {
      const card = new PlayerNumber();
      container.addChild(card);
      return card;
    }
  }

  return PlayerNumber;
});
