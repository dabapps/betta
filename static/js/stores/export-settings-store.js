'use strict';

var Store = require('../stores/store');

var settings = [
  {
    name: 'Include headers',
    value: true
  },
  {
    name: 'Include labels',
    value: true
  },
  {
    name: 'Exclude unedited',
    value: false
  },
  {
    name: 'Comment out unedited',
    value: true
  }
];

var ExportSettingsStore = new Store();

ExportSettingsStore.createAction('updateSetting', function (settingIndex, value) {
  settings[settingIndex].value = value;

  ExportSettingsStore.emitEvent('updateSetting');
});

ExportSettingsStore.getSettings = function () {
  return settings;
};

module.exports = ExportSettingsStore;
