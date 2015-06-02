'use strict';

window.define(['store', 'jquery'], function (Store, $) {

  var variables = [];
  var colorVariables = [];
  var lastLabel;

  var VariableStore = new Store();

  var addCollection = function (unpackedVariables, line) {
    unpackedVariables.push({
      element: 'collection',
      value: line.replace(/\/\/==\s*/, ''),
      children: []
    });
  };

  var addSubHeader = function (unpackedVariables, line) {
    unpackedVariables[unpackedVariables.length - 1].children.push({
      element: 'subHeader',
      value: line.replace(/\/\/===\s*/, '')
    });
  };

  var addSubText = function (unpackedVariables, line) {
    unpackedVariables[unpackedVariables.length - 1].children.push({
      element: 'subText',
      value: line.replace(/\/\/##\s*/, '')
    });
  };

  var addLabel = function (unpackedVariables, line) {
    lastLabel = line.replace(/\/\/\*\*\s*/, '');
  };

  var addVariable = function (unpackedVariables, line) {
    var name = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '@$1');
    var defaultValue = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '$2');
    var type;

    if (defaultValue.indexOf('#') === 0 || defaultValue.indexOf('lighten') === 0 || defaultValue.indexOf('darken') === 0) {
      type = 'color';
      colorVariables.push(name);
    } else if (defaultValue.indexOf('@') === 0) {
      if (colorVariables.indexOf(defaultValue) >= 0) {
        type = 'color';
        colorVariables.push(name);
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
      type: type,
      label: lastLabel
    });

    lastLabel = undefined;
  };

  var unpackVariables = function (result) {
    colorVariables = [];
    var lines = result.split('\n');
    var unpackedVariables = [];

    $.each(lines, function (index, line) {
      // Sub-header
      if (line.indexOf('//===') === 0) {
        addSubHeader(unpackedVariables, line);
      } else
      // Header (collection)
      if (line.indexOf('//==') === 0) {
        addCollection(unpackedVariables, line);
      } else
      // Sub-text
      if (line.indexOf('//##') === 0) {
        addSubText(unpackedVariables, line);
      } else
      // Label
      if (line.indexOf('//**') === 0) {
        addLabel(unpackedVariables, line);
      } else
      // Variable
      if (line.indexOf('@') === 0) {
        addVariable(unpackedVariables, line);
      }
    });

    variables = unpackedVariables;
    VariableStore.emitEvent('loaded');
  };

  var errorLoadingLess = function (error) {
    window.alert(error.responseText);
  };

  $.ajax('static/lib/bootstrap/less/variables.less', {
    success: unpackVariables,
    error: errorLoadingLess
  });

  VariableStore.getVariables = function () {
    return variables;
  };

  var isDefined = function (value) {
    return typeof value !== 'undefined' && value !== null && value !== '';
  };

  VariableStore.getPackedVariables = function (includeHeaders, includeLabels, excludeUnedited, commentUnedited) {
    var packedVariables = '';

    if (includeHeaders) {
      packedVariables = '//\n// Variables\n// --------------------------------------------------\n';
    }

    $.each(variables, function (collectionIndex, collection) {
      if (includeHeaders) {
        packedVariables = packedVariables.concat('\n//== '.concat(collection.value).concat('\n//\n'));
      }

      $.each(collection.children, function (childIndex, child) {
        if (child.element === 'variable') {
          var label = '';
          if (includeLabels && child.label) {
            label = '//** '.concat(child.label).concat('\n');
          }

          if (isDefined(child.value)) {
            packedVariables = packedVariables.concat(label).concat(
              [child.name, child.value].join(': ').concat(';\n')
            );
          } else {
            if (!excludeUnedited) {
              packedVariables = packedVariables.concat(label).concat(
                (commentUnedited ? '//' : '').concat(
                  [child.name, child.defaultValue].join(': ').concat(';\n')
                )
              );
            }
          }
        } else if (child.element === 'subText' && includeHeaders) {
          packedVariables = packedVariables.concat('//## '.concat(child.value).concat('\n\n'));
        }
      });
    });

    return packedVariables;
  };

  VariableStore.createAction('reset', function () {
    $.each(variables, function (collectionIndex, collection) {
      $.each(collection.children, function (childIndex, child) {
        if (child.element === 'variable') {
          child.value = '';
        }
      });
    });

    VariableStore.emitEvent('reset');
  });

  VariableStore.createAction('updateVariable', function (groupIndex, variablesIndex, value) {
    variables[groupIndex].children[variablesIndex].value = value;

    VariableStore.emitEvent('updateVariable');
  });

  return VariableStore;

});
