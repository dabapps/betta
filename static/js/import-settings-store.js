'use strict';

window.define(['store'], function (Store) {

  var settings = [
    {
      name: 'Clear existing variables',
      value: true
    },
    {
      name: 'Override existing variables',
      value: true
    },
    {
      name: 'Import commented variables',
      value: false
    }
  ];

  var ImportSettingsStore = new Store();

  ImportSettingsStore.createAction('updateSetting', function (settingIndex, value) {
    settings[settingIndex].value = value;

    ImportSettingsStore.emitEvent('updateSetting');
  });

  ImportSettingsStore.getSettings = function () {
    return settings;
  };

  return ImportSettingsStore;

});
