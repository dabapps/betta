'use strict';

var React = require('react');
var SearchStore = require('../stores/search-store');
var VariableStore = require('../stores/variable-store');

var SidebarMenu = React.createClass({
  preview: function () {
    VariableStore.action('requestPreview');
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
      dropdownSizesActive: false
    };
  },

  render: function () {
    var self = this;
    var dropdownSizes;

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

          <button
            className='btn btn-small btn-default pull-right'
            onClick={self.preview}>
              Preview
          </button>
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
