'use strict';

window.define(['store'], function (Store) {

  var modalOpen = false;
  var modalTitle, modalBody, modalFooter;

  var ModalStore = new Store();

  ModalStore.isOpen = function () {
    return modalOpen;
  };

  ModalStore.getTitle = function () {
    return modalTitle;
  };

  ModalStore.getBody = function () {
    return modalBody;
  };

  ModalStore.getFooter = function () {
    return modalFooter;
  };

  ModalStore.createAction('open', function (title, body, footer) {
    modalTitle = title;
    modalBody = body;
    modalFooter = footer;
    modalOpen = true;
    ModalStore.emitEvent('open');
  });

  ModalStore.createAction('close', function () {
    modalOpen = false;
    ModalStore.emitEvent('close');
  });

  return ModalStore;

});
