define(require => {
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const meterData = require('skbJet/componentManchester/standardIW/meterData');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const PlayerNumber = require('game/components/PlayerNumber');
  const numberState = require('game/state/numbers');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const idleState = require('game/state/idle');  
  const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');

  require('com/gsap/TweenMax');
  const Tween = window.TweenMax;

  let cards;
  let numbers;
  let totalAmount = 0;
  let totalBonus = 0;
  let cardRows;
  let autoWinsProcessed;
  let pendingWins = [];

  function init() {
    cards = [
      PlayerNumber.fromContainer(displayList.playerNumber1),
      PlayerNumber.fromContainer(displayList.playerNumber2),
      PlayerNumber.fromContainer(displayList.playerNumber3),
      PlayerNumber.fromContainer(displayList.playerNumber4),
      PlayerNumber.fromContainer(displayList.playerNumber5),
      PlayerNumber.fromContainer(displayList.playerNumber6),
      PlayerNumber.fromContainer(displayList.playerNumber7),
      PlayerNumber.fromContainer(displayList.playerNumber8),
      PlayerNumber.fromContainer(displayList.playerNumber9),
      PlayerNumber.fromContainer(displayList.playerNumber10),
      PlayerNumber.fromContainer(displayList.playerNumber11),
      PlayerNumber.fromContainer(displayList.playerNumber12),
      PlayerNumber.fromContainer(displayList.playerNumber13),
      PlayerNumber.fromContainer(displayList.playerNumber14),
      PlayerNumber.fromContainer(displayList.playerNumber15),
    ];

    cardRows = [
      [cards[0],cards[1],cards[2],cards[3],cards[4]],
      [cards[5],cards[6],cards[7],cards[8],cards[9]],
      [cards[10],cards[11],cards[12],cards[13],cards[14]]
    ];
    
    for (let i = 0; i < cards.length; i++){
      cards[i].index = i;
    }
  }

  function populate(data) {
    numbers = data;
    //work out the total winning amount for this game
    //we'll need this if we get a WIN ALL
    totalAmount = 0;
    totalBonus = 0;
    for (let i = 0; i < numbers.length; i++){
      totalAmount += numbers[i][1];
      totalBonus += numbers[i][2];
    }

    //store the total number of bonus symbols
    msgBus.publish('Game.TotalBonus', totalBonus);
  }

  function enable() {
    // Return an array of promises for each card's lifecycle
    return cards.map(async card => {
      // Start idle animations
      msgBus.publish('Game.IdleAll');
      // Enable the card and wait for it to be revealed (manually or automatically)
      await card.enable();
      // Mark as selected
      msgBus.publish('Game.PlayerPickPoint', card);
      msgBus.publish('Game.HideRevealAllIfAllRevealed');
      // Play the Player Number reveal audio
      if (!autoPlay.enabled){audio.playSequential('playerNumber');}
      // Get the next Winning Number
      const nextData = numbers.shift();
      // Populate the card with the next Player Number, ready to be uncovered
      card.populate(nextData);
      // We've started to animate
      msgBus.publish('Game.PlayerAnimating', card);
      //show number of bonus symbols for this number
      Tween.delayedCall(gameConfig.showBonusDelay, () => card.showBonus());
      // Wait for the uncover animation (if animated)           
      await card.uncover();
      // Finished animating
      msgBus.publish('Game.PlayerAnimated', card);
      // Reset Idle
      msgBus.publish('Game.ResetIdle');
      // Player number revealed
      msgBus.publish('Game.PlayerNumber', nextData[0]);
      // If the revealed number matches a revealed Winning Number then mark the match
      // But with this game we also need to consider an x2 win or a Win All
      if (!card.matched){
        if (numberState.winning.includes(nextData[0])){
          //then it's a number match, woo
          if (!autoPlay.enabled){
            card.match();
            audio.playSequential('match');
            meterData.win += card.value;
            await card.presentWin();
          }          
        }else if (nextData[0] === 'Y'){
          //it's a 2x
          if (!autoPlay.enabled){
            card.match('MULTIPLIER');
            audio.playSequential('multiplier');
            meterData.win += (card.value*2);
            await card.presentWin();
          }else{
            pendingWins.push([card, nextData[0]]);
          }          
        }else if (nextData[0] === 'Z'){
          //it's a win all
          if (!autoPlay.enabled){
            card.match('WIN_ALL');
            audio.playSequential('winAllFound');
            meterData.win += card.value;
            //we don't need to update the win meter with the rest of the values here
            //but we do want to update it as each number is revealed
            msgBus.publish('Game.WinAllActivated', {
              winAllFound:true,
              winAllValue:totalAmount,
              isRevealAll: false
            });
            await card.presentWin();
          }else{
            pendingWins.push([card, nextData[0]]);
          }          
        }
      }
    });
  }

  function revealAll() {
    // Stop Idle
    msgBus.publish('Game.StopIdle');
    // Get all the cards yet to be revealed
    const unrevealed = {
      total: cards.filter(number => !number.revealed),
      row1: cardRows[0].filter(number => !number.revealed),
      row2: cardRows[1].filter(number => !number.revealed),
      row3: cardRows[2].filter(number => !number.revealed)
    };
    // Return an array of tweens that calls reveal on each card in turn
    return unrevealed.total.map(number => Tween.delayedCall(addDelay(unrevealed, number), number.reveal, null, number));
  }

  function addDelay(data, number){
    let delay = 0;
    let thisRow = 0;

    // Find the row number is on
    if (data.row1.indexOf(number) > -1){thisRow = 1;}
      else if (data.row2.indexOf(number) > -1){thisRow = 2;}
      else if (data.row3.indexOf(number) > -1){thisRow = 3;}

    // We only need to add a delay to row 2 items if row 1 has unrevealed items in it
    if (thisRow > 1){      
      delay += data.row1.length > 0  ? gameConfig.autoPlayPlayerRowInterval : 0;      
    }

    // Likewise, only add a delay to row 3 if row 2 has unrevealed items in it
    if (thisRow > 2){      
      delay += data.row2.length > 0  ? gameConfig.autoPlayPlayerRowInterval : 0; 
    }

    return delay;
  }

  function reset() {
    cards.forEach(number => number.reset());
    autoWinsProcessed = undefined;
    pendingWins = [];
  }

  function checkMatch(data) {
    const matchedCards = cards.filter(card => card.revealed && !card.matched && card.number === data.winningNumber);
    //now run through the array and mark each one off
    for (let i = 0; i < matchedCards.length; i++){
      if (!autoPlay.enabled || data.isRevealAll){
        matchedCards[i].match();
        matchedCards[i].presentWin();
        meterData.win += matchedCards[i].value;
        audio.playSequential('match');
      }      
    }
  }

  function winAllMatch(inNum){
    if (cards[inNum].number !== 'Z'){
      cards[inNum].match();
      cards[inNum].presentWin();
      meterData.win += cards[inNum].value;
      audio.playSequential('match');
    }    
  }

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

  function promptIdle() {
    Tween.killTweensOf(promptIdle);
    // Check if there are any remaining unrevealed cards
    const unrevealed = cards.filter(number => !number.revealed);
    if (autoPlay.enabled || unrevealed.length === 0 || idleState.winning.length !== 0 || idleState.player.length !== 0 || idleState.winningOver.length !== 0 || idleState.playerOver.length !== 0) {
      return;
    }

    for (let i = 0; i < unrevealed.length; i++){
      unrevealed[i].prompt();
    }
  }

  function stopIdle() {
    Tween.killTweensOf(promptIdle);
    // Check if there are any remaining unrevealed cards
    const unrevealed = cards.filter(number => !number.revealed);
    if (unrevealed.length === 0) {
      return;
    }

    for (let i = 0; i < unrevealed.length; i++){
      unrevealed[i].stopIdle();
    }
  }

  /**
   * Fulfil promise
   */
  function processComplete() {
    if (autoWinsProcessed) {
      autoWinsProcessed();
    }
  }

  function processWins(){
    // Right, do we have any pending wins?
    // Run through the loop and deal with it
    for (let i = 0; i < pendingWins.length; i++){
      Tween.delayedCall((gameConfig.revealAllProcessInterval*i), presentPendingWin, [{
        card: pendingWins[i][0],
        value: pendingWins[i][1],
        index: i
      }]);     
    }
  }

  // async function so we can check if presentWin on pending cards has been completed
  async function presentPendingWin(data){    
    if (!data.card.matched){
      if (data.value === 'Y'){
        //it's a 2x
        data.card.match('MULTIPLIER');
        audio.playSequential('multiplier');
        meterData.win += (data.card.value*2);
      }else if (data.value === 'Z'){
        //it's a win all
        data.card.match('WIN_ALL');
        audio.playSequential('winAllFound');
        meterData.win += data.card.value;
        //we don't need to update the win meter with the rest of the values here
        //but we do want to update it as each number is revealed
        msgBus.publish('Game.WinAllActivated', {
          winAllFound:true,
          winAllValue:totalAmount,
          isRevealAll: true
        });                
      }

      // If this is the last pending win, wait for it to complete then resolve the promise
      // Otherwise just present the win
      if (data.index === pendingWins.length-1){
        await data.card.presentWin();
        processComplete();
      }else{
        data.card.presentWin();
      }
    }
  }

  // Process any pending wins i.e. 2x and Win All
  async function processPending() {
    if (pendingWins.length > 0){
      // Set up a promise
      await new Promise(c => {
        autoWinsProcessed = c;
        processWins();
      });
    }    
  }

  msgBus.subscribe('Game.WinningNumber', num => checkMatch({winningNumber:num, isRevealAll:false}));   
  msgBus.subscribe('Game.RevealAllWinningNumber', num => checkMatch({winningNumber:num, isRevealAll:true}));
  msgBus.subscribe('Game.WinAllMatch', winAllMatch);

  msgBus.subscribe('Game.IdleAll', () => idleManager({state:'IdleAll'}));
  msgBus.subscribe('Game.StopIdle', () => idleManager({state:'StopIdle'}));
  msgBus.subscribe('Game.ResetIdle', () => idleManager({state:'ResetIdle'}));
  msgBus.subscribe('Game.AutoPlayStop', () => idleManager({state:'ResetIdle'}));

  return {
    init,
    populate,
    enable,
    revealAll,
    processPending,
    reset,
  };
});
