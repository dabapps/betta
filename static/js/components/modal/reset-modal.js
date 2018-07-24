'use strict';

var React = require('react');
var ModalTemplate = require('./modal-template');
var ModalStore = require('../../stores/modal-store');
var VariableStore = require('../../stores/variable-store');

var ResetModal = React.createClass({
  onClickClose: function () {
    ModalStore.action('close');
  },

  onClickReset: function () {
    VariableStore.action('reset');
    ModalStore.action('close');
  },

  render: function () {
    return (
      <ModalTemplate
        title="Reset all variables?"
        body={
          <div>
            <div className="row">
              <div className="col-xs-12">Are you sure you want to reset your variables?</div>
              <div className="col-xs-12">You will lose <strong>all</strong> you changes.</div>
            </div>
          </div>
        }
        footer={
          <div>
            <button className="btn btn-danger pull-right" onClick={this.onClickReset}>Confirm</button>
            <button className="btn btn-default pull-right" onClick={this.onClickClose}>Cancel</button>
          </div>
        }
      />
    );
  }
});

module.exports = ResetModal;
