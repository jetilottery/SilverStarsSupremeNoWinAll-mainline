define(require => {
  const PIXI = require('com/pixijs/pixi');
  const Pressable = require('skbJet/componentManchester/standardIW/components/pressable');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const utils = require('game/components/utils/utils');

  require('com/gsap/TweenMax');
  require('com/gsap/plugins/PixiPlugin');
  const Tween = window.TweenMax;

  class BonusPickPoint extends Pressable {
    constructor() {
      super();

      this.WIDTH = 168;
      this.HEIGHT = 168;

      this.resultContainer = new PIXI.Container();
      this.result = new PIXI.spine.Spine( resLib.spine['coverAnims'].spineData);

      // Result not renderable by default
      this.result.renderable = false;

      // Set up spine project
      this.spineAnim = new PIXI.spine.Spine( resLib.spine['coverAnims'].spineData);
      this.defaultState = 'BonusNumber_STATIC';
      this.setSpineState({state:'DEFAULT', loop:false});
      
      // Pick point type
      this.pickPointType = 'Bonus';
      // Interaction state
      this.interactionState = '';

      // Add win/nonwin to the result container
      this.resultContainer.addChild(this.result);

      // Add all to the master container
      this.addChild(this.resultContainer, this.spineAnim);

      // State
      this.revealed = false;
      //disabled by default
      this.enabled = false;

      // Position this
      this.x = this.WIDTH >> 1;
      this.y = this.HEIGHT >> 1;

      // Interactivity
      this.hitArea = new PIXI.Rectangle(
        this.WIDTH / -2,
        this.HEIGHT / -2,
        this.WIDTH,
        this.HEIGHT
      );

      this.on('press', () => {
        if (!autoPlay.enabled) {
          this.reveal();
        }
      });
      //add the pointerover event
      this.off('pointerover');
      this.on('pointerover', () => {
        this.rollover();
      }); 
      this.off('pointerout');
      this.on('pointerout', () => {
        this.stopRollover();
      });
    }

    enable() {
      return new Promise(resolve => {
        this.reveal = resolve;
        this.enabled = true;
      }).then(() => {
        this.enabled = false;
      });
    }

    disable() {
      this.enabled = false;
      this.reveal = undefined;
    }

    populate(inVal) {
      this.result.renderable = true;
      const nextState = inVal === "1" ? 'BonusWinSymbol_loop' : 'BonusLose' ;
      this.result.state.setAnimationByName(0, nextState, true);
    }

    setBonusVal(inVal){
      this.bonusVal = inVal;
    }

    reset(){
      this.setSpineState({state:'STATIC', loop:true});
      this.result.renderable = false;
      this.revealed = false;
      this.filters = [];
      utils.stopSpineAnim(this.result);
      utils.removeSpineListeners(this.spineAnim);
    }

    rollover() {      
      msgBus.publish('Bonus.StopIdle');
      msgBus.publish('Game.BonusOver', this);
      this.setSpineState({state:'ROLLOVER', loop:false});
    }

    stopRollover() {
      const _this = this;      
      msgBus.publish('Game.BonusOut', _this);
      if (_this.interactionState !== 'ROLLOVER'){
        return;
      }else{        
        _this.setSpineState({state:'ROLLOUT', loop:false});
        // Add a listener, removing all first
        utils.removeSpineListeners(_this.spineAnim);
        _this.spineAnim.state.addListener({
          complete: function(entry) {
            if(entry.animation.name === _this.pickPointType+'Number_MOUSEOUT'){
              msgBus.publish('Bonus.ResetIdle');
            }                        
          }
        });
      }         
    }

    prompt(){
      this.bringToFront();
      this.setSpineState({state:'IDLE', loop:true});
    }

    stopIdle(){
      this.setSpineState({state:'DEFAULT', loop:false});
    }

    bringToFront(){
      // we need to move this pick point to the front
      // as otherwise the coverAnim will underlap neighbouring pickPoints
      this.parent.parent.setChildIndex(
        this.parent,
        this.parent.parent.children.length - 1
      );
    }

    greyscale(duration) {
      Tween.to(this, duration, { pixi: { saturation: 0 } });
    }

    setSpineState(data) {
      this.spineAnim.visible = true;
      let nextState;
      let doLoop = data.loop || false;
      let syncTime = data.sync || 0;
      switch (data.state){
        case 'DEFAULT':
          nextState = this.defaultState;
          break;
        case 'IDLE':
          nextState = this.pickPointType+'Number_IDLE';
          break;
        case 'ROLLOVER':
          nextState = this.pickPointType+'Number_MOUSEOVER';
          break;
        case 'ROLLOUT':
          nextState = this.pickPointType+'Number_MOUSEOUT';
          break;
        case 'REVEAL':
          nextState = this.pickPointType+'Number_REVEAL';
          break;
        case 'OFF':
          nextState = this.defaultState;      
          this.spineAnim.visible = false;
          break;
        default:
          nextState = this.defaultState;
          break;
      }

      // If we're already in a rollout state, we don't want to be forcing the state back to default
      // as this would interrupt the rollout animation, so if we're going back to default, don't do anything
      if (this.interactionState === 'ROLLOUT' && nextState === this.defaultState){
        return;
      }

      // Store the interaction state
      this.interactionState = data.state;

      utils.log('Changing spine state to: '+nextState);
      this.spineAnim.state.setAnimationByName(syncTime, nextState, doLoop);
    }

    async uncover() {
      var _this = this;
      msgBus.publish('Game.BonusOut', this);
      await new Promise(resolve => {        
        // we need to move this pick point to the front
        // as otherwise the coverAnim will underlap neighbouring pickPoints
        _this.bringToFront();

        var globalScope = _this;

        globalScope.spineAnim.state.addListener({
          complete: function() {            
            resolve();            
          }
        });

        // Disable interactivity to prevent re-reveal, then switch to the animation
        _this.enabled = false;
        _this.revealed = true;
        _this.setSpineState({state:'REVEAL', loop:false});
      });
    }

    static fromContainer(container) {
      const pickPoint = new BonusPickPoint();
      container.addChild(pickPoint);
      return pickPoint;
    }
  }

  return BonusPickPoint;
});
