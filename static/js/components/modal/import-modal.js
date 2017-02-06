'use strict';

var React = require('react');
var ModalTemplate = require('./modal-template');
var ModalStore = require('../../stores/modal-store');
var VariableStore = require('../../stores/variable-store');
var Checkbox = require('../checkbox');
var ImportSettingsStore = require('../../stores/import-settings-store');

var instructions = 'Please select an existing variables.less file, ' +
  'or paste its contents into the text area.';

var ImportModal = React.createClass({
  importVariables: function () {
    var settings = this.state.settings.map(function (setting) {
      return setting.value;
    });
    settings.unshift('importVariables', this.state.packedVariables);
    VariableStore.action.apply(null, settings);
    VariableStore.action('requestPreview');

    ModalStore.action('close');
  },

  fileChanged: function (event) {
    var self = this;
    var file = event.target.files[0];

    if (file.name.match(/\.less$/)) {
      var reader = new FileReader();

      reader.onload = function () {
        self.setState({
          uploadError: undefined,
          uploadSuccess: 'File successfully loaded',
          packedVariables: this.result
        });
      };
      reader.readAsText(file);
    } else {
      this.setState({
        uploadSuccess: undefined,
        uploadError: 'Please select a .less file'
      });
    }
  },

  updateVariables: function (event) {
    this.setState({
      packedVariables: event.target.value
    });
  },

  updateSetting: function (settingsIndex, event) {
    var value = event.target.parentNode.getElementsByTagName('input')[0].checked;
    ImportSettingsStore.action('updateSetting', settingsIndex, value);
  },

  getSettings: function () {
    var settings = ImportSettingsStore.getSettings();

    this.setState({
      settings: settings
    });
  },

  close: function () {
    ModalStore.action('close');
  },

  componentWillUnmount: function () {
    ImportSettingsStore.unbind('updateSetting', this.getSettings);
  },

  componentWillMount: function () {
    ImportSettingsStore.bind('updateSetting', this.getSettings);
  },

  getInitialState: function () {
    var settings = ImportSettingsStore.getSettings();

    return {
      settings: settings,
      packedVariables: ''
    };
  },

  render: function () {
    var self = this;
    var uploadError, uploadSuccess, filePicker;

    var settings = this.state.settings.map(function (setting, settingsIndex) {
      if (settingsIndex === 1 && self.state.settings[0] && self.state.settings[0].value) {
        return undefined;
      }

      return (
        <Checkbox
          key={setting.name}
          checked={setting.value}
          label={setting.name}
          onClick={self.updateSetting.bind(self, settingsIndex)} />
      );
    });

    if (this.state.uploadError) {
      uploadError = (
        <div className='alert alert-danger'>
          {this.state.uploadError}
        </div>
      );
    }

    if (this.state.uploadSuccess) {
      uploadSuccess = (
        <div className='alert alert-success'>
          {this.state.uploadSuccess}
        </div>
      );
    }

    if (window.FileReader) {
      filePicker = (
        <div className='form-group'>
          <input
            type='file'
            accept='.less'
            onChange={this.fileChanged} />
        </div>
      );
    }

    return (
      <ModalTemplate
        title='Import'
        body={
          <div>
            <div className='row'>
              <div className='col-xs-12'>
                <p>{instructions}</p>
                  {uploadError}
                  {uploadSuccess}
                  {filePicker}
                  {settings}
              </div>
            </div>
            <pre className='file-name'>variables.less</pre>
            <textarea
              className='variable-textarea'
              value={this.state.packedVariables}
              onChange={this.updateVariables} />
          </div>
        }
        footer={
          <div className='pull-right'>
            <button
              className='btn btn-default'
              onClick={this.close}>
                Close
            </button>
            <button
              className='btn btn-primary'
              onClick={this.importVariables}
              disabled={!this.state.packedVariables}>
                Import
            </button>
          </div>
        } />
    );
  }
});

module.exports = ImportModal;
