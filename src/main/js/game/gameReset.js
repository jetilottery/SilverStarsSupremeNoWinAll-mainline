define(function(require) {
  const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
  const numberState = require('game/state/numbers');
  const idleState = require('game/state/idle');
  const animState = require('game/state/anim');
  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const bonusCard = require('game/components/bonusCard');
  const bonusGame = require('game/components/bonusGame');
  const winUpTo = require('game/components/winUpTo');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

  function prepareOrReset() {
    resetAll();
    gameFlow.next();
  }

  function resetAll(){
    numberState.reset();
    idleState.reset();
    animState.reset();
    winningNumbers.reset();
    playerNumbers.reset();
    bonusCard.reset();
    bonusGame.reset();
    winUpTo.reset();

    // Make sure we hide the result
    msgBus.publish('UI.hideResult');

    // Fade out the win/lose terminator in case it is still playing
    if (audio.isPlaying('winTerminator')) {
      audio.fadeOut('winTerminator', 1);
    }
    if (audio.isPlaying('loseTerminator')) {
      audio.fadeOut('loseTerminator', 1);
    }
  }

  // Subscribe to Ticket Cost +/- as we will not be in GAME_RESET when these are called
  msgBus.subscribe('TicketSelect.CostUp', resetAll);
  msgBus.subscribe('TicketSelect.CostDown', resetAll);
  msgBus.subscribe('TicketSelect.CostMax', resetAll); 

  gameFlow.handle(prepareOrReset, 'GAME_RESET');
  gameFlow.handle(prepareOrReset, 'GAME_PREPARE');
});
