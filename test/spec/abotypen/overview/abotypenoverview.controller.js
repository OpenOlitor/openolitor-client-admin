'use strict';

describe('Controller: AbotypenOverviewController', function() {

  // load the controller's module
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('openolitor'));

  var controller, $scope, $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$q_) {
    $q = _$q_;
    $scope = $rootScope.$new();

    var mockAbotypenOverviewModel = {
      query: function() {
        return $q.when([]);
      }
    };

    controller = $controller('AbotypenOverviewController', {
      $scope: $scope,
      'AbotypenOverviewModel': mockAbotypenOverviewModel
    });
  }));

  it('should initialize scope variables', function() {
    expect($scope.loading).toBeDefined();
  });

});
