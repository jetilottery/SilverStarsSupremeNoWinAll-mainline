define({
  _BASE_APP: {
    children: ['baseGameContainer', 'bonusGameContainer'],
  },

  baseGameContainer: {
    children: ['background', 'logo', 'winUpTo', 'bonusCardContainer', 'numberContainer', 'bonusSymbolFly', 'winAllContainer'],
  },

  /*
   * BACKGROUND
   */
  background: {
    type: 'sprite',
    children: ['animatedBackground', 'selectionBackgrounds'],
  },

  animatedBackground: {
    type: 'sprite',
  },

  selectionBackgrounds: {
    type: 'sprite',
    landscape: {
      texture: 'selectionBackgrounds'
    },
    portrait: {
      texture: 'selectionBackgroundsPortrait'
    },
  },

  /*
   * LOGO
   */
  logo: {
    type: 'sprite',
    anchor: 0.5,
    landscape: {
      x: 327,
      y: 111,
      texture: 'landscape_gameLogo',
    },
    portrait: {
      x: 405,
      y: 128,
      texture: 'portrait_gameLogo',
    },
  },

  /*
   * WIN UP TO
   */
  winUpTo: {
    type: 'container',
    children: ['winUpToContainer'],
    landscape: {
      x: 327,
      y: 250
    },
    portrait: {
      x: 405,
      y: 290
    },
  },
  winUpToContainer: {
    type: 'container',
    children: ['winUpToIn', 'winUpToOut'],
  },
  winUpToIn: {
    type: 'sprite',
    anchor: 0.5,
    children: ['winUpToInText', 'winUpToInValue'],
  },
  winUpToInText: {
    type: 'text',
    style: 'winUpToText',
    string: 'winUpToText',
    anchor: 0.5,
    y: 10,
    maxWidth: 200,
  },
  winUpToInValue: {
    type: 'text',
    style: 'winUpToValue',
    anchor: 0.5,
    maxWidth: 200,
  },
  winUpToOut: {
    type: 'sprite',
    anchor: 0.5,
    children: ['winUpToOutText', 'winUpToOutValue'],
  },
  winUpToOutText: {
    type: 'text',
    style: 'winUpToText',
    string: 'winUpToText',
    anchor: 0.5,
    y: 10,
    maxWidth: 200,
  },
  winUpToOutValue: {
    type: 'text',
    style: 'winUpToValue',
    anchor: 0.5,
    maxWidth: 200,
  },

  /*
   * WINNING NUMBERS
   */
  winningNumbers: {
    type: 'container',
    children: [
      'winningNumbersTitle',
      'winningNumber1',
      'winningNumber2',
      'winningNumber3',
      'winningNumber4',
    ],
    landscape: {
      x: 16,
      y: 292
    },
    portrait: {
      x: 106,
      y: 340
    },
  },
  winningNumbersTitle: {
    type: 'text',
    string: 'luckyNumbers',
    style: 'winningNumbersTitle',
    anchor: 0.5,
    maxWidth: 350,
    landscape: {
      x: 311,
      y: 34
    },
    portrait: {
      x: 299,
      y: 27
    },
  },
  winningNumber1: {
    type: 'container',
    landscape: {
      x: 92,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 89,
      y: 120,
      scale: 0.914
    },
  },
  winningNumber2: {
    type: 'container',
    landscape: {
      x: 238,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 229,
      y: 120,
      scale: 0.914
    },
  },
  winningNumber3: {
    type: 'container',
    landscape: {
      x: 384,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 369,
      y: 120,
      scale: 0.914
    },
  },
  winningNumber4: {
    type: 'container',
    landscape: {
      x: 530,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 509,
      y: 120,
      scale: 0.914
    },
  },


  /*
   * BONUS AREA
   */
  bonusCardContainer: {
    type: 'container',
    children: ['bonusBack', 'bonusCard'],
    landscape: {
      x: 328,
      y: 594
    },
    portrait: {
      x: 405,
      y: 613
    },
  },
  bonusBack: {
    type: 'sprite',
    anchor: 0.5,
  },
  bonusCard: {
    type: 'sprite',
    children: ['bonusLabel', 'bonusSymbol1', 'bonusSymbol2', 'bonusSymbol3', 'bonusSymbol4', 'bonusSymbol5'],
    anchor: 0.5,
  },
  bonusLabel: {
    type: 'text',
    style: 'bonusLabel',
    string: 'bonus',
    anchor: 0.5,
    maxWidth: 320,
    landscape: {
      x: 0,
      y: -32
    },
    portrait: {
      x: 0,
      y: -32
    },
  },
  bonusSymbol1: {
    type: 'container',
    landscape: {
      x: -132,
      y: 21
    },
    portrait: {
      x: -132,
      y: 21
    },
  },
  bonusSymbol2: {
    type: 'container',
    landscape: {
      x: -66,
      y: 21
    },
    portrait: {
      x: -66,
      y: 21
    },
  },
  bonusSymbol3: {
    type: 'container',
    landscape: {
      x: 0,
      y: 21
    },
    portrait: {
      x: 0,
      y: 21
    },
  },
  bonusSymbol4: {
    type: 'container',
    landscape: {
      x: 66,
      y: 21
    },
    portrait: {
      x: 66,
      y: 21
    },
  },
  bonusSymbol5: {
    type: 'container',
    landscape: {
      x: 132,
      y: 21
    },
    portrait: {
      x: 132,
      y: 21
    },
  },

  /*
   * NUMBER CONTAINER
   */
  numberContainer: {
    type: 'container',
    children: ['playerNumbers', 'winningNumbers']
  },

  /*
   * PLAYER NUMBERS
   */
  playerNumbers: {
    type: 'container',
    children: [
      'playerNumbersTitle',
      'playerNumber1',
      'playerNumber2',
      'playerNumber3',
      'playerNumber4',
      'playerNumber5',
      'playerNumber6',
      'playerNumber7',
      'playerNumber8',
      'playerNumber9',
      'playerNumber10',
      'playerNumber11',
      'playerNumber12',
      'playerNumber13',
      'playerNumber14',
      'playerNumber15',
    ],
    landscape: {
      x: 656,
      y: 100
    },
    portrait: {
      x: 36,
      y: 688
    },
  },
  playerNumbersTitle: {
    type: 'text',
    string: 'yourNumbers',
    style: 'playerNumbersTitle',
    anchor: 0.5,
    maxWidth: 750,
    landscape: {
      x: 384,
      y: 38
    },
    portrait: {
      x: 369,
      y: 32
    },
  },
  playerNumber1: {
    type: 'container',
    landscape: {
      x: 92,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 89,
      y: 120,
      scale: 0.914
    },
  },
  playerNumber2: {
    type: 'container',
    landscape: {
      x: 238,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 229,
      y: 120,
      scale: 0.914
    },
  },
  playerNumber3: {
    type: 'container',
    landscape: {
      x: 384,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 369,
      y: 120,
      scale: 0.914
    },
  },
  playerNumber4: {
    type: 'container',
    landscape: {
      x: 530,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 509,
      y: 120,
      scale: 0.914
    },
  },
  playerNumber5: {
    type: 'container',
    landscape: {
      x: 676,
      y: 133,
      scale: 1
    },
    portrait: {
      x: 649,
      y: 120,
      scale: 0.914
    },
  },
  playerNumber6: {
    type: 'container',
    landscape: {
      x: 92,
      y: 279,
      scale: 1
    },
    portrait: {
      x: 89,
      y: 254,
      scale: 0.914
    },
  },
  playerNumber7: {
    type: 'container',
    landscape: {
      x: 238,
      y: 279,
      scale: 1
    },
    portrait: {
      x: 229,
      y: 254,
      scale: 0.914
    },
  },
  playerNumber8: {
    type: 'container',
    landscape: {
      x: 384,
      y: 279,
      scale: 1
    },
    portrait: {
      x: 369,
      y: 254,
      scale: 0.914
    },
  },
  playerNumber9: {
    type: 'container',
    landscape: {
      x: 530,
      y: 279,
      scale: 1
    },
    portrait: {
      x: 509,
      y: 254,
      scale: 0.914
    },
  },
  playerNumber10: {
    type: 'container',
    landscape: {
      x: 676,
      y: 279,
      scale: 1
    },
    portrait: {
      x: 649,
      y: 254,
      scale: 0.914
    },
  },
  playerNumber11: {
    type: 'container',
    landscape: {
      x: 92,
      y: 425,
      scale: 1
    },
    portrait: {
      x: 89,
      y: 388,
      scale: 0.914
    },
  },
  playerNumber12: {
    type: 'container',
    landscape: {
      x: 238,
      y: 425,
      scale: 1
    },
    portrait: {
      x: 229,
      y: 388,
      scale: 0.914
    },
  },
  playerNumber13: {
    type: 'container',
    landscape: {
      x: 384,
      y: 425,
      scale: 1
    },
    portrait: {
      x: 369,
      y: 388,
      scale: 0.914
    },
  },
  playerNumber14: {
    type: 'container',
    landscape: {
      x: 530,
      y: 425,
      scale: 1
    },
    portrait: {
      x: 509,
      y: 388,
      scale: 0.914
    },
  },
  playerNumber15: {
    type: 'container',
    landscape: {
      x: 676,
      y: 425,
      scale: 1
    },
    portrait: {
      x: 649,
      y: 388,
      scale: 0.914
    },
  },

  /*
   * Container for bonus symbols to fly around
   */
  bonusSymbolFly: {
    type: 'container',
  },

  /*
   * Bonus Game Container
   */
  bonusGameContainer: {
    type: 'container',
    children: ['bonusGameBackground', 'bonusLogo', 'bonusPrizeTable', 'bonusPickPoints', 'bonusLives', 'bonusParticles']
  },
  bonusGameBackground: {
    type: 'sprite',
  },

  /*
   * BONUS LOGO
   */
  bonusLogo: {
    type: 'sprite',
    anchor: 0.5,
    landscape: {
      x: 304,
      y: 111,
      texture: 'landscape_bonus_gameLogo',
    },
    portrait: {
      x: 585,
      y: 259,
      scale: 0.585,
      texture: 'portrait_bonus_gameLogo',
    },
  },

  /*
   * Bonus Prize Table
   */
  bonusPrizeTable: {
    type: 'container',
    children: [
      'prizeTableAnim',
      'prizeLevel1',
      'prizeLevel2',
      'prizeLevel3',
      'prizeLevel4',
      'prizeLevel5',
      'prizeLevel6'
    ],
    landscape: {
      scale: 0.75,
      x: 75,
      y: 150
    },
    portrait: {
      scale: 1,
      x: 0,
      y: 0
    },
  },
  prizeTableAnim: {
    type: 'sprite',
  },
  prizeLevel6: {
    type: 'container',
    children: ['bonusPrize6Win', 'bonusPrize6NoWin'],
    landscape: {
      x: 300,
      y: 127
    },
    portrait: {
      x: 245,
      y: 138
    },
  },
  prizeLevel5: {
    type: 'container',
    children: ['bonusPrize5Win', 'bonusPrize5NoWin'],
    landscape: {
      x: 300,
      y: 219
    },
    portrait: {
      x: 245,
      y: 230
    },
  },
  prizeLevel4: {
    type: 'container',
    children: ['bonusPrize4Win', 'bonusPrize4NoWin'],
    landscape: {
      x: 300,
      y: 303
    },
    portrait: {
      x: 245,
      y: 314
    },
  },
  prizeLevel3: {
    type: 'container',
    children: ['bonusPrize3Win', 'bonusPrize3NoWin'],
    landscape: {
      x: 300,
      y: 379
    },
    portrait: {
      x: 245,
      y: 390
    },
  },
  prizeLevel2: {
    type: 'container',
    children: ['bonusPrize2Win', 'bonusPrize2NoWin'],
    landscape: {
      x: 300,
      y: 433
    },
    portrait: {
      x: 245,
      y: 444
    },
  },
  prizeLevel1: {
    type: 'container',
    children: ['bonusPrize1Win', 'bonusPrize1NoWin'],
    landscape: {
      x: 300,
      y: 468
    },
    portrait: {
      x: 245,
      y: 479
    },
  },

  bonusPrize1Win: {
    type: 'container',
    children: ['bonusPrize1WinIn', 'bonusPrize1WinOut'],
  },
  bonusPrize1NoWin: {
    type: 'container',
    children: ['bonusPrize1NoWinIn', 'bonusPrize1NoWinOut'],
  },
  bonusPrize2Win: {
    type: 'container',
    children: ['bonusPrize2WinIn', 'bonusPrize2WinOut'],
  },
  bonusPrize2NoWin: {
    type: 'container',
    children: ['bonusPrize2NoWinIn', 'bonusPrize2NoWinOut'],
  },
  bonusPrize3Win: {
    type: 'container',
    children: ['bonusPrize3WinIn', 'bonusPrize3WinOut'],
  },
  bonusPrize3NoWin: {
    type: 'container',
    children: ['bonusPrize3NoWinIn', 'bonusPrize3NoWinOut'],
  },
  bonusPrize4Win: {
    type: 'container',
    children: ['bonusPrize4WinIn', 'bonusPrize4WinOut'],
  },
  bonusPrize4NoWin: {
    type: 'container',
    children: ['bonusPrize4NoWinIn', 'bonusPrize4NoWinOut'],
  },
  bonusPrize5Win: {
    type: 'container',
    children: ['bonusPrize5WinIn', 'bonusPrize5WinOut'],
  },
  bonusPrize5NoWin: {
    type: 'container',
    children: ['bonusPrize5NoWinIn', 'bonusPrize5NoWinOut'],
  },
  bonusPrize6Win: {
    type: 'container',
    children: ['bonusPrize6WinIn', 'bonusPrize6WinOut'],
  },
  bonusPrize6NoWin: {
    type: 'container',
    children: ['bonusPrize6NoWinIn', 'bonusPrize6NoWinOut'],
  },

  bonusPrize1WinIn: {
    type: 'text',
    style: 'bonusWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize1NoWinIn: {
    type: 'text',
    style: 'bonusNoWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize1WinOut: {
    type: 'text',
    style: 'bonusWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize1NoWinOut: {
    type: 'text',
    style: 'bonusNoWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize2WinIn: {
    type: 'text',
    style: 'bonusWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize2NoWinIn: {
    type: 'text',
    style: 'bonusNoWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize2WinOut: {
    type: 'text',
    style: 'bonusWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize2NoWinOut: {
    type: 'text',
    style: 'bonusNoWin',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize3WinIn: {
    type: 'text',
    style: 'bonusWin3',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize3NoWinIn: {
    type: 'text',
    style: 'bonusNoWin3',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize3WinOut: {
    type: 'text',
    style: 'bonusWin3',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize3NoWinOut: {
    type: 'text',
    style: 'bonusNoWin3',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize4WinIn: {
    type: 'text',
    style: 'bonusWin4',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize4NoWinIn: {
    type: 'text',
    style: 'bonusNoWin4',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize4WinOut: {
    type: 'text',
    style: 'bonusWin4',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize4NoWinOut: {
    type: 'text',
    style: 'bonusNoWin4',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize5WinIn: {
    type: 'text',
    style: 'bonusWin5',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize5NoWinIn: {
    type: 'text',
    style: 'bonusNoWin5',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize5WinOut: {
    type: 'text',
    style: 'bonusWin5',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize5NoWinOut: {
    type: 'text',
    style: 'bonusNoWin5',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize6WinIn: {
    type: 'text',
    style: 'bonusWin6',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize6NoWinIn: {
    type: 'text',
    style: 'bonusNoWin6',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize6WinOut: {
    type: 'text',
    style: 'bonusWin6',
    anchor: 0.5,
    maxWidth: 550,
  },
  bonusPrize6NoWinOut: {
    type: 'text',
    style: 'bonusNoWin6',
    anchor: 0.5,
    maxWidth: 550,
  },

  bonusLives: {
    type: 'container',
    children: [
      'bonusLivesLabel',
      'bonusLife1',
      'bonusLife2',
      'bonusLife3'
    ],
    landscape: {
      x: 163,
      y: 526
    },
    portrait: {
      x: 469,
      y: 361
    },
  },
  bonusLivesLabel: {
    type: 'text',
    style: 'bonusFind3ToEnd',
    string: 'bonusLives',
    anchor: 0.5,
    maxWidth: 320,
    landscape: {
      x: 138,
      y: 14
    },
    portrait: {
      x: 112,
      y: 0
    },
  },
  bonusLife1: {
    type: 'container',
    landscape: {
      x: 25,
      y: 55,
      scale: 0.813
    },
    portrait: {
      x: 0,
      y: 42,
      scale: 0.813
    },
  },
  bonusLife2: {
    type: 'container',
    landscape: {
      x: 113,
      y: 55,
      scale: 0.813
    },
    portrait: {
      x: 88,
      y: 42,
      scale: 0.813
    },
  },
  bonusLife3: {
    type: 'container',
    landscape: {
      x: 201,
      y: 55,
      scale: 0.813
    },
    portrait: {
      x: 176,
      y: 42,
      scale: 0.813
    }
  },
  bonusPickPoints: {
    type: 'container',
    children: [
      'bonusInfoString',
      'bonusPickPoint1',
      'bonusPickPoint2',
      'bonusPickPoint3',
      'bonusPickPoint4',
      'bonusPickPoint5',
      'bonusPickPoint6',
      'bonusPickPoint7',
      'bonusPickPoint8',
      'bonusPickPoint9',
      'bonusPickPoint10',
      'bonusPickPoint11',
      'bonusPickPoint12'
    ],
    landscape: {
      x: 596,
      y: 95
    },
    portrait: {
      x: 54,
      y: 551
    },
  },
  bonusInfoString: {
    type: 'text',
    style: 'bonusFind3ToWin',
    string: 'bonusInfo',
    anchor: 0.5,
    maxWidth: 702,
    y: 0,
    x: 351
  },
  bonusPickPoint1: {
    type: 'container',
    landscape: {
      x: 0,
      y: 25
    },
    portrait: {
      x: 0,
      y: 25
    },
  },
  bonusPickPoint2: {
    type: 'container',
    landscape: {
      x: 178,
      y: 25
    },
    portrait: {
      x: 178,
      y: 25
    },
  },
  bonusPickPoint3: {
    type: 'container',
    landscape: {
      x: 356,
      y: 25
    },
    portrait: {
      x: 356,
      y: 25
    },
  },
  bonusPickPoint4: {
    type: 'container',
    landscape: {
      x: 534,
      y: 25
    },
    portrait: {
      x: 534,
      y: 25
    },
  },
  bonusPickPoint5: {
    type: 'container',
    landscape: {
      x: 0,
      y: 204
    },
    portrait: {
      x: 0,
      y: 204
    },
  },
  bonusPickPoint6: {
    type: 'container',
    landscape: {
      x: 178,
      y: 204
    },
    portrait: {
      x: 178,
      y: 204
    },
  },
  bonusPickPoint7: {
    type: 'container',
    landscape: {
      x: 356,
      y: 204
    },
    portrait: {
      x: 356,
      y: 204
    },
  },
  bonusPickPoint8: {
    type: 'container',
    landscape: {
      x: 534,
      y: 204
    },
    portrait: {
      x: 534,
      y: 204
    },
  },
  bonusPickPoint9: {
    type: 'container',
    landscape: {
      x: 0,
      y: 381
    },
    portrait: {
      x: 0,
      y: 381
    },
  },
  bonusPickPoint10: {
    type: 'container',
    landscape: {
      x: 178,
      y: 381
    },
    portrait: {
      x: 178,
      y: 381
    },
  },
  bonusPickPoint11: {
    type: 'container',
    landscape: {
      x: 356,
      y: 381
    },
    portrait: {
      x: 356,
      y: 381
    },
  },
  bonusPickPoint12: {
    type: 'container',
    landscape: {
      x: 534,
      y: 381
    },
    portrait: {
      x: 534,
      y: 381
    },
  },

  /*
   * Container for bonus particles to fly to the prize table
   */
  bonusParticles: {
    type: 'container',
  },

  /*
   * Win All Container
   */
  winAllContainer: {
    type: 'container',
    children: ['winAllAnim', 'winAllPlaque'],
  },
  winAllAnim: {
    type: 'container',
    landscape: {
      x: 720,
      y: 377
    },
    portrait: {
      x: 405,
      y: 678
    },
  },
  winAllPlaque: {
    type: 'container',
    children: [
      'winAllBG',
      'winAllMessage',
      'winAllValue',
    ],
    landscape: {
      x: 720,
      y: 377
    },
    portrait: {
      x: 405,
      y: 678
    },
  },
  winAllBG: {
    type: 'sprite',
    anchor: 0.5,
    landscape: {
      texture: 'landscape_winAllMessageBackground'
    },
    portrait: {
      texture: 'portrait_winAllMessageBackground'
    },
  },
  winAllMessage: {
    type: 'text',
    string: 'winAll',
    style: 'winAllBody',
    y: -68,
    anchor: 0.5,
    portrait: {
      maxWidth: 700
    },
    landscape: {
      maxWidth: 1200
    },
  },
  winAllValue: {
    type: 'text',
    style: 'winAllValue',
    y: 40,
    anchor: 0.5,
  },

  /*
   * How To Play
   */
  howToPlayPages: {
    type: 'container',
    children: ['howToPlayPage1', 'howToPlayPage2'],
  },
  howToPlayPage1: {
    type: 'text',
    string: 'page1',
    style: 'howToPlayText',
    fontSize: 30,
    wordWrap: true,
    anchor: 0.5,
    align: 'center',
    landscape: {
      x: 720,
      y: 415,
      wordWrapWidth: 1100
    },
    portrait: {
      x: 405,
      y: 664,
      wordWrapWidth: 560
    },
  },
  howToPlayPage2: {
    type: 'text',
    string: 'page2',
    style: 'howToPlayText',
    fontSize: 30,
    wordWrap: true,
    anchor: 0.5,
    align: 'center',
    landscape: {
      x: 720,
      y: 415,
      wordWrapWidth: 1100
    },
    portrait: {
      x: 405,
      y: 664,
      wordWrapWidth: 560
    },
  },

  /*
   * UI Panel
   */
  buttonBar: {
    type: 'container',
    landscape: {
      x: 0,
      y: 662
    },
    portrait: {
      x: 0,
      y: 1248
    },
    children: [
      'helpButtonStatic',
      'helpButton',
      'homeButtonStatic',
      'homeButton',
      'exitButton',
      'playAgainButton',
      'tryAgainButton',
      'buyButton',
      'buyButtonAnim',
      'tryButton',
      'tryButtonAnim',
      'moveToMoneyButton',
    ],
  },
  buyButtonAnim: {
    type: 'sprite',
    anchor: 0.5,
  },
  tryButtonAnim: {
    type: 'sprite',
    anchor: 0.5,
  },
  footerContainer: {
    type: 'container',
    children: ['footerBG', 'balanceMeter', 'ticketCostMeter', 'winMeter', 'divider_1_3', 'divider_2_3', 'divider_1_2'],
    landscape: {
      y: 761
    },
    portrait: {
      y: 1349
    },
  },
  footerBG: {
    type: 'sprite',
    landscape: {
      texture: 'landscape_footerBar',
      y: 5
    },
    portrait: {
      texture: 'portrait_footerBar',
      y: 5
    },
  },

  autoPlayButton_default: {
    type: 'point',
    landscape: {
      x: 720,
      y: 712
    },
    portrait: {
      x: 405,
      y: 1297
    },
  },
  autoPlayButton_multi: {
    type: 'point',
    landscape: {
      x: 918,
      y: 712
    },
    portrait: {
      x: 405,
      y: 1297
    },
  },

  howToPlayBackground: {
    type: 'sprite',
    anchor: {
      x: 0.5
    },
    landscape: {
      x: 720,
      y: 98,
      texture: 'landscape_tutorialBackground',
    },
    portrait: {
      x: 405,
      y: 212,
      texture: 'portrait_tutorialBackground',
    },
  },
  howToPlayTitle: {
    type: 'text',
    string: 'howToPlay',
    style: 'howToPlayTitle',
    anchor: 0.5,
    landscape: {
      x: 720,
      y: 178
    },
    portrait: {
      x: 405,
      y: 292
    },
  },
  versionText: {
    type: 'text',
    style: 'versionText',
    x: 35,
    landscape: {
      y: 120
    },
    portrait: {
      y: 234
    },
    alpha: 0.5,
  },
  howToPlayClose: {
    type: 'button',
    string: 'button_ok',
    landscape: {
      x: 720,
      y: 678
    },
    portrait: {
      x: 405,
      y: 1071
    },
    textures: {
      enabled: 'tutorialOKButtonEnabled',
      over: 'tutorialOKButtonOver',
      pressed: 'tutorialOKButtonPressed',
    },
    style: {
      enabled: 'tutorialOKButtonEnabled',
      over: 'tutorialOKButtonOver',
      pressed: 'tutorialOKButtonPressed',
    },
  },
  howToPlayPrevious: {
    type: 'button',
    landscape: {
      x: 72,
      y: 418
    },
    portrait: {
      x: 64,
      y: 682
    },
    textures: {
      enabled: 'tutorialLeftButtonEnabled',
      disabled: 'tutorialLeftButtonDisabled',
      over: 'tutorialLeftButtonOver',
      pressed: 'tutorialLeftButtonPressed',
    },
  },
  howToPlayNext: {
    type: 'button',
    landscape: {
      x: 1368,
      y: 418
    },
    portrait: {
      x: 746,
      y: 682
    },
    textures: {
      enabled: 'tutorialRightButtonEnabled',
      disabled: 'tutorialRightButtonDisabled',
      over: 'tutorialRightButtonOver',
      pressed: 'tutorialRightButtonPressed',
    },
  },

  howToPlayIndicators: {
    type: 'container',
    children: ['howToPlayIndicatorActive', 'howToPlayIndicatorInactive'],
    landscape: {
      x: 720,
      y: 610
    },
    portrait: {
      x: 405,
      y: 999
    },
  },
  howToPlayIndicatorActive: {
    type: 'sprite',
    texture: 'tutorialPageIndicatorActive',
  },
  howToPlayIndicatorInactive: {
    type: 'sprite',
    texture: 'tutorialPageIndicatorInactive',
  },

  audioButtonContainer: {
    type: 'container',
    landscape: {
      x: 79,
      y: 675
    },
    portrait: {
      x: 71,
      y: 1071
    },
  },

  resultPlaquesContainer: {
    type: 'container',
    children: [
      'resultPlaqueOverlay',
      'winPlaqueBG',
      'winPlaqueMessage',
      'winPlaqueValue',
      'winPlaqueCloseButton',
      'losePlaqueBG',
      'losePlaqueMessage',
      'losePlaqueCloseButton',
    ],
    landscape: {
      x: 720,
      y: 377
    },
    portrait: {
      x: 405,
      y: 678
    },
  },

  resultPlaqueOverlay: {
    type: 'sprite',
    anchor: 0.5,
    y: -114,
  },

  winPlaqueMessage: {
    type: 'text',
    string: 'message_win',
    style: 'winPlaqueBody',
    y: -68,
    anchor: 0.5,
    maxWidth: 746,
  },

  winPlaqueValue: {
    type: 'text',
    style: 'winPlaqueValue',
    y: 40,
    anchor: 0.5,
    maxWidth: 746,
  },

  winPlaqueCloseButton: {
    type: 'button',
    alpha: 0,
    landscape: {
      textures: {
        enabled: 'landscape_endOfGameMessageWinBackground',
        over: 'landscape_endOfGameMessageWinBackground',
        pressed: 'landscape_endOfGameMessageWinBackground',
      },
    },
    portrait: {
      textures: {
        enabled: 'portrait_endOfGameMessageWinBackground',
        over: 'portrait_endOfGameMessageWinBackground',
        pressed: 'portrait_endOfGameMessageWinBackground',
      },
    },
  },

  losePlaqueMessage: {
    type: 'text',
    string: 'message_nonWin',
    style: 'losePlaqueBody',
    anchor: 0.5,
    portrait: {
      maxWidth: 746
    },
    landscape: {
      maxWidth: 746
    },
  },

  losePlaqueCloseButton: {
    type: 'button',
    alpha: 0,
    landscape: {
      textures: {
        enabled: 'landscape_endOfGameMessageNoWinBackground',
        over: 'landscape_endOfGameMessageNoWinBackground',
        pressed: 'landscape_endOfGameMessageNoWinBackground',
      },
    },
    portrait: {
      textures: {
        enabled: 'portrait_endOfGameMessageNoWinBackground',
        over: 'portrait_endOfGameMessageNoWinBackground',
        pressed: 'portrait_endOfGameMessageNoWinBackground',
      },
    },
  },

  buyButton: {
    type: 'button',
    string: 'button_buy',
    textures: {
      enabled: 'buyButtonEnabled',
      over: 'buyButtonOver',
      pressed: 'buyButtonPressed',
      disabled: 'buyButtonDisabled',
    },
    style: {
      enabled: 'buyButtonEnabled',
      over: 'buyButtonOver',
      pressed: 'buyButtonPressed',
      disabled: 'buyButtonDisabled',
    },
  },
  tryButton: {
    type: 'button',
    string: 'button_try',
    textures: {
      enabled: 'buyButtonEnabled',
      over: 'buyButtonOver',
      pressed: 'buyButtonPressed',
      disabled: 'buyButtonDisabled',
    },
    style: {
      enabled: 'buyButtonEnabled',
      over: 'buyButtonOver',
      pressed: 'buyButtonPressed',
      disabled: 'buyButtonDisabled',
    },
  },

  ticketSelectBarSmall: {
    type: 'container',
    landscape: {
      x: 578,
      y: 712
    },
    portrait: {
      x: 405,
      y: 1205
    },
    children: [
      'ticketSelectBarBG',
      'ticketSelectCostValue',
      'ticketCostDownButtonStatic',
      'ticketCostUpButtonStatic',
      'ticketCostDownButton',
      'ticketCostUpButton',
      'ticketCostIndicators',
    ],
  },
  ticketSelectCostValue: {
    type: 'text',
    portrait: {
      y: -7
    },
    landscape: {
      y: -7
    },
    anchor: 0.5,
    maxWidth: 185,
    style: 'ticketSelectCostValue',
  },
  ticketCostDownButton: {
    type: 'button',
    portrait: {
      x: -208
    },
    landscape: {
      x: -143
    },
    textures: {
      enabled: 'minusButtonEnabled',
      disabled: 'minusButtonDisabled',
      over: 'minusButtonOver',
      pressed: 'minusButtonPressed',
    },
  },
  ticketCostUpButton: {
    type: 'button',
    portrait: {
      x: 208
    },
    landscape: {
      x: 143
    },
    textures: {
      enabled: 'plusButtonEnabled',
      disabled: 'plusButtonDisabled',
      over: 'plusButtonOver',
      pressed: 'plusButtonPressed',
    },
  },
  ticketCostDownButtonStatic: {
    type: 'sprite',
    anchor: 0.5,
    portrait: {
      x: -208
    },
    landscape: {
      x: -143
    },
    texture: 'minusButtonDisabled'
  },
  ticketCostUpButtonStatic: {
    type: 'sprite',
    anchor: 0.5,
    portrait: {
      x: 208
    },
    landscape: {
      x: 143
    },
    texture: 'plusButtonDisabled'
  },
});