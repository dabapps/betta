'use strict';

window.define(['store'], function (Store) {

  var searchTerm;

  var SearchStore = new Store();

  SearchStore.getSearchTerm = function () {
    return searchTerm;
  };

  SearchStore.createAction('setSearchTerm', function (newSearchTerm) {
    searchTerm = newSearchTerm;

    SearchStore.emitEvent('setSearchTerm');
  });

  return SearchStore;

});
