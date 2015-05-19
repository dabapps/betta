'use strict';

window.define(['react', 'modal-store'], function (React, ModalStore) {

  var Modal = React.createClass({
    modalChanged: function () {
      this.setState({
        open: ModalStore.isOpen(),
        view: ModalStore.getView()
      });
    },

    close: function () {
      ModalStore.action('close');
    },

    componentDidMount: function () {
      this.setState({
        fadeClass: 'in'
      });
    },

    componentWillUnmount: function () {
      ModalStore.unbind('open', this.modalChanged);
      ModalStore.unbind('close', this.modalChanged);
    },

    componentWillMount: function () {
      ModalStore.bind('open', this.modalChanged);
      ModalStore.bind('close', this.modalChanged);
    },

    getInitialState: function () {
      return {
        open: ModalStore.isOpen(),
        view: ModalStore.getView()
      };
    },

    render: function () {
      if (this.state.open) {
        return React.createElement(
          'div',
          {
            className: 'modal fade ' + (this.state.fadeClass ? this.state.fadeClass : ''),
            style: {
              display: 'block'
            }
          },
          React.createElement(
            'div',
            {
              className: 'modal-overlay',
              onClick: this.close
            }
          ),
          React.createElement(
            'div',
            {
              className: 'modal-dialog'
            },
            React.createElement(
              'div',
              {
                className: 'modal-content'
              },
              this.state.view
            )
          )
        );
      }
      return false;
    }
  });

  return Modal;

});
