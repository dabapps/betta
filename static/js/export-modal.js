'use strict';

window.define(['react', 'modal-template', 'modal-store', 'variable-store', 'checkbox', 'export-settings-store'], function (React, ModalTemplate, ModalStore, VariableStore, Checkbox, ExportSettingsStore) {

  var ExportModal = React.createClass({
    updateSetting: function (settingsIndex, event) {
      var value = event.target.parentNode.getElementsByTagName('input')[0].checked;
      ExportSettingsStore.action('updateSetting', settingsIndex, value);
    },

    getSettings: function () {
      var settings = ExportSettingsStore.getSettings();

      this.setState({
        settings: settings,
        packedVariables: this.getPackedVariables(settings)
      });
    },

    close: function () {
      ModalStore.action('close');
    },

    getPackedVariables: function (settings) {
      return VariableStore.getPackedVariables.apply(
        null,
        settings.map(function (setting) {
          return setting.value;
        })
      );
    },

    componentWillUnmount: function() {
      ExportSettingsStore.unbind('updateSetting', this.getSettings);
    },

    componentWillMount: function () {
      ExportSettingsStore.bind('updateSetting', this.getSettings);
    },

    getInitialState: function () {
      var settings = ExportSettingsStore.getSettings();

      return {
        settings: settings,
        packedVariables: this.getPackedVariables(settings)
      };
    },

    render: function () {
      var self = this;

      var settings = this.state.settings.map(function (setting, settingsIndex) {
        if (settingsIndex === 3 && self.state.settings[2] && self.state.settings[2].value) {
          return undefined;
        }

        return React.createElement(
          Checkbox,
          {
            checked: setting.value,
            label: setting.name,
            onClick: self.updateSetting.bind(self, settingsIndex)
          }
        );
      });

      return React.createElement(
        ModalTemplate,
        {
          title: 'Export',
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
                value: this.state.packedVariables
              }
            )
          ),
          footer: React.createElement(
            'button',
            {
              className: 'btn btn-primary pull-right',
              onClick: this.close
            },
            'Close'
          )
        }
      );
    }
  });

  return ExportModal;

});
