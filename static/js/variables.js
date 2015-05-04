'use strict';

window.define(['jquery'], function ($) {

  var variables = {
    colorVariables: [],

    addCollection: function (unpackedVariables, line) {
      unpackedVariables.push({
        element: 'collection',
        value: line.replace(/\/\/==\s*/, ''),
        children: []
      });
    },

    addSubHeader: function (unpackedVariables, line) {
      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'subHeader',
        value: line.replace(/\/\/===\s*/, '')
      });
    },

    addSubText: function (unpackedVariables, line) {
      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'subText',
        value: line.replace(/\/\/##\s*/, '')
      });
    },

    addLabel: function (unpackedVariables, line) {
      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'label',
        value: line.replace(/\/\/\*\*\s*/, '')
      });
    },

    addVariable: function (unpackedVariables, line) {
      var self = this;
      var name = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '@$1');
      var defaultValue = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '$2');
      var type;

      if (defaultValue.indexOf('#') === 0 || defaultValue.indexOf('lighten') === 0 || defaultValue.indexOf('darken') === 0) {
        type = 'color';
        self.colorVariables.push(name);
      } else if (defaultValue.indexOf('@') === 0) {
        if (self.colorVariables.indexOf(defaultValue) >= 0) {
          type = 'color';
          self.colorVariables.push(name);
        } else {
          type = 'other';
        }
      } else {
        type = 'other';
      }

      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'variable',
        name: name,
        defaultValue: defaultValue,
        value: '',
        type: type
      });
    },

    unpack: function (result) {
      var self = this;
      self.colorVariables = [];
      var lines = result.split('\n');
      var unpackedVariables = [];

      $.each(lines, function (index, line) {
        // Sub-header
        if (line.indexOf('//===') === 0) {
          self.addSubHeader(unpackedVariables, line);
        } else
        // Header (collection)
        if (line.indexOf('//==') === 0) {
          self.addCollection(unpackedVariables, line);
        } else
        // Sub-text
        if (line.indexOf('//##') === 0) {
          self.addSubText(unpackedVariables, line);
        } else
        // Label
        if (line.indexOf('//**') === 0) {
          self.addLabel(unpackedVariables, line);
        } else
        // Variable
        if (line.indexOf('@') === 0) {
          self.addVariable(unpackedVariables, line);
        }
      });

      return unpackedVariables;
    },

    pack: function (unpackedVariables) {
      var variables = '';

      $.each(unpackedVariables, function (collectionIndex, collection) {
        $.each(collection.children, function (childIndex, child) {
          if (child.element === 'variable') {
            if (typeof child.value !== 'undefined' && child.value !== null && child.value !== '') {
              variables = variables.concat(
                [child.name, child.value].join(': ').concat(';\n')
              );
            } else {
              variables = variables.concat(
                [child.name, child.defaultValue].join(': ').concat(';\n')
              );
            }
          }
        });
      });

      return variables;
    },
  };

  return variables;

});
