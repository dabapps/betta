'use strict';

var React = require('react');
var ModalStore = require('./modal-store');
var ExportModal = require('./export-modal');
var ImportModal = require('./import-modal');
var SearchStore = require('./search-store');
var VariableStore = require('./variable-store');

var SidebarMenu = React.createClass({
  preview: function () {
    VariableStore.action('requestPreview');
  },

  export: function () {
    ModalStore.action('open', ExportModal);
  },

  import: function () {
    ModalStore.action('open', ImportModal);
  },

  toggleDropdown: function () {
    this.setState({
      dropdownActive: !this.state.dropdownActive
    });
  },

  setSearchTerm: function (event) {
    SearchStore.action('setSearchTerm', event.target.value);
  },

  clearSearchTerm: function () {
    SearchStore.action('setSearchTerm', undefined);
  },

  getInitialState: function () {
    return {
      dropdownActive: false
    };
  },

  render: function () {
    var self = this;
    var dropdown;

    var frameSizes = this.props.frameSizes.map(function (size) {
      return (
        <option key={size.name} value={size.name}>{size.name}</option>
      );
    });

    if (this.state.dropdownActive) {
      dropdown = (
        <ul className='dropdown-menu'>
          <li><a onClick={self.import}>Import</a></li>
          <li><a onClick={self.export}>Export</a></li>
          <li className='divider' />
          <li><a onClick={self.props.reset}>Reset</a></li>
        </ul>
      );
    }

    return (
      <div className='sidebar-menu'>
        <div className='form-group'>
          <select
            className='form-control size-control'
            onChange={self.props.setFrameSize}
            value={self.props.currentFrameSize.name}>{frameSizes}</select>
          <button className='btn btn-small btn-default' onClick={self.preview}>Preview</button>
          <div
            className={'dropdown pull-right' + (self.state.dropdownActive ? ' open' : '')}
            onClick={self.toggleDropdown}>
            <button className='btn btn-small btn-default'>File <span className='caret' /></button>
            {dropdown}
          </div>
        </div>
        <div className='form-group'>
          <div className='input-wrapper search-wrapper'>
            <input
              type='text'
              className='form-control'
              placeholder='Search variables'
              onChange={this.setSearchTerm}
              value={this.props.searchTerm}>
            </input>
            <span className='glyphicon glyphicon-remove' onClick={this.clearSearchTerm} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SidebarMenu;
