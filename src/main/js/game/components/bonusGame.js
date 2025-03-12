define(require => {
  const Timeline = require('com/gsap/TimelineLite');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const BonusPickPoint = require('game/components/bonus/BonusPickPoint');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const BonusLifeIndicator = require('game/components/bonus/BonusLifeIndicator');
  const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
  const prizeData = require('skbJet/componentManchester/standardIW/prizeData');
  const meterData = require('skbJet/componentManchester/standardIW/meterData');
  const bonusData = require('game/components/data/bonusData');
  const numberState = require('game/state/numbers');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const idleState = require('game/state/idle');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const PIXI = require('com/pixijs/pixi');
  const utils = require('game/components/utils/utils');
  const particleConfig = require('game/components/effects/particleConfig');
  require('com/gsap/TweenMax');
  require('com/gsap/plugins/PixiPlugin');
  const Tween = window.TweenMax;

  let pickPoints = [];
  let lives;
  let numSymbolsFound = 0;
  let gameComplete;
  let prizeTable = [];
  let unformattedPrizeTable = [];
  let prizeArr = [];
  let totalBonusPrize = 0;
  let prizeRevealedArr = [];
  let numNonWinnersFound = 0;
  let bonusScenario = [];
  let bonusTicketInfo;
  let bonusRevealedArr = [];
  let numPickPoints = 12;
  let numClickedArr = [];
  let pickPointsClickedArr = [];
  let bonusAutoPlay = false;
  let flyingContainers = [];
  let flyingEmitters = [];
  let currentPrizeTableLevel = 0;

  const MAX_SCALE = 4;
  const FADE_DURATION = 0.5;

  let bonusClimb;

  let totalBaseWin = 0;

  //find the top prize
  msgBus.subscribe('PrizeData.PrizeTable', function(){
    prizeTable = ['-','-'];
    unformattedPrizeTable = [0,0];
    // DDDLX-87 - IQA- Bonus Screen prize values are not alligned.
    // Always return 2 decimal places, otherwise the alignment between decimal and non-decimal values looks messy
    prizeTable.push(SKBeInstant.formatCurrency({amount: prizeData.prizeTable.IW4, numberOfDecimalsToReturn: 2}).formattedAmount);
    prizeTable.push(SKBeInstant.formatCurrency({amount: prizeData.prizeTable.IW3, numberOfDecimalsToReturn: 2}).formattedAmount);
    prizeTable.push(SKBeInstant.formatCurrency({amount: prizeData.prizeTable.IW2, numberOfDecimalsToReturn: 2}).formattedAmount);
    prizeTable.push(SKBeInstant.formatCurrency({amount: prizeData.prizeTable.IW1, numberOfDecimalsToReturn: 2}).formattedAmount);
    unformattedPrizeTable.push(prizeData.prizeTable.IW4);
    unformattedPrizeTable.push(prizeData.prizeTable.IW3);
    unformattedPrizeTable.push(prizeData.prizeTable.IW2);
    unformattedPrizeTable.push(prizeData.prizeTable.IW1);
    populatePrizeTable();
  });

  /**
   *
   */
  function init() {
    displayList.bonusGameContainer.visible = false;
    //create and add the pickpoints to the container
    for (let i = 0; i < numPickPoints; i++){
      pickPoints.push(BonusPickPoint.fromContainer(displayList['bonusPickPoint'+(i+1)]));
      pickPoints[i].num = (i+1);
      // Set up some particle emitters
      flyingContainers[i] = new PIXI.particles.ParticleContainer(particleConfig.winningBonus.maxParticles, {vertices: true,position: true,tint: true,});
      flyingEmitters[i] = new PIXI.particles.Emitter(flyingContainers[i], PIXI.Texture.fromFrame('bonusPrizeFly'), particleConfig.winningBonus);
      flyingEmitters[i].autoUpdate = true;
      flyingEmitters[i].emit = false;
      //add containers
      displayList.bonusParticles.addChildAt(flyingContainers[i], 0);
    }

    //now we need to create the indicators
    lives = [
      BonusLifeIndicator.fromContainer(displayList.bonusLife1),
      BonusLifeIndicator.fromContainer(displayList.bonusLife2),
      BonusLifeIndicator.fromContainer(displayList.bonusLife3)
    ];

    //generate the prize table
    populatePrizeTable();
    // Set up spine project
    initSpine();
  }

  /**
   * Set up prize table animation
   */
  function initSpine(){
    bonusClimb = new PIXI.spine.Spine( resLib.spine['highlightFX'].spineData);
    displayList.prizeTableAnim.addChild(bonusClimb);    
    bonusClimb.renderable = false;
  }

  /**
   *
   * @param {*} count 
   */
  function setPrizeTableAnim(count){
    if (count > 2){
      bonusClimb.renderable = true;
      bonusClimb.state.setAnimationByName(0, 'bonusClimbAnim', true);
    }
    displayList.prizeTableAnim.x = displayList['prizeLevel'+count].x;
    displayList.prizeTableAnim.y = displayList['prizeLevel'+count].y;
  }  

  async function complete() {
    // Work out how many symbols we have collected
    // If zero, no problem, the promise is fulfilled
    if (numSymbolsFound === 5){
      // Disable help and autoplay for transition
      msgBus.publish('UI.updateButtons', {
        autoPlay: false,
        help: { enabled: false },
      });
      // Transition into the bonus
      msgBus.publish('Game.TransitionToBonus', gameConfig.delayBeforeTransitionToBonus);
      // Set up a promise
      await new Promise(c => {
        gameComplete = c;
      });      
    }
    
    //reset everything
    resetAll();
  }

  /**
   * onGameStart listening for a startUserInteraction/restartUserInteraction call
   * this is just so we can listen for the scenario data independently of the framework
   * so we can grab the first and last prizes, if we need to create a seed from them
   * @param {*} data 
   */
  function onGameStart(data){
    let scenarioNumArr = data.scenario.split('|')[1].split(',');
    prizeArr = [];
    for (let i = 0; i < scenarioNumArr.length; i++){
      prizeArr.push(scenarioNumArr[i].split(':')[1].split('')[0]);
    }
  }

  /**
   * Populate the prize table with data from the ticket
   */
  function populatePrizeTable(){
    for (let i = 6; i > 0; i--){
      if (displayList['bonusPrize'+i+'WinIn'] 
      && displayList['bonusPrize'+i+'WinOut'] 
      && displayList['bonusPrize'+i+'NoWinIn'] 
      && displayList['bonusPrize'+i+'NoWinOut']){
        displayList['bonusPrize'+i+'WinIn'].text = prizeTable[i-1];
        displayList['bonusPrize'+i+'WinOut'].text = prizeTable[i-1];
        displayList['bonusPrize'+i+'NoWinIn'].text = prizeTable[i-1];
        displayList['bonusPrize'+i+'NoWinOut'].text = prizeTable[i-1];
      }      
    }
  }

  /**
   * Fulfil promise
   */
  function completeBonus() {
    if (gameComplete) {
      gameComplete();
    }
  }  

  /**
   * Bonus game ready
   * Transition into bonus game has complete
   */
  function bonusGameReady(){
    //enable the bonus game here
    enableBonusGame();
    //we now have the bonus scenario
    //now let's enable the pickPoints
    enablePickPoints();
    //if we're going into the bonus we need to be able to Reveal All again
    //so re-enable the auto play start button and help button
    autoPlay._enabled = false;
    msgBus.publish('UI.updateButtons', {
      autoPlay: true,
      help: { enabled: true },
    });
    // Make sure the auto play button is now enabled
    displayList.autoPlayStartButton.enabled = true;
    displayList.helpButton.enabled = true;
    // Stop pulsing the bonus label
    Tween.killTweensOf(displayList.bonusLabel.scale);
    displayList.bonusLabel.scale.x = displayList.bonusLabel.scale.y = 1;
    // Store the current base game win
    totalBaseWin = meterData.win;
  }

  /**
   * Base game ready
   * Transition back to base game complete
   */
  function baseGameReady(){           
    completeBonus();
  }

  /**
   * Reset everything
   */
  function resetAll(){
    //reset the pickPoints
    for (let j = 0; j < pickPoints.length; j++){
      pickPoints[j].reset();
    }

    for (let i = 0; i < 6; i++){
      displayList['bonusPrize'+(i+1)+'Win'].visible = false;
      displayList['bonusPrize'+(i+1)+'NoWin'].visible = true;
    }

    //reset the indicators
    lives[0].setState(false);
    lives[1].setState(false);
    lives[2].setState(false);

    //reset variables
    gameComplete = undefined;
    numSymbolsFound = 0;
    numSymbolsFound = 0;
    prizeArr = [];
    totalBonusPrize = 0;
    prizeRevealedArr = [];
    numNonWinnersFound = 0;
    bonusScenario = [];
    bonusTicketInfo = {};
    bonusRevealedArr = [];
    pickPointsClickedArr = [];
    numClickedArr = [];
    bonusAutoPlay = false;
    currentPrizeTableLevel = 0;
    totalBaseWin = 0;

    //stop spine
    utils.stopSpineAnim(bonusClimb);
  }

  /**
   * Enable bonus game
   */
  function enableBonusGame(){    
    let winNums = numberState.winning.slice();    
    //find the total of all current winning numbers
    let winningTotal = 0;
    for (let i = 0; i < winNums.length; i++){
      winningTotal += winNums[i];
    }
    let data = {total:winningTotal,ticketInfo:bonusTicketInfo};
    //generate a scenario, see bonusData.getScenario() for info
    bonusScenario = bonusData.getScenario(data);            
  }

  /**
   * Enable all pickpoints in the same manner as Winning/Player numbers are enabled
   */
  function enablePickPoints(){    
    // Return an array of promises for each card's lifecycle
    return pickPoints.map(async pickPoint => {
      // Start all idle animations
      msgBus.publish('Bonus.IdleAll');
      // Enable the card and wait for it to be revealed (manually or automatically)
      await pickPoint.enable();
      // Reset Idle
      msgBus.publish('Bonus.ResetIdle');
      // Play the Player Number reveal audio
      audio.play('Reveal');
      // Get the next turn
      const thisTurn = bonusScenario[pickPointsClickedArr.length];      
      pickPoint.setBonusVal(thisTurn);
      pickPoint.populate(thisTurn);
      // Increment
      numClickedArr.push(pickPoint.num);
      pickPointsClickedArr.push(pickPoint);
      // Play win particles if we can
      presentWin(pickPoint);
      //see if we have clicked all pickPoints
      if (pickPointsClickedArr.length === bonusScenario.length){
        // Disable all pickpoints
        disableAllPickPoints();
        // Ensure help and autoplay are disabled
        // Hide autoplay button, disable help button
        msgBus.publish('UI.updateButtons', {
          autoPlay: false,
          help: { enabled: false },
        });
      }
      // Wait for the uncover animation (if animated)
      await pickPoint.uncover();      
      bonusPickPointRevealed(pickPoint.num);      
    });
  }

  /**
   *
   * @param {*} lastPickPoint
   */
  function presentWin(lastPickPoint){
    // Ignore if we have just revealed a non winner
    if (lastPickPoint.bonusVal !== "1"){
      return;
    }

    // What we need to do here, is see how many winners we have revealed
    let count = 0;
    for (let i = 0; i < pickPointsClickedArr.length; i++){
      if (pickPointsClickedArr[i].bonusVal === "1"){
        // It's a winner
        count++;
      }
    }
    winPresentation(count, lastPickPoint); 
  }

  /**
   *
   * @param {*} inVal
   */
  function bonusPickPointRevealed(inVal){    
    //well firstly, was the pickPoint we have just revealed a loser?
    let lastPickPoint = pickPoints[inVal-1];
    prizeRevealedArr.push(lastPickPoint);
    if (lastPickPoint.bonusVal === "0"){
      //non winner
      lives[numNonWinnersFound].setState(true);      
      //and the one in the pickPoint itself
      numNonWinnersFound++;
      //play sound
      audio.play('BonusMiss');
    }

    // Grey out the unrevealed pickPoints
    if (prizeRevealedArr.length === bonusScenario.length){      
      greyOutUnrevealed();
    }

    //and finally, check to see if the bonus is complete
    Tween.delayedCall(2, checkComplete, [inVal]);
  }

  /**
   * 
   * @param {*} count 
   * @param {*} lastPickPoint 
   */
  function winPresentation(count, lastPickPoint){
    let canPlayParticles = false;
    // We need to look at gameConfig.bonusWinningSymbolParticleMode
    // Tween particles from bonus symbol to prize table mode - 0 = never, 1 = only in manual play, 2 = only in auto play, 3 = at all times
    if (gameConfig.bonusWinningSymbolParticleMode === 0){
      canPlayParticles = false;
    }else if (gameConfig.bonusWinningSymbolParticleMode === 1){
      if (!autoPlay.enabled){
        canPlayParticles = true;
      }
    }else if (gameConfig.bonusWinningSymbolParticleMode === 2){
      if (autoPlay.enabled){
        canPlayParticles = true;
      }
    }else if (gameConfig.bonusWinningSymbolParticleMode === 3){
      canPlayParticles = true;
    }

    // If we can play the win particles, play them, otherwise just update the prize table
    if (canPlayParticles){
      winParticles(count, lastPickPoint);
    }else{
      // Just update the prize table
      updatePrizeTable(count);
    }
  }

  /**
   * 
   * @param {*} count 
   * @param {*} pickPoint 
   */
  function winParticles(count, pickPoint){
    const emitter = flyingEmitters[pickPoint.num-1];

    let startPoint = new PIXI.Point(0,0);
    startPoint = displayList['bonusPickPoint'+pickPoint.num].toGlobal(startPoint);
    let startX = startPoint.x + (pickPoint.WIDTH>>1);
    let startY = startPoint.y + (pickPoint.HEIGHT>>1);

    let endPoint = new PIXI.Point(0,0);
    endPoint = displayList['prizeLevel'+count].toGlobal(endPoint);
    let endX = endPoint.x;
    let endY = endPoint.y;
    
    //we need to gravitate the relevant particle container to the prize table level
    Tween.fromTo(emitter.spawnPos, gameConfig.bonusGameParticleFlyDuration, {x:startX, y:startY}, {ease: window.Power1.easeIn, x:endX, y:endY, onStart:function(){
      emitter.emit = true;
    },onComplete:function(){
      emitter.emit = false;
      // Update the prize table and selection animation
      updatePrizeTable(count);
    }});
  }

  /**
   *
   * @param {*} inVal 
   */
  function checkComplete(inVal){
    bonusRevealedArr.push(inVal);
    if (bonusRevealedArr.length === bonusScenario.length){
      let transitionDelay = (totalBonusPrize > 0) ? gameConfig.bonusHoldOnCompleteWin : gameConfig.bonusHoldOnCompleteNonWin;
      msgBus.publish('Game.TransitionToBaseGame', transitionDelay);
      // Play applicable sound
      let sound = (totalBonusPrize > 0) ? 'BonusWin' : 'bonusNoWin';
      audio.play(sound);     
    }
  }

  /**
   *
   * @param {*} count 
   */
  function updatePrizeTable(count){    
    //if we're trying to update the prize table with a lower amount, for example if we've hit REVEAL ALL
    //while sparks are flying, just return
    if (count < currentPrizeTableLevel){
      return;
    }
    //set current level
    currentPrizeTableLevel = count;    
    //prize table is already populated, so it *should* just be a case of setting everything
    //to unselected again, then setting the one we need to selected
    for (let i = 0; i < 6; i++){
      displayList['bonusPrize'+(i+1)+'Win'].visible = false;
      displayList['bonusPrize'+(i+1)+'NoWin'].visible = true;
    }

    let tempIn, tempOut;

    let sound = 'WinScale_'+count;
    audio.play(sound);

    // Set the relevant level on the prize table
    displayList['bonusPrize'+count+'Win'].visible = true;
    displayList['bonusPrize'+count+'NoWin'].visible = false;
    tempIn = displayList['bonusPrize'+count+'WinIn'];
    tempOut = displayList['bonusPrize'+count+'WinOut'];
    // Find the total bonus prize
    totalBonusPrize = unformattedPrizeTable[count-1];
    //only manipulate the meterData if totalBonusPrize > 0
    if (totalBonusPrize > 0){
      meterData.win = totalBaseWin + totalBonusPrize;
    } 

    // Set up a timeline
    const updateTimeline = new Timeline();

    updateTimeline.fromTo(
      tempIn,
      FADE_DURATION,
      {
        pixi: { scaleX: MAX_SCALE, scaleY: MAX_SCALE },
        alpha: 0,
      },
      {
        pixi: { scaleX: 1, scaleY: 1 },
        alpha: 1,
      },
      0
    );

    updateTimeline.fromTo(
      tempOut,
      FADE_DURATION,
      {
        pixi: { scaleX: 1, scaleY: 1 },
        alpha: 1,
      },
      {
        pixi: { scaleX: MAX_SCALE, scaleY: MAX_SCALE },
        alpha: 0,
      },
      0
    );

    // Set the bonus climb accordingly
    setPrizeTableAnim(count);
  }  

  /**
   * Disable all pick points
   * Stop Idle and call disable function
   */
  function disableAllPickPoints(){
    // Stop All
    msgBus.publish('Bonus.StopIdle');

    for (let j = 0; j < pickPoints.length; j++){
      pickPoints[j].disable();
    }
  }

  /**
   * Grey out all unrevealed pickpoints
   * The bonus pick point has a 'greyscale' function
   */
  function greyOutUnrevealed(){
    const unrevealed = pickPoints.filter(pickPoint => !pickPoint.revealed);
    for (let i = 0; i < unrevealed.length; i++){
      unrevealed[i].greyscale(gameConfig.unrevealedBonusTweenToGreyDuration);
    }
  }

  /**
   * 
   * @param {*} inVal 
   */
  function update(inVal){
    numSymbolsFound = inVal;
  }
  
  /**
   * 
   * @param {*} inString 
   * @param {*} data 
   */
  function populate(inString, data){
    bonusTicketInfo = {
      bonusString:inString,
      bonusOutcome:data
    };
  }

  /**
   * Now then, what we'd need to do here is take the first and last prize amounts from the scenario string
   * Find out the ASCII code values, add them together and do a MOD 10
   * This gives us a value between 0 and 9
   * We can then select a shuffled order
   * Saves having to do it via a randomiser
   */
  function revealAll(){
    // Stop all idle animations
    msgBus.publish('Bonus.StopIdle');
    // Set bonusAutoPlay to true
    bonusAutoPlay = true;
    //so the two values we need are prizeArr[0] and prizeArr[prizeArr.length-1]
    let code1 = prizeArr[0].charCodeAt(0);
    let code2 = prizeArr[prizeArr.length-1].charCodeAt(0);
    let seedVal = (code1 + code2) % 10;
    let autoRevealOrder = bonusData.generateRevealAllOrder(seedVal, numClickedArr);
    //we know exactly how many have been revealed
    //we know exactly how many we need to reveal (it's bonusScenario.length - pickPointsClickedArr.length)
    let toReveal = bonusScenario.length - pickPointsClickedArr.length;
    //so grab the current unrevealed ones
    const unrevealed = pickPoints.filter(pickPoint => !pickPoint.revealed);
    //look at autoRevealOrder and grab the first 'toReveal' elements
    let generated = [];
    for (let i = 0; i < toReveal; i++){
      let tempIndex = autoRevealOrder[i];
      //tempIndex is the NUMBER that we want to reveal
      for (let j = 0; j < unrevealed.length; j++){
        if (unrevealed[j].num === tempIndex){
          generated.push(unrevealed[j]);
        }
      }      
    }
    // Return an array of tweens that calls reveal on each generated pickPoint in turn
    return generated.map(pickPoint => Tween.delayedCall(0, pickPoint.reveal, null, pickPoint));
  }

  /**
   * Work out what we need to do in the various idle states
   * @param {*} inData 
   */
  function idleManager(data){
    switch (data.state){
      case 'IdleAll':
        Tween.killTweensOf(promptIdle);
        //set the idle animations going on all unrevealed
        Tween.delayedCall(gameConfig.delayBeforeStartIdleInSeconds, promptIdle);
        break;
      case 'ResetIdle':
        Tween.killTweensOf(promptIdle);
        //set the idle animations going on all unrevealed after a short delay
        Tween.delayedCall(gameConfig.delayBeforeResumeIdleInSeconds, promptIdle);
        break;
      case 'StopIdle':      
        //stop the idle animations on all
        stopIdle();
        break;
    }
  }

  /**
   * Start idle animations
   */
  function promptIdle() {
    Tween.killTweensOf(promptIdle);
    // Check if there are any remaining unrevealed cards
    const unrevealed = pickPoints.filter(pickPoint => !pickPoint.revealed);
    if (unrevealed.length === 0 || idleState.bonus.length !== 0 
      || idleState.bonusOver.length !== 0 
      || bonusScenario.length === pickPointsClickedArr.length 
      || bonusAutoPlay) {
      return;
    }

    for (let i = 0; i < unrevealed.length; i++){
      unrevealed[i].prompt();
    }
  }

  /**
   * Stop all idle animations
   */
  function stopIdle() {
    Tween.killTweensOf(promptIdle);
    // Check if there are any remaining unrevealed cards
    const unrevealed = pickPoints.filter(pickPoint => !pickPoint.revealed);
    if (unrevealed.length === 0) {
      return;
    }

    for (let i = 0; i < unrevealed.length; i++){
      unrevealed[i].stopIdle();
    }
  }

  msgBus.subscribe('Game.BonusPickPointRevealed', bonusPickPointRevealed);
  msgBus.subscribe('jLottery.reStartUserInteraction', onGameStart);
  msgBus.subscribe('jLottery.startUserInteraction', onGameStart);
  msgBus.subscribe('Game.BonusTransitionComplete', bonusGameReady);
  msgBus.subscribe('Game.BaseGameTransitionComplete', baseGameReady);  

  msgBus.subscribe('Bonus.IdleAll', () => idleManager({state:'IdleAll'}));
  msgBus.subscribe('Bonus.StopIdle', () => idleManager({state:'StopIdle'}));
  msgBus.subscribe('Bonus.ResetIdle', () => idleManager({state:'ResetIdle'}));
  msgBus.subscribe('Game.AutoPlayStop', () => {
    bonusAutoPlay = false;
    idleManager({state:'ResetIdle'});
  });

  return {
    init:init,
    reset:resetAll,
    complete:complete,
    update:update,
    populate:populate,
    revealAll:revealAll
  };
});
