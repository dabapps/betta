'use strict';

var Store = require('../stores/store');
var $ = require('jquery');
var _ = require('underscore');

var variablesPath = 'static/build/lib/bootstrap/less/variables.less';
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

var addDescription = function (unpackedVariables, line) {
  unpackedVariables[unpackedVariables.length - 1].description = line.replace(/\/\/##\s*/, '');
};

var addLabel = function (unpackedVariables, line) {
  lastLabel = line.replace(/\/\/\*\*\s*/, '');
};

var addVariable = function (unpackedVariables, line) {
  var name = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '@$1');
  var defaultValue = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '$2');
  var type;

  if (defaultValue.indexOf('#') === 0 ||
    defaultValue.indexOf('lighten') === 0 ||
    defaultValue.indexOf('darken') === 0) {
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

  _.each(lines, function (line) {
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
      addDescription(unpackedVariables, line);
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

$.ajax(variablesPath, {
  success: unpackVariables,
  error: errorLoadingLess
});

VariableStore.getVariables = function () {
  return variables;
};

var isDefined = function (value) {
  return typeof value !== 'undefined' && value !== null && value !== '';
};

var variablesHaveValues = function (item) {
  return item.element === 'variable' && isDefined(item.value);
};

VariableStore.getPackedVariables = function (
  includeHeaders, includeLabels, excludeUnedited, commentUnedited
) {
  var packedVariables = '';

  if (includeHeaders) {
    packedVariables = '//\n// Variables\n// --------------------------------------------------\n';
  }

  _.each(variables, function (collection) {
    var collectionHasChildren = !(
      excludeUnedited && !_.any(collection.children, variablesHaveValues)
    );
    if (includeHeaders && collectionHasChildren) {
      packedVariables = packedVariables
        .concat('\n//== ')
        .concat(collection.value)
        .concat('\n//\n')
        .concat(collection.description ? '//## '.concat(collection.description) : '//##')
        .concat('\n\n');
    }

    _.each(collection.children, function (child) {
      if (child.element === 'variable') {
        var label = '';
        if (includeLabels && child.label) {
          label = '//** '.concat(child.label).concat('\n');
        }

        if (isDefined(child.value)) {
          packedVariables = packedVariables.concat(label).concat(
            [child.name, child.value].join(': ').concat(';\n')
          );
        } else if (!excludeUnedited) {
          packedVariables = packedVariables.concat(label).concat(
              (commentUnedited ? '//' : '').concat(
                [child.name, child.defaultValue].join(': ').concat(';\n')
              )
            );
        }
      } else if (child.element === 'subHeader' && collectionHasChildren) {
        packedVariables = packedVariables.concat('//=== ').concat(child.value).concat('\n');
      }
    });
  });

  return packedVariables;
};

var clearVariables = function () {
  _.each(variables, function (collection) {
    _.each(collection.children, function (child) {
      if (child.element === 'variable') {
        child.value = '';
      }
    });
  });
};

VariableStore.createAction('reset', function () {
  clearVariables();
  VariableStore.emitEvent('reset');
});

VariableStore.createAction('updateVariable', function (groupIndex, variablesIndex, value) {
  variables[groupIndex].children[variablesIndex].value = value;

  VariableStore.emitEvent('updateVariable');
});

VariableStore.createAction(
'importVariables',
function (newVariables, clearExisting, overrideExisting, includeCommented) {
  var lines = newVariables.split('\n');

  if (clearExisting) {
    clearVariables();
  }

  _.each(lines, function (line) {
    if (line.indexOf('@') === 0 || (includeCommented && line.indexOf('//@') === 0)) {
      line = line.replace(/^\/\//, '');
      var name = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '@$1');
      var value = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '$2');
      var variableIndex;

      var groupIndex = _.findIndex(variables, function (collection) {
        var childIndex = _.findIndex(collection.children, function (child) {
          return child.name === name;
        });

        if (childIndex >= 0) {
          variableIndex = childIndex;
        }

        return childIndex >= 0;
      });

      if (groupIndex >= 0) {
        if (overrideExisting) {
          variables[groupIndex].children[variableIndex].value = value;
        } else if (!variables[groupIndex].children[variableIndex].value) {
          variables[groupIndex].children[variableIndex].value = value;
        }
      }
    }
  });

  VariableStore.emitEvent('updateVariable');
});

VariableStore.createAction('requestPreview', function () {
  VariableStore.emitEvent('requestPreview');
});

module.exports = VariableStore;
