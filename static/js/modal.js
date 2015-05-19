'use strict';

window.define(['react', 'modal-store'], function (React, ModalStore) {

  var Modal = React.createClass({
    modalChanged: function () {
      this.setState({
        open: ModalStore.isOpen(),
        title: ModalStore.getTitle(),
        body: ModalStore.getBody(),
        footer: ModalStore.getFooter()
      });
    },

    close: function () {
      ModalStore.action('close');
    },

    componentDidMount: function () {
      this.setState({
        fadeClass: 'in',
        display: 'block'
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
        title: ModalStore.getTitle(),
        body: ModalStore.getBody(),
        footer: ModalStore.getFooter()
      };
    },

    render: function () {
      if (this.state.open) {
        return React.createElement(
          'div',
          {
            className: 'modal fade ' + (this.state.fadeClass ? this.state.fadeClass : ''),
            style: {
              display: this.state.display
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
              React.createElement(
                'div',
                {
                  className: 'modal-header'
                },
                React.createElement(
                  'h4',
                  null,
                  this.state.title
                )
              ),
              React.createElement(
                'div',
                {
                  className: 'modal-body'
                },
                this.state.body
              ),
              React.createElement(
                'div',
                {
                  className: 'modal-footer'
                },
                this.state.footer
              )
            )
          )
        );
      }
      return false;
    }
  });

  return Modal;

});
