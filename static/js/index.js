/* global $ */

'use strict';

(function () {

  var iframe = $('#frame');
  var iframeDoc = iframe.contents();
  var previewButton = $('#preview-button');
  var resetButton = $('#reset-button');

  var renderCSS = function (less) {
    less = less || '';
    window.less.render(less, function (error, tree) {
      if (error) {
        window.alert(error);
        return;
      }

      var styles = $('<style>')
        .html(tree.css);

      iframeDoc.find('head').append(styles);
    });
  };

  var getIframeDocument = function () {
    iframeDoc = iframe.contents();
  };

  iframe.bind('load', getIframeDocument);
  iframe.attr('src', 'templates/template-1.html');

  var sizeControl = $('#size-control');

  var sizes = ['XS', 'SM', 'MD', 'LG', 'XL'];

  $.each(sizes, function (index, size) {
    sizeControl
      .append(
        $('<option>')
          .text(size)
          .attr('selected', (index === sizes.length - 1 ? 'selected' : false))
      );
  });

  sizeControl
    .bind('change', function () {
      var value = $(this).val();

      $.each(sizes, function (index, size) {
        iframe.removeClass(size.toLowerCase());
      });

      if (value !== sizes[sizes.length - 1]) {
        iframe.addClass(value.toLowerCase());
      }
    });

  var variablesForm = $('#variables-form');

  var toggleCollection = function () {
    var myParent = $(this).parent('.form-collection');

    $('.form-collection')
      .not(myParent)
      .removeClass('active');

    myParent.toggleClass('active');
  };

  var addCollection = function (line) {
    $('<div>')
      .addClass('form-collection')
      .append(
        $('<a>')
          .append($('<h4>')
            .text(line.replace(/\/\/==\s*/, ''))
          )
          .click(toggleCollection)
      )
      .appendTo(variablesForm);
  };

  var addSubHeader = function (line) {
    $('<h5>')
      .text(line.replace(/\/\/===\s*/, '')).appendTo($('.form-collection').last());
  };

  var addSubText = function (line) {
    $('<p>')
      .text(line.replace(/\/\/##\s*/, ''))
      .appendTo($('.form-collection').last());
  };

  var addLabel = function (line) {
    $('<sub>')
      .text(line.replace(/\/\/\*\*\s*/, ''))
      .appendTo($('.form-collection').last());
  };

  var addInput = function (line) {
    $('<div>')
      .addClass('form-group')
      .append(
        $('<label>')
          .text(line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '@$1'))
      ).append(
        $('<input>')
          .addClass('form-control')
          .attr('placeholder', line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '$2'))
      )
      .appendTo($('.form-collection').last());
  };

  $.ajax('static/lib/bootstrap/less/variables.less', {
    success: function (result) {
      var lines = result.split('\n');

      $.each(lines, function (index, line) {
        // Sub-header
        if (line.indexOf('//===') === 0) {
          addSubHeader(line);
        } else
        // Header
        if (line.indexOf('//==') === 0) {
          addCollection(line);
        } else
        // Sub-text
        if (line.indexOf('//##') === 0) {
          addSubText(line);
        } else
        // Label
        if (line.indexOf('//**') === 0) {
          addLabel(line);
        } else
        // Variable
        if (line.indexOf('@') === 0) {
          addInput(line);
        }
      });

      $('.form-collection')
        .first()
        .addClass('active');
    }, error: function () {

    }
  });

  var buildVariables = function () {
    var myVariables = '';

    variablesForm
      .find('.form-group')
      .each(function () {
        var element = $(this);
        var variableName = element.find('label').text();
        var variableValue = element.find('input').val();
        var variableDefault = element.find('input').attr('placeholder');

        if (typeof variableValue !== 'undefined' && variableValue !== null && variableValue !== '') {
          myVariables = myVariables.concat(
            [variableName, variableValue].join(': ').concat(';\n')
          );
        } else {
          myVariables = myVariables.concat(
            [variableName, variableDefault].join(': ').concat(';\n')
          );
        }
      });

    return myVariables;
  };

  var buildLess = function (less, myVariables) {
    if (less) {
      less = less.replace(/"(.+?)"/gi, '"static/lib/bootstrap/less/$1"');
      less = less.replace(/@.+?variables.+?;/i, myVariables);
    }

    return less;
  };

  var removePreviousStyles = function () {
    iframeDoc.find('style').remove();
  };

  var disableBootstrapStyles = function () {
    iframeDoc[0].styleSheets[0].disabled = true;
  };

  var preview = function () {
    var myVariables = buildVariables();

    $.ajax('static/lib/bootstrap/less/bootstrap.less', {
      success: function (result) {
        var less = buildLess(result, myVariables);
        removePreviousStyles();
        disableBootstrapStyles();
        renderCSS(less);
      }, error: function () {

      }
    });
  };

  previewButton.click(preview);

  resetButton.click(function () {
    variablesForm
      .find('input')
      .val('');

    preview();
  });

})();
