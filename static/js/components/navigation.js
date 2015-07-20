'use strict';

var React = require('react');
var VariableStore = require('../stores/variable-store');
var ModalStore = require('../stores/modal-store');
var ImportModal = require('./modal/import-modal');
var ExportModal = require('./modal/export-modal');
var ResetModal = require('./modal/reset-modal');

var Navigation = React.createClass({
  toggleNavbar: function () {
    this.setState({
      navbarActive: !this.state.navbarActive
    });
  },

  export: function () {
    ModalStore.action('open', ExportModal);
  },

  import: function () {
    ModalStore.action('open', ImportModal);
  },

  reset: function () {
    ModalStore.action('open', ResetModal);
  },

  preview: function () {
    VariableStore.action('requestPreview');
  },

  toggleDropdownSizes: function () {
    this.setState({
      dropdownSizesActive: !this.state.dropdownSizesActive
    });
  },

  getInitialState: function () {
    return {
      navbarActive: false,
      dropdownSizesActive: false
    };
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
      <nav className='navbar navbar-inverse navbar-fixed-top'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' onClick={self.toggleNavbar}>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='/' title='Home'>
              <img className='img-responsive app-logo' src='static/img/logo-icon.png' />
            </a>
          </div>
          <div
            className={'navbar-collapse collapse in' + (self.state.navbarActive ? ' active' : '')}>
            <ul className='nav navbar-nav'>
              <li><a onClick={this.import}>Import</a></li>
              <li><a onClick={this.export}>Export</a></li>
            </ul>
            <ul className='nav navbar-nav navbar-right'>
              <li><a onClick={this.reset}>Reset</a></li>

              <li className={'dropdown' + (self.state.dropdownSizesActive ? ' open' : '')}
                onClick={self.toggleDropdownSizes}>
                <a>
                  Screen Sizes ({self.props.currentFrameSize.name}) <span className='caret'></span>
                </a>
                <ul className='dropdown-menu'>
                  {frameSizes}
                </ul>
              </li>

              <li><a onClick={this.preview}>Preview</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navigation;
