'use strict';

var React = require('react');
var VariableStore = require('../stores/variable-store');
var ModalStore = require('../stores/modal-store');
var ImportModal = require('./modal/import-modal');
var ExportModal = require('./modal/export-modal');
var ResetModal = require('./modal/reset-modal');

var Navigation = React.createClass({
  getInitialState: function () {
    return {
      navbarActive: false,
      dropdownSizesActive: false
    };
  },

  onClickToggleNavbar: function () {
    this.setState({
      navbarActive: !this.state.navbarActive
    });
  },

  onClickExport: function () {
    ModalStore.action('open', ExportModal);
  },

  onClickImport: function () {
    ModalStore.action('open', ImportModal);
  },

  onClickReset: function () {
    ModalStore.action('open', ResetModal);
  },

  onClickPreview: function () {
    VariableStore.action('requestPreview');
  },

  onClickToggleDropdownSizes: function () {
    this.setState({
      dropdownSizesActive: !this.state.dropdownSizesActive
    });
  },

  render: function () {
    var self = this;

    var frameSizes = this.props.frameSizes.map(function (size) {
      return (
        <li key={size.name}>
          <a onClick={self.props.setFrameSize.bind(null, size)}>{size.name}</a>
        </li>
      );
    });

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" onClick={self.onClickToggleNavbar}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand" href="/" title="Home">
              <img className="img-responsive app-logo" src="static/img/logo-icon.png" />
            </a>
          </div>
          <div
            className={'navbar-collapse collapse in' + (self.state.navbarActive ? ' active' : '')}
          >
            <ul className="nav navbar-nav">
              <li><a onClick={this.onClickImport}>Import</a></li>
              <li><a onClick={this.onClickExport}>Export</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://github.com/dabapps/betta/" target="_blank" title="Betta on GitHub">
                  Fork us on GitHub
                </a>
              </li>
              <li>
                <a onClick={this.onClickReset}>
                  Reset
                </a>
              </li>

              <li
                className={'dropdown' + (self.state.dropdownSizesActive ? ' open' : '')}
                onClick={self.onClickToggleDropdownSizes}
              >
                <a>
                  Screen Sizes ({self.props.currentFrameSize.name}) <span className="caret" />
                </a>
                <ul className="dropdown-menu">
                  {frameSizes}
                </ul>
              </li>

              <li>
                <a onClick={this.onClickPreview}>
                  Preview
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navigation;
