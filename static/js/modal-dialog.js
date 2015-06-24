'use strict';

var React = require('react');
var ModalStore = require('./modal-store');
var _ = require('underscore');

var ModalDialog = React.createClass({
  close: function () {
    ModalStore.action('close');
  },

  stopPropagation: function (event) {
    event.stopPropagation();
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

    return (
      <div className={'modal fade ' + fadeClass} style={{display: 'block'}}>
        <div className='modal-overlay' onClick={this.close}>
          <div className='modal-dialog' onClick={this.stopPropagation}>
            <div className='modal-content'>
              {React.createElement(
                this.props.view,
                this.props.props
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalDialog;
