'use strict';

window.define(
  [
  'react',
  'modal-template',
  'modal-store',
  'variable-store',
  'checkbox',
  'import-settings-store'
  ],
  function (
  React,
  ModalTemplate,
  ModalStore,
  VariableStore,
  Checkbox,
  ImportSettingsStore
  ) {

  var instructions = 'Please select an existing variables.less file, ' +
    'or paste it\'s contents into the text area.';

  var ImportModal = React.createClass({
    importVariables: function () {
      var settings = this.state.settings.map(function (setting) {
        return setting.value;
      });
      settings.unshift('importVariables', this.state.packedVariables);
      VariableStore.action.apply(null, settings);

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
      var uploadError, uploadSuccess;

      var settings = this.state.settings.map(function (setting, settingsIndex) {
        if (settingsIndex === 1 && self.state.settings[0] && self.state.settings[0].value) {
          return undefined;
        }

        return React.createElement(
          Checkbox,
          {
            key: setting.name,
            checked: setting.value,
            label: setting.name,
            onClick: self.updateSetting.bind(self, settingsIndex)
          }
        );
      });

      if (this.state.uploadError) {
        uploadError = React.createElement(
          'div',
          {
            className: 'alert alert-danger'
          },
          this.state.uploadError
        );
      }

      if (this.state.uploadSuccess) {
        uploadSuccess = React.createElement(
          'div',
          {
            className: 'alert alert-success'
          },
          this.state.uploadSuccess
        );
      }

      return React.createElement(
        ModalTemplate,
        {
          title: 'Import',
          body: React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              {
                className: 'row'
              },
              React.createElement(
                'div',
                {
                  className: 'col-xs-12'
                },
                React.createElement(
                  'p',
                  null,
                  instructions
                ),
                uploadError,
                uploadSuccess,
                React.createElement(
                  'div',
                  {
                    className: 'form-group'
                  },
                  React.createElement(
                    'input',
                    {
                      type: 'file',
                      onChange: this.fileChanged
                    }
                  )
                ),
                settings
              )
            ),
            React.createElement(
              'pre',
              {
                className: 'file-name'
              },
              'variables.less'
            ),
            React.createElement(
              'textarea',
              {
                className: 'variable-textarea',
                value: this.state.packedVariables,
                onChange: this.updateVariables
              }
            )
          ),
          footer: React.createElement(
            'div',
            {
              className: 'pull-right'
            },
            React.createElement(
              'button',
              {
                className: 'btn btn-default',
                onClick: this.close
              },
              'Close'
            ),
            React.createElement(
              'button',
              {
                className: 'btn btn-primary',
                onClick: this.importVariables,
                disabled: !this.state.packedVariables
              },
              'Import'
            )
          )
        }
      );
    }
  });

  return ImportModal;

});
