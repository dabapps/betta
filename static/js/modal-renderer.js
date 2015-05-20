'use strict';

window.define(['react', 'modal-store', 'modal-dialog', 'jquery'], function (React, ModalStore, ModalDialog, $) {

  var ModalRenderer = React.createClass({
    setTimeout: function (fn, time) {
      var timeout = setTimeout(fn, time);

      var timeouts = this.state.timeouts;
      timeouts.push(timeout);

      this.setState({
        timeouts: timeouts
      });
    },

    clearTimeouts: function () {
      var timeouts = this.state.timeouts;

      $.each(timeouts, function (timeout) {
        clearTimeout(timeout);
      });

      this.setState({
        timeouts: []
      });
    },

    modalChanged: function () {
      var self = this;
      var closing = false;
      var previousState = this.state.open;
      var newState = ModalStore.isOpen();

      if (previousState === true && newState === false) {
        closing = true;

        this.setTimeout(function () {
          self.setState({
            closing: false
          });
        }, 500);
      }

      this.setState({
        open: newState,
        closing: closing,
        view: ModalStore.getView()
      });
    },

    componentWillUnmount: function () {
      ModalStore.unbind('open', this.modalChanged);
      ModalStore.unbind('close', this.modalChanged);
      this.clearTimeouts();
    },

    componentWillMount: function () {
      ModalStore.bind('open', this.modalChanged);
      ModalStore.bind('close', this.modalChanged);
    },

    getInitialState: function () {
      return {
        timeouts: [],
        closing: false,
        open: ModalStore.isOpen(),
        view: ModalStore.getView()
      };
    },

    render: function () {
      if (this.state.open || this.state.closing) {
        return React.createElement(
          ModalDialog,
          {
            view: this.state.view,
            closing: this.state.closing
          }
        );
      }
      return false;
    }
  });

  return ModalRenderer;

});
