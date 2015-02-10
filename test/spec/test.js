/* global describe, it, assert */

(function () {
  'use strict';

  describe('I18n', function () {
    describe('l', function () {
      it('should return key if no value', function () {
      	window.Emitter = function(){
      		return {
      			emitSync: function(){}
      		};
      	};
      	var map = new Map({});
      	// var translated = i18n.l('test_key_na');
      	// expect(translated).toBe('test_key_na');
      	assert.equal(map.emitter, '');
      });
    });
  });
})();
