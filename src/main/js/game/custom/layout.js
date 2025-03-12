define({
  // Optional display list in which to override elements from the template display list
  /*
   * BONUS LOGO --> it has to be moved slightly to the left on the bonus screen. :)
   */
  bonusLogo: {
    type: 'sprite',
    anchor: 0.5,
    landscape: {
      x: 300,
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
  winPlaqueMessage: {
    type: 'text',
    string: 'message_win',
    style: 'winPlaqueBody',
    y: -50,
    anchor: 0.5,
    maxWidth: 350,
  },
  winPlaqueValue: {
    type: 'text',
    style: 'winPlaqueValue',
    y: 55,
    anchor: 0.5,
    maxWidth: 400,
  },
  losePlaqueMessage: {
    type: 'text',
    string: 'message_nonWin',
    style: 'losePlaqueBody',
    anchor: 0.5,
    portrait: {
      maxWidth: 450
    },
    landscape: {
      maxWidth: 450
    },
  },

  winUpToInText: {
    type: 'text',
    style: 'winUpToText',
    string: 'winUpToText',
    anchor: 0.5,
    y: 10,
    maxWidth: 350,
  },
  winUpToOutText: {
    type: 'text',
    style: 'winUpToText',
    string: 'winUpToText',
    anchor: 0.5,
    y: 10,
    maxWidth: 350,
  },
  winUpToInValue: {
    type: 'text',
    style: 'winUpToValue',
    anchor: 0.5,
    maxWidth: 350,
  },
  winUpToOutValue: {
    type: 'text',
    style: 'winUpToValue',
    anchor: 0.5,
    maxWidth: 350,
  },

  winAllMessage: {
    type: 'text',
    string: 'winAll',
    style: 'winAllBody',
    y: -68,
    anchor: 0.5,
    maxWidth: 350
  },
  winAllValue: {
    type: 'text',
    style: 'winAllValue',
    y: 40,
    anchor: 0.5,
    maxWidth: 400
  },

  bonusLivesLabel: {
    type: 'text',
    style: 'bonusFind3ToEnd',
    string: 'bonusLives',
    anchor: 0.5,
    landscape: {
      x: 138,
      y: 14,
      maxWidth: 450,
    },
    portrait: {
      x: 112,
      y: 0,
      maxWidth: 320,
    },
  },
});