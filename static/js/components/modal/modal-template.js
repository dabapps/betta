'use strict';

var React = require('react');

var ModalTemplate = React.createClass({
  render: function () {
    var title, body, footer;

    if (typeof this.props.title !== 'undefined') {
      title = (
        <div className="modal-header">
          <h4>{this.props.title}</h4>
        </div>
      );
    }

    if (typeof this.props.body !== 'undefined') {
      body = (
        <div className="modal-body">{this.props.body}</div>
      );
    }

    if (typeof this.props.footer !== 'undefined') {
      footer = (
        <div className="modal-footer">{this.props.footer}</div>
      );
    }

    return (
      <div>
        {title}
        {body}
        {footer}
      </div>
    );
  }
});

module.exports = ModalTemplate;
