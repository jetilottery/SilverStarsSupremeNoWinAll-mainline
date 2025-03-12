define(require => {
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const PIXI = require('com/pixijs/pixi');
  const Pressable = require('skbJet/componentManchester/standardIW/components/pressable');
  const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const utils = require('game/components/utils/utils');
  require('com/gsap/TweenLite');
  require('com/gsap/easing/EasePack');

  const Tween = window.TweenLite;

  const winFrameName = 'numberWin';
  const noWinFrameName = 'numberNoWin';

  class NumberCard extends Pressable {
    constructor() {
      super();

      this.WIDTH = 140;
      this.HEIGHT = 140;

      // Create all the empty sprites
      this.background = new PIXI.Sprite();
      this.win = new PIXI.Sprite();
      this.noWin = new PIXI.Sprite();
      this.revealAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
      this.revealAnim.loop = false;
      this.revealAnim.visible = false;
      this.idleAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
      this.idleAnim.loop = false;
      this.idleAnim.animationSpeed = 0.5;
      this.idleAnim.visible = false;

      this.spineAnim = undefined;
      this.winningAnim = undefined;
      this.pickPointType = '';
      this.useWinningFrameAtAllTimes = false;
      this.interactionState = '';
      this.winType = '';

      this.idleAnim.onComplete = () => {
        this.idleAnim.visible = false;
        this.revealAnim.visible = true;
      };

      // Center everything
      this.background.anchor.set(0.5);
      this.win.anchor.set(0.5);
      this.noWin.anchor.set(0.5);
      this.revealAnim.anchor.set(0.5);
      this.idleAnim.anchor.set(0.5);

      // Add all the result elements to a container
      this.resultContainer = new PIXI.Container();
      this.resultContainer.addChild(this.win, this.noWin);
      this.resultContainer.visible = false;
      this.resultContainer.name = 'resultContainer';

      this.addChild(this.background, this.resultContainer);

      // State
      this.revealed = false;
      // Interaction state
      this.interactionState = '';

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

    initSpine(inVal) {
      const _this = this;
      // Set the spine state
      _this.pickPointType = (inVal === 'player') ? 'Your' : 'Lucky';
      // Set up spine project
      _this.spineAnim = new PIXI.spine.Spine( resLib.spine['coverAnims'].spineData);
      _this.defaultState = _this.pickPointType+'Number_STATIC';
      _this.setSpineState({state:'DEFAULT', loop:false});
      _this.winningAnim = new PIXI.spine.Spine( resLib.spine['highlightFX'].spineData);
      _this.winningAnim.renderable = false;
      _this.addChildAt(_this.winningAnim, _this.getChildIndex(_this.background) + 1);
      _this.addChild(_this.spineAnim);
      
      // Add a listener to the winningAnim so we know when the initial match anim has completed
      // Then we can switch to the loop anim
      _this.winningAnim.state.addListener({
        complete: function(entry) {
          if(entry.animation.name === _this.pickPointType.toLowerCase()+'NumberMatch_anim'){
            _this.setWinState({state:'LOOP',loop:true});
          }                        
        }
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

    populate(number) {
      this.number = number;
      //if the number is a number
      if (!isNaN(number)){
        this.noWin.texture = PIXI.Texture.fromFrame((this.useWinningFrameAtAllTimes?winFrameName:noWinFrameName) + number);
        this.win.texture = PIXI.Texture.fromFrame(winFrameName + number);
      }else{
        //it's a letter, Y or Z, Y = x2 prize multiplier, Z = Win All
        switch (number){
          case "Y":
            this.noWin.texture = PIXI.Texture.fromFrame('2XSymbol');
            this.win.texture = PIXI.Texture.fromFrame('2XSymbol');
            break;
          case "Z":
            this.noWin.texture = PIXI.Texture.fromFrame('winAllSymbol');
            this.win.texture = PIXI.Texture.fromFrame('winAllSymbol');
            break;
        }
      }      
      this.noWin.visible = true;
    }

    prompt() {
      this.bringToFront();
      this.background.visible = false;
      this.setSpineState({state:'IDLE', loop:true});
    }

    stopIdle() {
      this.setSpineState({state:'DEFAULT', loop:false});
    }

    disable() {
      this.enabled = false;
      this.reveal = undefined;
    }

    rollover() {      
      msgBus.publish('Game.StopIdle');
      const evt = (this.pickPointType === 'Your') ? 'Game.Player' : 'Game.Winning';
      msgBus.publish(evt+'Over', this);
      this.setSpineState({state:'ROLLOVER', loop:false});
    }

    setSpineState(data) {      
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
        case 'REVEAL':
          nextState = this.pickPointType+'Number_REVEAL';
          break;
        case 'ROLLOUT':
          nextState = this.pickPointType+'Number_MOUSEOUT';
          break;
        case 'OFF':
          nextState = this.defaultState;      
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
      this.spineAnim.renderable = data.state !== 'OFF';
      this.spineAnim.state.setAnimationByName(syncTime, nextState, doLoop);        
    }

    setWinState(data) {
      let nextState;
      let doLoop = data.loop || false;
      let syncTime = data.sync || 0;

      // Stop anim if there is no state
      if (!data.state){
        utils.stopSpineAnim(this.winningAnim);
        return;
      }

      // Set win
      switch (data.state){
        case 'WIN_ALL':
          nextState = 'winAll_anim';
          // Symbol is shown in spine anim, so we no longer need the statics
          this.noWin.texture = PIXI.Texture.EMPTY;
          this.win.texture = PIXI.Texture.EMPTY;
          break;
        case 'MULTIPLIER':
          nextState = 'win2x_anim';          
          break;
        case 'LOOP':
          // Loop automatically called when ...NumberMatch_anim is complete
          nextState = this.pickPointType.toLowerCase()+'NumberMatch_loop';           
          break;
        default:    
          nextState = this.pickPointType.toLowerCase()+'NumberMatch_anim';
          // We do not want the initial anim to loop, so override whatever doLoop currently is
          doLoop = false;
          break;
      }

      this.winningAnim.renderable = true;
      this.winningAnim.state.setAnimationByName(syncTime, nextState, doLoop);
    }

    stopRollover() {
      const _this = this;
      const evt = (_this.pickPointType === 'Your') ? 'Game.Player' : 'Game.Winning'; 
      msgBus.publish(evt+'Out', _this);
      if (_this.interactionState !== 'ROLLOVER'){        
        return;
      }else{
        _this.setSpineState({state:'ROLLOUT', loop:false});
        // Add a listener, removing all first
        utils.removeSpineListeners(_this.spineAnim);
        _this.spineAnim.state.addListener({
          complete: function(entry) {
            if(entry.animation.name === _this.pickPointType+'Number_MOUSEOUT'){
              msgBus.publish('Game.ResetIdle');
            }                        
          }
        });
      }         
    }

    reset() {
      this.spineAnim.renderable = true;
      this.noWin.texture = PIXI.Texture.EMPTY;
      this.win.texture = PIXI.Texture.EMPTY;
      this.enabled = false;
      this.revealAnim.gotoAndStop(0);
      this.revealAnim.visible = true;
      this.noWin.visible = false;
      this.win.visible = false;
      this.resultContainer.visible = false;
      this.background.visible = false;
      this.revealed = false;
      this.matched = false;
      this.number = undefined;
      this.scale.x = this.scale.y = 1;
      this.winType = '';
      if (this.valueText){this.valueText.visible = true;}
      this.setWinState({});
      utils.removeSpineListeners(this.spineAnim);
      utils.stopSpineAnim(this.spineAnim);
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

    async uncover() {
      const _this = this;
      const evt = (this.pickPointType === 'Your') ? 'Game.Player' : 'Game.Winning';
      msgBus.publish(evt+'Out', this);
      await new Promise(resolve => {        
        // we need to move this pick point to the front
        // as otherwise the coverAnim will underlap neighbouring pickPoints
        _this.bringToFront();
        // we also need to bring this overall number set to the front
        // so that all spine anims are at the very front of the screen
        _this.parent.parent.parent.setChildIndex(
          _this.parent.parent,
          _this.parent.parent.parent.children.length - 1
        );

        // need to define a global scope since the spine listeners don't maintain scope
        var globalScope = _this;

        globalScope.background.visible = true;
        globalScope.resultContainer.visible = true;
        globalScope.resultContainer.alpha = 1;
        utils.removeSpineListeners(globalScope.spineAnim);
        globalScope.spineAnim.state.addListener({
          complete: function(entry) {
            if(entry.animation.name === globalScope.pickPointType+'Number_REVEAL'){              
              globalScope.setSpineState({state:'OFF', loop:false});
              resolve();
            }                        
          }
        });

        // Disable interactivity to prevent re-reveal, then switch to the animation
        _this.resultContainer.visible = true;
        _this.enabled = false;
        _this.revealed = true;
        _this.setSpineState({state:'REVEAL', loop:false});
      });
    }

    match(winType) {
      this.matched = true;
      this.winType = winType || 'WIN';
      this.win.visible = true;
      this.noWin.visible = false;
    }

    presentWin() {
      let _this = this;
      _this.bringToFront();
      return new Promise(resolve => Tween.fromTo(
        this.resultContainer.scale,
        0.75,
        {
          x: 0.666,
          y: 0.666,
        },
        {
          x: 1,
          y: 1,
          ease: window.Elastic.easeOut.config(
            gameConfig.matchAnimAmplitude,
            gameConfig.matchAnimPeriod
          ),
          onComplete: function(){
            _this.setWinState({state:_this.winType,loop:true});
            resolve();
          },
        }
      ));
    }
  }

  return NumberCard;
});