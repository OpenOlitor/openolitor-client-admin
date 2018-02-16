'use strict';

/**
*/
angular.module('openolitor-admin')
    .controller('PriceAnpassenController', ['$scope', '$uibModalInstance',
        '$log', 'abo', 'ZusatzAboModel', 'ZusatzAbotypenModel',

        function($scope, $uibModalInstance, $log, abo, ZusatzAboModel, ZusatzAbotypenModel) {

            $scope.getZusatzabotypPrice = function(id) {
                var zusatzaboTypPrice;
                if (!$scope.zusatzAbotypen)  {
                    return ;
                } else {
                    $scope.zusatzAbotypen.forEach(function(za) {
                        if (za.id === id) { 
                            zusatzaboTypPrice = za.preis;
                        }
                    });
                    return zusatzaboTypPrice;
                }
            }

            var loadZusatzAbotypen = function() {
                ZusatzAbotypenModel.query({
                },function(zusatzAbotypen){
                    $scope.zusatzAbotypen = zusatzAbotypen;
                    loadZusatzaboPrices();
                });
            };

            var loadZusatzAbos = function() {
                ZusatzAboModel.query({
                    hauptAboId: abo.id,
                    kundeId: abo.kundeId
                },function(zusatzAbos){
                    $scope.zusatzAbos = zusatzAbos;
                    loadZusatzAbotypen();  
                });
            };

            var loadZusatzaboPrices = function(){
                if ($scope.zusatzAbos){
                    $scope.zusatzAbos.forEach(function(zusatzabo) {
                        if(!zusatzabo.price){
                            zusatzabo.price = $scope.getZusatzabotypPrice(zusatzabo.abotypId);
                        }
                    });
                }
            } 
            
            loadZusatzAbos();
            $scope.abo = abo;

            if ( abo.price === undefined ) {
                $scope.formDaten = {
                    oldPrice : abo.abotyp.preis,
                    newPrice : abo.abotyp.preis,
                };
            }
            else{
                $scope.formDaten = {
                    oldPrice : abo.price,
                    newPrice : abo.price,
                };
            }

            $scope.restartAboPrice = function() {
                $scope.formDaten.newPrice = abo.abotyp.preis; 
            };
            
            $scope.restartZusatzaboPrice = function(zusatzabo) {
                zusatzabo.price = $scope.getZusatzabotypPrice(zusatzabo.abotypId); 
            };

            $scope.saveZusatzAbo = function(zusatzAbo) {
                return zusatzAbo.$save();
            };

            $scope.ok = function() {
                if ($scope.formDaten.newPrice === abo.abotyp.preis){
                    $scope.formDaten.newPrice = null
                }
                $scope.zusatzAbos.forEach(function(zusatzabo) {
                    if (zusatzabo.price === $scope.getZusatzabotypPrice(zusatzabo.abotypId)){  
                        zusatzabo.price = null;
                    }
                    $scope.saveZusatzAbo(zusatzabo);
                });

                $uibModalInstance.close($scope.formDaten);
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
