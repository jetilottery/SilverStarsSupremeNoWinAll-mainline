define(require => {
  const app = require('skbJet/componentManchester/standardIW/app');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const dimensions = require('game/template/dimensions');
  const orientation = require('skbJet/componentManchester/standardIW/orientation');
  const PIXI = require('com/pixijs/pixi');
  require('com/gsap/TweenMax');
  require('com/gsap/plugins/PixiPlugin');
  const Tween = window.TweenMax;

  let _transitionContainer;
  let _baseGame;
  let _bonusGame;
  let _transitionLand;
  let _transitionPort;
  let _toBonus = false;

  /*
   *
   */
  function init(){
    // Instantiate transition container
    _transitionContainer = new PIXI.Container();
    // Add the transition container at the point directly below the footer
    for (let i = 0; i < app.stage.children.length; i++){
      if (app.stage.children[i].name === 'footerContainer'){
        app.stage.addChildAt(_transitionContainer, i-1);
        break;
      }
    }    

    // Containers
    _baseGame = displayList.baseGameContainer;
    _bonusGame = displayList.bonusGameContainer;    

    // Set up spine project
    _transitionLand = new PIXI.spine.Spine( resLib.spine['transitions'].spineData);
    _transitionPort = new PIXI.spine.Spine( resLib.spine['transitions'].spineData);

    // Add to container
    _transitionContainer.addChild(_transitionLand, _transitionPort);

    // Call onOrientationChange to show the relevant one for this orientation
    onOrientationChange();

    // Position
    _transitionLand.x = dimensions.landscape.width>>1;
    _transitionLand.y = dimensions.landscape.height>>1;
    _transitionPort.x = dimensions.portrait.width>>1;
    _transitionPort.y = dimensions.portrait.height>>1;

    // Add event listeners
    _transitionLand.state.onEvent = function(trackIndex, event){ 
      if (event.data.name === 'swapScreen'){
        swapScreen({orientation:'landscape'});
      }
    };

    _transitionPort.state.onEvent = function(trackIndex, event){ 
      if (event.data.name === 'swapScreen'){
        swapScreen({orientation:'portrait'});
      }
    };

    // Listen for orientation change
    msgBus.subscribe('GameSize.OrientationChange', onOrientationChange);    
  }

  /*
   * Transition to bonus after a delay
   */
  function transitionToBonus(delay){    
    Tween.delayedCall(delay, doTransition, [true]);
  }

  /*
   * Transition back to base game after a delay
   */
  function transitionToBaseGame(delay){
    Tween.delayedCall(delay, doTransition, [false]);
  }

  /*
   * Trigger spine animations
   */
  function doTransition(toBonus){
    _toBonus = toBonus;
    _transitionLand.state.setAnimationByName(0, 'land_transition', false);
    _transitionPort.state.setAnimationByName(0, 'port_transition', false);    
  }

  /**
   * Swap screens
   */
  function swapScreen(data){
    // Make sure the event dispatched from the second spine anim is not acted on
    if (data.orientation !== orientation.get()){
      return;
    }

    const toBonus = _toBonus;

    //if we're transitioning INTO the bonus, toBonus = true
    //we will need to fade out the base game and fade in the bonus game
    //if we're transitioning OUT OF the bonus, we will need to do the opposite  
    let nextState = (toBonus) ? 'BONUS_GAME' : 'BASE_GAME';
    msgBus.publish('Game.StateChanged', nextState);

    // Show the bonus game container
    _bonusGame.visible = toBonus;
    _baseGame.visible = !toBonus;

    // Find the duration
    let duration = toBonus ? gameConfig.transitionToBonusDuration : gameConfig.transitionToBaseGameDuration;

    //show the bonus game container
    _bonusGame.visible = true;
    //fade one in and the other out
    Tween.fromTo(_baseGame, duration, {alpha:toBonus?1:0}, {alpha:toBonus?0:1});
    Tween.fromTo(_bonusGame, duration, {alpha:toBonus?0:1}, {alpha:toBonus?1:0, onComplete:function(){
      if (nextState === 'BASE_GAME'){
        msgBus.publish('Game.BaseGameTransitionComplete');
      }else if (nextState === 'BONUS_GAME'){
        msgBus.publish('Game.BonusTransitionComplete');
      }
    }});
  }

  /*
   *
   */
  function onOrientationChange(){
    _transitionLand.renderable = orientation.get() === 'landscape';
    _transitionPort.renderable = orientation.get() === 'portrait';
  }

  msgBus.subscribe('Game.TransitionToBonus', transitionToBonus);
  msgBus.subscribe('Game.TransitionToBaseGame', transitionToBaseGame);

  return {
    init,
    transitionToBonus,
    transitionToBaseGame
  };
});
