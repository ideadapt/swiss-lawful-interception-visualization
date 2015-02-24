/* global describe, it, expect, sinon, beforeEach, I18n, Params */

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

describe('Params', function(){
  var fakeWindow = {onpopstate: ''};
  var fakeEmitter = function emitter(){
    this.emitSync= function(){};
  };
  describe('init', function(){
    it('/de/2014/gr', function(){
      var fakeLocation = { pathname: '/de/2014/gr', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init();

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(2014);
      expect(params.canton).to.equal('gr');
    });

    it('/2014/gr and use provided default locale', function(){
      var fakeLocation = { pathname: '/2014/gr', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init('de');

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(2014);
      expect(params.canton).to.equal('gr');
    });

    it('/de/2014', function(){
      var fakeLocation = { pathname: '/de/2014', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init();

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(2014);
      expect(params.canton).to.equal(undefined);
    });

    it('/2014 and use provided default locale', function(){
      var fakeLocation = { pathname: '/2014', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init('de');

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(2014);
      expect(params.canton).to.equal(undefined);
    });

    it('/de', function(){
      var fakeLocation = { pathname: '/de', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init();

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(undefined);
      expect(params.canton).to.equal(undefined);
    });

    it('/', function(){
      var fakeLocation = { pathname: '/', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init('de');

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(undefined);
      expect(params.canton).to.equal(undefined);
    });

    it('with trailing slash /de/2014/gr/', function(){
      var fakeLocation = { pathname: '/de/2014/gr/', search: '', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init();

      expect(params.locale).to.equal('de');
      expect(params.year).to.equal(2014);
      expect(params.canton).to.equal('gr');
    });

    it('?locale=fr overwrites locale given in path /de/2014/gr/', function(){
      var fakeLocation = { pathname: '/de/2014/gr/', search: '?locale=fr', hostname: ''};
      var params = new Params(fakeEmitter, fakeLocation, fakeWindow);
      params.init();

      expect(params.locale).to.equal('fr');
      expect(params.year).to.equal(2014);
      expect(params.canton).to.equal('gr');
    });
  });
});

