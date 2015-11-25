'use strict';

describe('Controller: AbotypenOverviewController', function() {

  // load the controller's module
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('openolitor'));

  var controller, $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();

    controller = $controller('AbotypenOverviewController', {
      $scope: $scope
    });
  }));

  it('should initialize scope variables', function() {
    expect($scope.entries).toBeDefined();
    expect($scope.entries).toEqual([{id: 12}]);
  });

});
