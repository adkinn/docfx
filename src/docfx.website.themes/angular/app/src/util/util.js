// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.
/*
 * Define general utility functions used in docsApp
 * Wrap Angular components in an Immediately Invoked Function Expression (IIFE)
 * to avoid variable collisions
 */
(function () {
  'use strict';
  /*jshint validthis:true */
  function utilityProvider() {
    this.cleanArray = function (actual) {
      var newArray = [];
      for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
          newArray.push(actual[i]);
        }
      }
      return newArray;
    };
    
    this.getArray = function (items, callback) {
      if (angular.isArray(items)) {
        return items;
      } else {
        var array = [];
        for (var key in items) {
          if (items.hasOwnProperty(key)) {
            if(callback) callback(key, items[key]);
            array.push(items[key]);
          }
        }
        return array;
      }
    };

    // startline starts @1 to be consistent with IDE
    // endline < 1 stands for infinite
    this.substringLine = function (input, startline, endline, dedent) {
      if (!input) return '';
      var lines = input.split('\n');
      var maxLine = lines.length;
      startline = startline <= 1 ? 1 : startline;
      endline = endline >= maxLine || endline < 1 ? maxLine : endline;
      var snippet = '';
      var maxDedent;
      for (var i = startline - 1; i < endline; i++) {
        if (i === startline - 1)  maxDedent = getSpaceIndex(lines[i]);
        var currentDedent = getSpaceIndex(lines[i]);
        var activeDedent = currentDedent > maxDedent? maxDedent: currentDedent;
        var line = lines[i];
        if (dedent) line = line.substring(activeDedent);
        snippet += line + '\n';
      }
      return snippet;
    };
    
    function getSpaceIndex(input){
      var i = -1;
      while (input.length > 0 && input[++i] === ' '){
      }
      return i;
    }
    
    this.escapeRegExp = function (str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    
    // Start from here: YAML specific
    this.getNameWithSelector = function(defaultNameSelector, language, model){
      if (!defaultNameSelector || !model) return null;
      var nameSelector = defaultNameSelector;
      
      // Use the language specific one, if it does not exist, fallback to the default one;
      if (language) nameSelector = defaultNameSelector + '.'+language;
      return model[nameSelector] || model[defaultNameSelector];
    };
    
    this.getDisplayName = function(item, language){
      if (!item) return null;
      var name = this.getNameWithSelector("name", language, item);
      
      // if item does not have href, use full name
      if (!item.href){
        return this.getNameWithSelector("fullName", language, item) || name || item.uid ;
      } else return name; 
    };
    
  }

  angular.module('docascode.util', [])
    .service('docUtility', utilityProvider);
})();