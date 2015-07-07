'use strict';

var React = require('react');
var ModalStore = require('../stores/modal-store');
var ExportModal = require('./modal/export-modal');
var ImportModal = require('./modal/import-modal');
var SearchStore = require('../stores/search-store');
var VariableStore = require('../stores/variable-store');

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

  toggleDropdownFile: function () {
    this.setState({
      dropdownFileActive: !this.state.dropdownFileActive
    });
  },

  toggleDropdownSizes: function () {
    this.setState({
      dropdownSizesActive: !this.state.dropdownSizesActive
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
      dropdownFileActive: false,
      dropdownSizesActive: false
    };
  },

  render: function () {
    var self = this;
    var dropdownFile, dropdownSizes;

    var frameSizes = this.props.frameSizes.map(function (size) {
      return (
        <li key={size.name}>
          <a onClick={self.props.setFrameSize.bind(null, size)}>{size.name}</a>
        </li>
      );
    });

    if (this.state.dropdownSizesActive) {
      dropdownSizes = (
        <ul className='dropdown-menu'>
          {frameSizes}
        </ul>
      );
    }

    if (this.state.dropdownFileActive) {
      dropdownFile = (
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
          <div
            className={'dropdown pull-left' + (self.state.dropdownSizesActive ? ' open' : '')}
            onClick={self.toggleDropdownSizes}>
            <button className='btn btn-small btn-default'>
              {self.props.currentFrameSize.name} <span className='caret' />
            </button>
            {dropdownSizes}
          </div>

          <button className='btn btn-small btn-default' onClick={self.preview}>Preview</button>
          <div
            className={'dropdown pull-right' + (self.state.dropdownFileActive ? ' open' : '')}
            onClick={self.toggleDropdownFile}>
            <button className='btn btn-small btn-default'>File <span className='caret' /></button>
            {dropdownFile}
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
