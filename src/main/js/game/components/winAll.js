define(require => {
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const orientation = require('skbJet/componentManchester/standardIW/orientation');
  const scenarioData = require('skbJet/componentManchester/standardIW/scenarioData');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const PIXI = require('com/pixijs/pixi');
  require('com/gsap/TweenMax');
  require('com/gsap/easing/EasePack');  
  const Tween = window.TweenMax;

  // Promises
  // Complete for when we have finished the bonus game
  let winAllComplete;

  let winAllFound = false;
  let winAllValue = 0;
  let matchInterval;
  let matchCounter = 1;

  let _anim_portrait;
  let _anim_landscape;

  function completeWinAll() {
    if (winAllComplete) {
      winAllComplete();
    }
  }

  function init(){
    displayList.winAllContainer.visible = false;
    displayList.winAllContainer.alpha = 0;

    // Set up spine project
    _anim_portrait = new PIXI.spine.Spine(resLib.spine['bigWin'].spineData);
    _anim_landscape = new PIXI.spine.Spine(resLib.spine['bigWin'].spineData);

    // Add to background containers
    displayList.winAllAnim.addChild(_anim_portrait, _anim_landscape);

    // Call onOrientationChange to show the relevant one for this orientation
    onOrientationChange();

    // Set state - use level 2 as there will always be an effect
    setState({loop:true, level:2});
  }

  function setState(data){
    let doLoop = data.loop || false;
    let syncTime = data.sync || 0;
    // Set animation state
    _anim_landscape.state.setAnimationByName(syncTime, 'Land_bigWin_level'+data.level, doLoop);
    _anim_portrait.state.setAnimationByName(syncTime, 'Port_bigWin_level'+data.level, doLoop);     
  }

  function show(inVal){
    // Now show
    displayList.winAllContainer.visible = true;
    // Set the current value to minimum, so it counts up from a value, rather than 0
    displayList.winAllValue.text = SKBeInstant.formatCurrency(1).formattedAmount;
    Tween.fromTo(displayList.winAllContainer, gameConfig.winAllFadeInDuration, {alpha:0}, {alpha:1, onUpdate:function(){
    },onComplete:function(){
      startRollup(inVal);
    }});
  }  

  function startRollup(inVal){
    // Find the duration
    // For values at the threshold and below, use winAllRollupLowerDurationInSeconds
    // For values above, use winAllRollupHigherDurationInSeconds
    var delay = (inVal <= gameConfig.winAllLowerHigherThreshold) ? gameConfig.winAllRollupLowerDurationInSeconds : gameConfig.winAllRollupHigherDurationInSeconds;
    Tween.to({currentWinValue: 1}, delay, {
        currentWinValue: inVal, onStart:function(){
          audio.play('winAllLoop', true);
        },onUpdate: function () {
          displayList.winAllValue.text = SKBeInstant.formatCurrency(this.target.currentWinValue).formattedAmount;
        },
        onComplete: rollUpWinMeterComplete
    });    
  }

  function rollUpWinMeterComplete(){    
    // Stop rollup sound
    audio.stop('winAllLoop');
    // Play win all terminator
    audio.play('winAllEnd');
    // Hide after a short delay
    Tween.delayedCall(2.5, hide);
  }

  function hide(){
    Tween.fromTo(displayList.winAllContainer, gameConfig.winAllFadeInDuration, {alpha:1}, {alpha:0, onComplete:function(){
      displayList.winAllContainer.visible = false;
      displayList.winAllContainer.alpha = 0;
      completeWinAll();
    }});
  }

  async function complete() {
    // We should know by now whether we are able to trigger Win All or not
    if (winAllFound){      
      await new Promise(c => {
        winAllComplete = c;
        setAllToWin();
      });
    }   

    displayList.winAllValue.text = "";
    winAllFound = false;
    winAllValue = 0;
    matchCounter = 1;
  }

  // We need to run through each number and set it to match
  function setAllToWin(){
    Tween.delayedCall(0.1, setOne);
  }

  function setOne(){
    clearInterval(matchInterval);
    // Publish
    msgBus.publish('Game.WinAllMatch', (matchCounter-1));
    if (matchCounter < 15){
      matchCounter++;
      Tween.delayedCall(gameConfig.winAllHighlightInterval, setOne);
    }else{
      matchCounter = 1;
      // Show if we can
      if (checkRollUpMode()){
        Tween.delayedCall(gameConfig.delayBeforeWinAllPlaqueDisplay, show, [winAllValue]);
      }else{
        completeWinAll();
      }      
    }    
  }

  function checkRollUpMode(){
    let canRollUp = false;
    // Win All roll up mode - 0 = off, 1 = only if bonus triggered, 2 = only if bonus not triggered, 3 = at all times
    if (gameConfig.winAllRollUpMode === 0){
      canRollUp = false;
    }else if (gameConfig.winAllRollUpMode === 1){
      if (scenarioData.scenario.bonusString !== '0'){
        canRollUp = true;
      }
    }else if (gameConfig.winAllRollUpMode === 2){
      if (scenarioData.scenario.bonusString === '0'){
        canRollUp = true;
      }
    }else if (gameConfig.winAllRollUpMode === 3){
      canRollUp = true;
    }

    return canRollUp;
  }
  
  function winAllActivated(inObj){
    winAllFound = inObj.winAllFound;
    winAllValue = inObj.winAllValue;
  }

  /*
   *
   */
  function onOrientationChange(){
    _anim_landscape.renderable = orientation.get() === 'landscape';
    _anim_portrait.renderable = orientation.get() === 'portrait';
  }

  msgBus.subscribe('Game.WinAllActivated', winAllActivated);

  return {
    init,
    complete,
    hide,
    show
  };
});
