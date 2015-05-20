'use strict';

window.define(['react', 'modal-template', 'modal-store', 'variable-store'], function (React, ModalTemplate, ModalStore, VariableStore) {

  var ExportModal = React.createClass({
    close: function () {
      ModalStore.action('close');
    },

    componentWillMount: function () {
      this.setState({
        packedVariables: VariableStore.getPackedVariables()
      });
    },

    getInitialState: function () {
      return {};
    },

    render: function () {
      return React.createElement(
        ModalTemplate,
        {
          title: 'Export',
          body: React.createElement(
            'div',
            null,
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
                className: 'variable-textarea'
              },
              this.state.packedVariables
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
