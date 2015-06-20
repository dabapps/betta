'use strict';

var React = require('react');

var ModalTemplate = React.createClass({
  render: function () {
    var title, body, footer;

    if (typeof this.props.title !== 'undefined') {
      title = React.createElement(
        'div',
        {
          className: 'modal-header'
        },
        React.createElement(
          'h4',
          null,
          this.props.title
        )
      );
    }

    if (typeof this.props.body !== 'undefined') {
      body = React.createElement(
        'div',
        {
          className: 'modal-body'
        },
        this.props.body
      );
    }

    if (typeof this.props.footer !== 'undefined') {
      footer = React.createElement(
        'div',
        {
          className: 'modal-footer'
        },
        this.props.footer
      );
    }

    return React.createElement(
      'div',
      null,
      title,
      body,
      footer
    );
  }
});

module.exports = ModalTemplate;
