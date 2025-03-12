define({
  /* 
   * Game configuration options
   * Anything defined here could be overwritten either based on the channel in
   * assetPacks/CHANNEL/layout/gameConfig.js or at an operator level by gameConfig.json in i18n
   */

  // The scale and bounciness of the number match tween
  matchAnimAmplitude: 4,
  matchAnimPeriod: 0.5,
  // Should the HowToPlay screen show when the game loads
  showHowToPlayOnLoad: false,
  // Use AutoPlay with toggle start/stop rather than single use RevealAll
  toggleAutoPlay: false,
  // Time between each number being revealed in autoplay. 0 for instant reaveal.
  autoPlayWinningNumberInterval: 0.05,
  autoPlayPlayerNumberInterval: 0.05,
  autoPlayPlayerRowInterval: 0.35,
  autoPlayBonusItemInterval: 0.75,
  // Time between the revealing the winning numbers section and the player numbers section
  autoPlayPlayerNumberDelay: 0.5,
  // Time over which the music will fade out on entering the result screen
  resultMusicFadeOutDuration: 0,
  // Time between entering the result screen and the terminator audio starting
  resultTerminatorFadeInDelay: 0,
  // Time over which the terminator audio will fade in
  resultTerminatorFadeInDuration: 0,
  // Should the Result screen show when ticket is complete
  showResultScreen: true,
  // Suppress non-winning result plaque - assuming show by default to maintain backwards compatibility
  suppressNonWinResultPlaque: true,
  // Result particle mode - 0 = off, 1 = when result screen shown, 2 = start of rollup, 3 = end of rollup
  resultParticleMode: 1,
  // Bypass the play again button
  bypassPlayAgain: true,
  // Ticket cost meter visible while playing (formerly UI3 Mode)
  ticketCostMeterVisibleWhilePlaying: true,
  // Fast fade buttons
  fastFadeButtons: true,
  fastFadeDuration: 0.20,
  // Delay before Win All plaque appears
  delayBeforeWinAllPlaqueDisplay: 0.5,
  // Win All plaque fade in duration
  winAllFadeInDuration: 0.5,
  // Win All roll up mode - 0 = off, 1 = only if bonus triggered, 2 = only if bonus not triggered, 3 = at all times
  winAllRollUpMode: 1,
  // Win All roll up durations
  winAllRollupLowerDurationInSeconds: 0.5,
  winAllRollupHigherDurationInSeconds: 0.5,
  // Threshold between lower and higher rollup duration - in pennies
  winAllLowerHigherThreshold: 50000,
  winAllHighlightInterval: 0.1,
  // Reveal All processing interval
  revealAllProcessInterval: 0.3,
  // Delay before plaque is able to be dismissed
  secondsDelayDismissResult: 2,
  // Delay in base game before transition to bonus
  delayBeforeTransitionToBonus: 1.5,
  // Tween duration into bonus
  transitionToBonusDuration: 0.5,
  // Tween duration from bonus to base game
  transitionToBaseGameDuration: 0.5,
  // Delay before transitioning back to base game (win)
  bonusHoldOnCompleteWin: 1,
  // Delay before transitioning back to base game (nonwin)
  bonusHoldOnCompleteNonWin: 1,
  // Duration of tween to desaturate unselected bonus items
  unrevealedBonusTweenToGreyDuration: 0.5,
  // Delay between revealing bonus symbols per player number
  delayBetweenBonusSymbolsInSeconds: 0.25,
  // Tween bonus item to bonus area
  gravitateBonusItem: true,
  gravitateBonusItemDuration: 0.5,
  // Tween particles from bonus symbol to prize table mode - 0 = never, 1 = only in manual play, 2 = only in auto play, 3 = at all times
  bonusWinningSymbolParticleMode: 3,
  // Delay before revealing bonus symbol in a Player Number, parameterised to allow for variable reveal anim length
  showBonusDelay: 0.25,
  // Pulse bonus item when collected in bonus area
  pulseBonusItemOnCollect: true,
  pulseBonusItemDuration: 0.25,
  // Check if we should use the winning textures at all times
  luckyNumbersAsWinningState: true,
  // Delay before starting idle animations after ticket purchase
  delayBeforeStartIdleInSeconds: 0.5,
  // Delay before restarting idle animations after interaction
  delayBeforeResumeIdleInSeconds: 0.65,
  // Total Win rollup
  rollUpTotalWin: true,
  totalWinRollupInSeconds: 0.5,
  pulseTotalWinAfterRollup: false,
  pulseTotalWinDuration: 0.25,  
  // Duration of bonus game particle fly Tween
  bonusGameParticleFlyDuration: 1,
  // Bonus label pulse duration
  bonusLabelPulseDuration: 0.5,
  // Big win thresholds, we can specify upper and lower limits
  bigWinThresholds: {
    level1: {
      upper: {multiplier: 5, inclusive: false},
    },
    level2: {
      lower: {multiplier: 5, inclusive: true},
      upper: {multiplier: 20, inclusive: true},
    },
    level3: {
      lower: {multiplier: 20, inclusive: false},
    }
  },
  // Result coin/particle shower config, defaults used if parameters missing
  resultParticleConfig: {
    level1: {
      enabled: false,
      landscape: {speed: {start: 1100, end: 1500, minimumSpeedMultiplier: 1}, frequency: 0.12, scale: {start: 0.74, end: 0.78, minimumScaleMultiplier: 0.74}, emitterLifetime: 2},
      portrait: {speed: {start: 1100, end: 1500, minimumSpeedMultiplier: 1}, frequency: 0.12, scale: {start: 0.74, end: 0.78, minimumScaleMultiplier: 0.74}, emitterLifetime: 2}
    },
    level2: {
      enabled: true,
      landscape: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 1500}, speed: {start: 1600, end: 2100, minimumSpeedMultiplier: 0.8}, frequency: 0.005, scale: {start: 0.74, end: 1.25, minimumScaleMultiplier: 0.74}, emitterLifetime: 0.35},
      portrait: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 1500}, speed: {start: 1600, end: 2100, minimumSpeedMultiplier: 0.8}, frequency: 0.005, scale: {start: 0.74, end: 1.25, minimumScaleMultiplier: 0.74}, emitterLifetime: 0.35}
    },
    level3: {
      enabled: true,
      landscape: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 1500}, speed: {start: 1600, end: 2100, minimumSpeedMultiplier: 0.8}, frequency: 0.0025, scale: {start: 0.74, end: 1.25, minimumScaleMultiplier: 0.74}, emitterLifetime: 0.35},
      portrait: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 1500}, speed: {start: 1600, end: 2100, minimumSpeedMultiplier: 0.8}, frequency: 0.0025, scale: {start: 0.74, end: 1.25, minimumScaleMultiplier: 0.74}, emitterLifetime: 0.35}
    }
  },
  // Big win particle config, defaults used if parameters missing
  bigWinSettings: {
    landscape:{},
    portrait:{}
  },
  // Background particle config
  backgroundParticleConfig: {
    base: {
      "alpha": {
        "start": 1,
        "end": 0
      },
      "scale": {
        "start": 1,
        "end": 1,
        "minimumScaleMultiplier": 1
      },
      "color": {
        "start": "#e4f9ff",
        "end": "#3fcbff"
      },
      "speed": {
        "start": 1,
        "end": 1,
        "minimumSpeedMultiplier": 1
      },
      "acceleration": {
        "x": 0,
        "y": 0
      },
      "maxSpeed": 10,
      "startRotation": {
        "min": 270,
        "max": 270
      },
      "noRotation": false,
      "rotationSpeed": {
        "min": 20,
        "max": 120
      },
      "lifetime": {
        "min": 1,
        "max": 2
      },
      "blendMode": "add",
      "frequency": 0.5,
      "emitterLifetime": -1,
      "maxParticles": 998,
      "pos": {
        "x": 0,
        "y": 0
      },
      "addAtBack": false,
      "spawnType": "rect",
      "spawnRect": {
        "x": -1000,
        "y": -1200,
        "w": 2000,
        "h": 1500
      }
    },
    bonus: {
      "alpha": {
        "start": 1,
        "end": 0
      },
      "scale": {
        "start": 1,
        "end": 1,
        "minimumScaleMultiplier": 1
      },
      "color": {
        "start": "#e4f9ff",
        "end": "#3fcbff"
      },
      "speed": {
        "start": 1,
        "end": 1,
        "minimumSpeedMultiplier": 1
      },
      "acceleration": {
        "x": 0,
        "y": 0
      },
      "maxSpeed": 10,
      "startRotation": {
        "min": 270,
        "max": 270
      },
      "noRotation": false,
      "rotationSpeed": {
        "min": 20,
        "max": 120
      },
      "lifetime": {
        "min": 1,
        "max": 2
      },
      "blendMode": "add",
      "frequency": 0.5,
      "emitterLifetime": -1,
      "maxParticles": 998,
      "pos": {
        "x": 0,
        "y": 0
      },
      "addAtBack": false,
      "spawnType": "rect",
      "spawnRect": {
        "x": -1000,
        "y": -1200,
        "w": 2000,
        "h": 1500
      }
    }
  },
  // Toggle background music on/off
  backgroundMusicEnabled: true,
  autoPlayAudioInterval: 0.35,
  // Scale Big Win with result plaque (if Big Win sits directly behind plaque)
  scaleBigWinWithPlaque: false,
  // Override maximum button width (for example if we have a bevel on the texture)
  overrideMaxButtonWidth: false,
  overrideButtonWidthValue: 225
});
