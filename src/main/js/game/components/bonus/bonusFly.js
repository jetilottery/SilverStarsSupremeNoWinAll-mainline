define(require => {
  const PIXI = require('com/pixijs/pixi');
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const BonusSymbol = require('game/components/bonus/BonusSymbol');
  const particleConfig = require('game/components/effects/particleConfig');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

  require('com/gsap/TweenMax');
  const Tween = window.TweenMax;

  let symbols = [];
  let flyingContainers = [];
  let flyingEmitters = [];

  function init() {
    // Right, we have the container
    // We have to add five bonus icons to it
    symbols = [
      BonusSymbol.fromContainer(displayList.bonusSymbolFly),
      BonusSymbol.fromContainer(displayList.bonusSymbolFly),
      BonusSymbol.fromContainer(displayList.bonusSymbolFly),
      BonusSymbol.fromContainer(displayList.bonusSymbolFly),
      BonusSymbol.fromContainer(displayList.bonusSymbolFly)
    ];

    let i = 0;

    // We can safely keep these in a matched state
    for (i = 0; i < symbols.length; i++){
      symbols[i].setState('MATCH');
      symbols[i].visible = false;

      // Set up some particle emitters
      flyingContainers[i] = new PIXI.particles.ParticleContainer(particleConfig.flyingBonus.maxParticles, {vertices: true,position: true,tint: true,});
      flyingEmitters[i] = new PIXI.particles.Emitter(flyingContainers[i], PIXI.Texture.fromFrame('bonusSymbolFly'), particleConfig.flyingBonus);
      flyingEmitters[i].autoUpdate = true;
      flyingEmitters[i].emit = false;
      //add containers
      displayList.bonusSymbolFly.addChildAt(flyingContainers[i], 0);
    }
  }
  
  function gravitateBonusSymbol(data){
    let sym = symbols[data.numFound-1];

    // Find which bonus symbol we need to move
    const symToMove = (data.isDouble) ? data.bonus2 : data.bonus1;

    // Set up an emitter
    const emitter = flyingEmitters[data.numFound-1];

    let startPoint = new PIXI.Point(0,0);
    startPoint = symToMove.toGlobal(startPoint);
    let startX = startPoint.x;
    let startY = startPoint.y;

    let endPoint = new PIXI.Point(0,0);
    endPoint = displayList['bonusSymbol'+data.numFound].toGlobal(endPoint);
    let endX = endPoint.x;
    let endY = endPoint.y;
    
    Tween.fromTo(sym, gameConfig.gravitateBonusItemDuration, {x:startX, y:startY}, {ease: window.Power4.easeIn, x:endX, y:endY, onStart:function(){
      sym.visible = true;
      emitter.emit = true;
    },onUpdate:function(){
      emitter.spawnPos.x = sym.x;
      emitter.spawnPos.y = sym.y;
    },onComplete:function(){
      msgBus.publish('Game.GravitateComplete');
      sym.visible = false;
      emitter.emit = false;
    }});
  }

  msgBus.subscribe('Game.GravitateBonusSymbol', gravitateBonusSymbol);

  return {
    init
  };
});
