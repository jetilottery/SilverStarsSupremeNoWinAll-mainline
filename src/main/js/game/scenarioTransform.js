define((require) => {
  const prizeData = require('skbJet/componentManchester/standardIW/prizeData');

  return function scenarioTransform(scenarioString) {
    // split the string into the three components; winning, instant and player numbers
    const [winningString, playerString, bonusString] = scenarioString.split('|');

    // winning numbers are just a comma seperated list of numbers
    const winningNumbers = winningString.split(',').map(int => parseInt(int, 10));

    // instntWin is either 0 for no win or 1, 2, 3 for prizes IW1, IW2, IW3
    const bonusOutcome = bonusString === '0' ? 0 : prizeData.prizeTable['IW' + bonusString];

    // player numbers are a list of key:value pairs describing a number and its associated prize
    const playerPairs = playerString.split(',');
    const playerNumbers = playerPairs.map((pair) => {
    const [number, prize] = pair.split(':');
      
    //if the number is a number, use the number
    //but it could be a letter
    var tempNum;
    if (!isNaN(parseInt(number, 10))){
      tempNum = parseInt(number, 10);
    }else{
      tempNum = number;
    }

    //we'll need to splot the second part
    //the first part is the prize
    //the second part is if there is a bonus collection symbol
    var prizePairs = prize.split("");
    var numBonusItems = parseInt(prizePairs[1]);

    return [
        tempNum,
        prizeData.prizeTable[prizePairs[0]],
        numBonusItems
      ];
    });

    return {
      winningNumbers,      
      playerNumbers,
      bonusString,
      bonusOutcome
    };
  };
});