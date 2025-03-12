define({
    // IMPLEMENT: Map SFX to channels

    /* 
     * If audio assets are named nicely you can do:
     * {
     *  fileName: channelNumber
     * }
     * 
     * Otherwise use a nice name for the keys and include the filename and channel as an array:
     * {
     *  soundName: ['Ugly_sound_file_V2-final', channelNumber]
     * }
     */

    music: ['BackgroundMusicLoop', 0],
    winTerminator: ['BackgroundMusicTerm_WIN', 1],
    loseTerminator: ['BackgroundMusicTerm_LOSE', 1],
    click: ['UI_Click', 4],
    costDown: ['BetDown', 1],
    costUp: ['BetUp', 2],
    buy: ['BuyButton', 2],
    bonusNoWin: ['BonusNoWin', 2],
    costMax: ['BetMax', 3],

    /*
     * Audio groups
     * A game can include multiple variations of each of these sounds. Ensure each variation starts
     * with the same name plus some kind of ordered suffix. Each time a sound group plays the next 
     * item in the group will be used.
     */

    match: ['NumberMatch', 1],

    winningNumber: ['LuckyNumberSelect_1', 3],
    winningNumber_2: ['LuckyNumberSelect_2', 5],
    winningNumber_3: ['LuckyNumberSelect_3', 6],
    winningNumber_4: ['LuckyNumberSelect_4', 7],

    playerNumber: ['NumberSelect_1', 3],
    playerNumber_2: ['NumberSelect_2', 4],
    playerNumber_3: ['NumberSelect_3', 5],
    playerNumber_4: ['NumberSelect_4', 6],
    playerNumber_5: ['NumberSelect_5', 7],

    WinScale_1: ['WinScale_1', 1],
    WinScale_2: ['WinScale_2', 2],
    WinScale_3: ['WinScale_3', 3],
    WinScale_4: ['WinScale_4', 4],
    WinScale_5: ['WinScale_5', 5],
    WinScale_6: ['WinScale_6', 6],

    multiplier: ['MultiplierMatch', 8],

    BonusGameActivated: ['BonusActivated', 9],
    BonusMiss: ['CashoutToken', 9],
    BonusWin: ['InstantWin', 9],

    Reveal: ['Reveal', 10],

    winAllEnd: ['WinAll_CountEnd', 11],
    winAllFound: ['WinAll_Revealed', 11],

    winAllLoop: ['WinAll_CountUp', 12],

    /*
     * Optional audio
     * The following audio is optional and will be ignored if not included
     */

    //  buy: ['BuyButton', 4],
    //  revealAll: ['RevealAllButton', 4],
});
