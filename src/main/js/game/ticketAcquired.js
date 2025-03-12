define((require) => {
  const scenarioData = require('skbJet/componentManchester/standardIW/scenarioData');
  const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const bonusGame = require('game/components/bonusGame');

  function ticketAcquired() {
    winningNumbers.populate(scenarioData.scenario.winningNumbers);
    playerNumbers.populate(scenarioData.scenario.playerNumbers);
    bonusGame.populate(scenarioData.scenario.bonusString, scenarioData.scenario.bonusOutcome);
    
    //if (gameConfig.backgroundMusicEnabled) {
      //audio.play('music', true);
    //}

    if (!audio.isPlaying('music') && gameConfig.backgroundMusicEnabled) {
      audio.fadeIn('music', 0.5, true, 0.35);
    }

    gameFlow.next('START_REVEAL');
  }

  gameFlow.handle(ticketAcquired, 'TICKET_ACQUIRED');
});
