/* global describe, it, expect, sinon, beforeEach, I18n */

(function () {
  'use strict';

  describe('I18n', function () {

    beforeEach(function(){
      function Numeral(){ }
      var numeralFake = function(){
        return new Numeral();
      };
      numeralFake.defaultFormat = function(){};
      numeralFake.language = function(){};
      numeralFake.format = sinon.stub().returns(0);
      Numeral.prototype.format = numeralFake.format;

      this.numeralFake = numeralFake;
      this.i18n = new I18n(this.numeralFake);
      this.i18n.init({'de': {}}, 'de');
    });

    describe('l', function () {
      describe('key not found', function(){
        it('should return upper case key with colon prefix', function () {
        	var translated = this.i18n.l('test_key_na');
        	expect(translated).to.equal(':test_key_na'.toUpperCase());
        });
      });
    });

    describe('numeral', function(){
      describe('with real number', function(){
        it('should call decorated original numeral.format', function(){
          var number = 5;
          var fakeValue = this.i18n.numeral(number).format();

          expect(this.numeralFake.format.calledOnce);
          expect(fakeValue).to.equal(0);
        });
      });

      describe('with not a number', function(){
        it('should call custom decorator', function(){
          this.i18n.l = sinon.stub().returns('n/a');

          var number = NaN;
          var fakeValue = this.i18n.numeral(number).format();

          expect(this.numeralFake.format.callCount).to.equal(0);
          expect(this.i18n.l.calledOnce);
          expect(fakeValue).to.equal('n/a');
        });
      });
    });
  });
})();
