'use strict';

var React = require('react');
var ColorPicker = require('./color-picker');
var _ = require('underscore');

var searchableTypes = [
  'name',
  'defaultValue',
  'value',
  'label'
];

var FormCollection = React.createClass({
  areDefined: function (value) {
    return typeof value !== 'undefined';
  },

  areInValue: function (value, term) {
    return value.toLowerCase().indexOf(term) >= 0;
  },

  containsSearchTerm: function (value, key) {
    var self = this;
    var searchTerm = this.props.searchTerm.toLowerCase().replace(/\s+?/gi, ' ');
    var searchTerms = searchTerm.split(' ');

    return searchableTypes.indexOf(key) >= 0 &&
      value &&
      (
        value.toLowerCase().indexOf(searchTerm) >= 0 ||
        _.every(searchTerms, self.areInValue.bind(self, value))
      );
  },

  create: {
    subHeader: function (child) {
      if (this.props.searchTerm) {
        return undefined;
      }
      return (
        <h5 key={child.value}>child.value</h5>
      );
    },

    variable: function (child, index) {
      var self = this;
      var colorPicker, label;

      if (this.props.searchTerm && !_.any(child, this.containsSearchTerm)) {
        return undefined;
      }

      if (child.type === 'color') {
        colorPicker = (
          <ColorPicker
            setValue={self.props.updateVariable.bind(null, self.props.index, index)}
            value={child.value}
            defaultValue={child.defaultValue} />
        );
      }

      if (child.label) {
        label = (
          <p>
            <sub>{child.label}</sub>
          </p>
        );
      }

      return (
        <div className='form-group' key={child.name}>
          {label}
          <label>{child.name}</label>
          <div className='input-wrapper'>
            <input
              text='text'
              className='form-control'
              placeholder={child.defaultValue}
              value={child.value}
              onChange={self.props.updateVariable.bind(null, self.props.index, index)} />
            {colorPicker}
          </div>
        </div>
      );
    }
  },

  render: function () {
    var self = this;
    var description, hasSearchResults, children;

    var isNotActiveCollection = typeof this.props.activeIndex !== 'undefined' &&
      this.props.index !== this.props.activeIndex;
    var isActiveCollection = typeof this.props.activeIndex !== 'undefined' &&
      this.props.index === this.props.activeIndex;

    if (isNotActiveCollection && !this.props.searchTerm) {
      return false;
    }

    if (isActiveCollection || this.props.searchTerm) {
      children = this.props.group.children.map(function (child, index) {
        return self.create[child.element].call(self, child, index);
      });
    }

    if (isActiveCollection && this.props.group.description) {
      description = (
        <p>{this.props.group.description}</p>
      );
    }

    if (this.props.searchTerm) {
      hasSearchResults = _.any(children, this.areDefined);

      if (!hasSearchResults) {
        return false;
      }
    }

    return (
      <div
        key={this.props.key}
        className={
          'form-collection' +
          (isActiveCollection ? ' active' : '') +
          (hasSearchResults ? ' filtered' : '')}>
            <a onClick={self.props.setActiveCollection.bind(null, this.props.index)}>
              <h4 title={this.props.group.value}>{this.props.group.value}</h4>
            </a>
            {description}
            {children}
      </div>
    );
  }
});

module.exports = FormCollection;
