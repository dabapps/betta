'use strict';

window.define(['react', 'modal-store', 'underscore'], function (React, ModalStore, _) {

  var Modal = React.createClass({
    close: function () {
      ModalStore.action('close');
    },

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

      _.each(timeouts, function (timeout) {
        clearTimeout(timeout);
      });

      this.setState({
        timeouts: []
      });
    },

    componentDidMount: function () {
      var self = this;

      this.setTimeout(function () {
        self.setState({
          fadeClass: 'in'
        });
      }, 10);
    },

    componentWillUnmount: function () {
      this.setState({
        fadeClass: ''
      });

      this.clearTimeouts();
    },

    getInitialState: function () {
      return {
        timeouts: [],
        fadeClass: ''
      };
    },

    render: function () {
      var fadeClass = !this.props.closing && this.state.fadeClass ? this.state.fadeClass : '';

      return React.createElement(
        'div',
        {
          className: 'modal fade ' + fadeClass,
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
            this.props.view
          )
        )
      );
    }
  });

  return Modal;

});
