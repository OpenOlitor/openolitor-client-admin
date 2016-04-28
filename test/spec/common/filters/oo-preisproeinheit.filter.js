describe('Filter: ooPreisProEinheit', function() {
  'use strict';

  var $filter;

  beforeEach(function() {
    module('openolitor');

    inject(function(_$filter_) {
      $filter = _$filter_;
    });
  });

  it('format preis + preisEinheit + waehrung to single string', function() {
    var input = {
      preis: 3,
      preiseinheit: 'Tag',
      waehrung: 'CHF'
    };

    var result = $filter('ooPreisProEinheit')(input);

    expect(result).toEqual('CHF 3 pro Tag');
  });
});
