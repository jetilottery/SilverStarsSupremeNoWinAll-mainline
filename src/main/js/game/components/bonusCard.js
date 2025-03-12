define(require => {
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const BonusSymbol = require('game/components/bonus/BonusSymbol');
  const numberState = require('game/state/numbers');
  const bonusGame = require('game/components/bonusGame');
  const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const PIXI = require('com/pixijs/pixi');

  require('com/gsap/TweenMax');
  const Tween = window.TweenMax;

  let complete;
  let symbols = [];
  let numSymbolsFound = 0;
  let symbolsFound = [];

  let spineAnim_bonus;
  let spineAnim_update;
  let _updateAnimating = false;

  function init() {
    //let's add the symbols
    symbols = [
      BonusSymbol.fromContainer(displayList.bonusSymbol1),
      BonusSymbol.fromContainer(displayList.bonusSymbol2),
      BonusSymbol.fromContainer(displayList.bonusSymbol3),
      BonusSymbol.fromContainer(displayList.bonusSymbol4),
      BonusSymbol.fromContainer(displayList.bonusSymbol5)
    ];

    // Set up spine project
    spineAnim_bonus = new PIXI.spine.Spine( resLib.spine['bonusMeterFX'].spineData);
    // We need a second one so we're able to play two at once
    spineAnim_update = new PIXI.spine.Spine( resLib.spine['bonusMeterFX'].spineData);
    // Add the spine project to the container
    displayList.bonusBack.addChild(spineAnim_bonus, spineAnim_update);
    // Add listeners to the update spine so we know when it is playing
    spineAnim_update.state.addListener({start: function() {_updateAnimating = true;}});
    spineAnim_update.state.addListener({complete: function() {_updateAnimating = false;}});
    // Add a listener to the bonus spine, so the win animation loops
    spineAnim_bonus.state.addListener({
      complete: function(entry) {
        if(entry.animation.name === 'bonusMeterWin'){              
          setSpineAnim({state:'loop', loop:true});
        }                        
      }
    });
    // Hide by default
    spineAnim_bonus.renderable = false;
  }

  function reset() {
    for (let i = 0; i < 5; i++){
      symbols[i].reset();
    }
    numSymbolsFound = 0;
    symbolsFound = [];

    spineAnim_bonus.renderable = false;
    _updateAnimating = false;
  }

  function bonusSymbolFound(data){
    //right, if we have one, easy
    //just show it, then increment numSymbolsFound
    if (data.numBonus === 1){
      bonusCollectManager(data);
    }else{
      //it can only be 2
      bonusCollectManager(data);
      Tween.delayedCall(0.25, bonusCollectManager, [data, true]);
    }    
  }

  function bonusCollectManager(data, isDouble){
    symbolsFound.push(data.symbol);
    // Right, we need to work out whether we need to fly a symbol across the screen or not
    // If not, easy, just call showBonusSymbol
    if (!gameConfig.gravitateBonusItem || autoPlay.enabled || data.auto){
      showBonusSymbol();
    }else{
      data.numFound = symbolsFound.length;
      data.isDouble = isDouble;
      msgBus.publish('Game.GravitateBonusSymbol', data);
    }
  }

  function showBonusSymbol(){
    // Play land animation if we're in manual play, otherwise just set match
    symbols[numSymbolsFound].bonusLand(autoPlay.enabled);
    // Play a sound
    audio.play('Reveal');
    // Increment
    numSymbolsFound++;
    // Bring the one we need to pulse to the front
    displayList.bonusCard.setChildIndex(displayList['bonusSymbol'+numSymbolsFound], displayList.bonusCard.children.length-1);    
    // And play a sound if we've found them all
    if (numSymbolsFound === 5){
      audio.play('BonusGameActivated');
      // Now we need to pulse the bonus text
      Tween.to(displayList.bonusLabel.scale, gameConfig.bonusLabelPulseDuration, {x:1.5,y:1.5,yoyo:true,repeat:-1});
      // Set spine animation
      setSpineAnim({state:'win', loop: false});
    }

    // Update the total
    bonusGame.update(numSymbolsFound);
    // Update spine
    spineUpdate();

    // If the number of hammers shown tallies with the number in the state
    // We are showing the correct number of symbols
    if (numberState.bonus === numSymbolsFound){
      completeCard();
    }
  }

  function completeCard(){
    if (complete) {
      complete();
    }
  }

  function setSpineAnim(data){
    let nextState;
    let doLoop = data.loop || false;
    let syncTime = data.sync || 0;    
    switch (data.state){
      case 'loop':
        nextState = 'bonusMeterWinLoop';
        break;
      case 'win':
        nextState = 'bonusMeterWin';
        break;
      default:
        spineAnim_bonus.renderable = false;
        break;
    }

    // If we definitely have a next animation state...
    if (nextState){
      spineAnim_bonus.renderable = true;
      spineAnim_bonus.state.setAnimationByName(syncTime, nextState, doLoop);
    }    
  }

  function spineUpdate(){
    spineAnim_update.renderable = true;
    if (!_updateAnimating){
      spineAnim_update.state.setAnimationByName(0, 'bonusMeterUpdate', false);
    }    
  }

  //for when the bonus card has been fully populated
  async function populated() {
    if (numberState.bonus !== numSymbolsFound){
      await new Promise(c => {
        complete = c;
      });
    }    
  }

  msgBus.subscribe('Game.BonusSymFound', bonusSymbolFound);
  msgBus.subscribe('Game.GravitateComplete', showBonusSymbol);
  msgBus.subscribe('Game.BonusTransitionComplete', () => setSpineAnim({state:'off'}));

  return {
    init,
    reset,
    populated
  };
});