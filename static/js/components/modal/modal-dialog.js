'use strict';

var React = require('react');
var ModalStore = require('../../stores/modal-store');
var _ = require('underscore');

var ModalDialog = React.createClass({
  getInitialState: function () {
    return {
      timeouts: [],
      fadeClass: ''
    };
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

  onClickClose: function () {
    ModalStore.action('close');
  },

  onClickStopPropagation: function (event) {
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

  render: function () {
    var fadeClass = !this.props.closing && this.state.fadeClass ? this.state.fadeClass : '';

    return (
      <div className={'modal fade ' + fadeClass} style={{display: 'block'}}>
        <div className="modal-overlay" onClick={this.onClickClose}>
          <div className="modal-dialog" onClick={this.onClickStopPropagation}>
            <div className="modal-content">
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
