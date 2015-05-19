'use strict';

window.define(['react', 'modal-template', 'modal-store'], function (React, ModalTemplate, ModalStore) {

  var ExportModal = React.createClass({
    close: function () {
      ModalStore.action('close');
    },

    render: function () {
      return React.createElement(
        ModalTemplate,
        {
          title: 'Export',
          body: React.createElement(
            'a',
            {
              onClick: this.export
            },
            'Export variables'
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
