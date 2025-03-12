/*
define(require => {
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');

  return data => ({
    cells: {
      prizeLevel: data.division,
      description: data.division < 12 ? resources.i18n.Paytable.descriptionText1 : resources.i18n.Paytable.descriptionText2,
      prizeValue: SKBeInstant.formatCurrency(data.prize).formattedAmount,
    },
  });
});
*/

define(require => {
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');

  function formatPrizeValue(data) {
    var prize = SKBeInstant.formatCurrency(data.prize).formattedAmount;
    return prize.replace(" ", "\u00A0");
  }

  return data => ({
    cells: {
      prizeLevel: data.division,
      description: data.division < 12 ? resources.i18n.Paytable.descriptionText1 : resources.i18n.Paytable.descriptionText2,
      prizeValue: formatPrizeValue(data),
    },
  });
});