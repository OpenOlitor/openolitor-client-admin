'use strict';

/**
*/
angular.module('openolitor-admin')
    .controller('ProjektSettingsController', ['$scope', '$filter',
        'NgTableParams',
        'KundentypenService',
        'KundentypenModel',
        'PersonCategoriesService',
        'PersonCategoriesModel',
        'ProduktekategorienService',
        'ProduktekategorienModel',
        'ProjektService',
        'ProjektModel',
        'OpenProjektModel',
        'KontoDatenService',
        'KontoDatenModel',    
        'EnumUtil',
        'FileSaver',
        'MONATE',
        'WAEHRUNG',
        'Upload',
        'msgBus',
        'cloneObj',
        'API_URL',
        function($scope, $filter, NgTableParams, KundentypenService,
            KundentypenModel, PersonCategoriesService, PersonCategoriesModel, ProduktekategorienService, ProduktekategorienModel,
            ProjektService, ProjektModel, OpenProjektModel, KontoDatenService, KontoDatenModel, EnumUtil, FileSaver, MONATE, WAEHRUNG,
            Upload, msgBus, cloneObj, API_URL
        ) {
            $scope.editingKundentypBool = false;
            $scope.editingProduktekategorieBool = false;
            $scope.editingPersonCategoriesBool = false;

            // first fake to true to work around bs-switch bug
            $scope.projectResolved = false;
            $scope.editMode = true;

            var defaults = {
                modelKundentyp: {
                    kundentyp: '',
                    beschreibung: '', 
                    editable:true
                },
                modelProduktekategorie: {
                    beschreibung: '', 
                    editable:true
                },
                modelPersonCategory: {
                    name: '', 
                    description: '', 
                    editable:true
                }
            };

            $scope.waehrungen = EnumUtil.asArray(WAEHRUNG);

            $scope.monate = EnumUtil.asArray(MONATE);

            $scope.tage = [];
            for (var i = 1; i <= 31; i++) {
                $scope.tage.push({
                    id: i
                });
            }

            //watch for set of kundentypen
            $scope.$watch(KundentypenService.getKundentypen,
                function(list) {
                    if (list) {
                        $scope.kundentypen = [];
                        angular.forEach(list, function(item) {
                            if (item.id) {
                                $scope.kundentypen.push(item);
                            }
                        });
                        $scope.kundentypenTableParams.reload();
                    }
                });

            //watch for set of produktekategorien
            $scope.$watch(ProduktekategorienService.getProduktekategorien,
                function(list) {
                    if (list) {
                        $scope.produktekategorien = [];
                        angular.forEach(list, function(item) {
                            if (item.id) {
                                $scope.produktekategorien.push(item);
                            }
                        });
                        $scope.produktekategorienTableParams.reload();
                    }
                });

            //watch for set of personCategories
            $scope.$watch(PersonCategoriesService.getPersonCategories,
                function(list) {
                    if (list) {
                        $scope.personCategories = [];
                        angular.forEach(list, function(item) {
                            if (item.id) {
                                $scope.personCategories.push(item);
                            }
                        });
                        $scope.personCategoriesTableParams.reload();
                    }
                });

            ProjektService.resolveProjekt().then(function(projekt) {
                if (projekt) {
                    $scope.projekt = projekt;
                    $scope.logoUrl = $scope.generateLogoUrl();
                    $scope.editMode = false;
                } else {
                    $scope.editMode = true;
                }
                $scope.projectResolved = true;
            }, function(error) {
                console.log('error', error);
            });

            KontoDatenService.resolveKontodaten().then(function(kontodaten) {
                if (kontodaten) {
                    $scope.kontodaten = kontodaten;
                }
            }, function(error) {
                console.log('error', error);
            });

            $scope.switchToEditMode = function() {
                $scope.editMode = true;
            };

            //functions to save, cancel, modify or delete the kundentypen

            $scope.saveKundentyp = function(kundentyp) {
                kundentyp.editable = false;
                $scope.editingKundentypBool = false;
                $scope.kundentyp = new KundentypenModel(kundentyp);
                return $scope.kundentyp.$save();
            };

            $scope.cancelKundentyp = function(kundentyp) {
                if(kundentyp.isNew) {
                    var kundentypIndex = $scope.kundentypen.indexOf(kundentyp);
                    $scope.kundentypen.splice(kundentypIndex, 1);
                }
                if($scope.originalKundentyp) {
                    var isKundentypById = function (element) {
                        return kundentyp.id === element.id;
                    };
                    var originalKundentypIndex = $scope.kundentypen.findIndex(isKundentypById);
                    if(originalKundentypIndex >= 0) {
                        $scope.kundentypen[originalKundentypIndex] = $scope.originalKundentyp;
                    }
                    $scope.originalKundentyp= undefined;
                }
                kundentyp.editable = false;
                $scope.editingKundentypBool = false;
                $scope.kundentypenTableParams.reload();
            };

            $scope.editKundentyp = function(kundentyp) {
                $scope.originalKundentyp = cloneObj(kundentyp);
                kundentyp.editable = true;
                $scope.editingKundentypBool = true;
            };

            $scope.deleteKundentyp = function(kundentyp) {
                kundentyp.editable = false;
                $scope.kundentyp = new KundentypenModel(kundentyp);
                return $scope.kundentyp.$delete();
            };

            $scope.addKundentyp = function() {
                if(!$scope.editingKundentypBool) {
                    if(angular.isUndefined($scope.kundentypen)) {
                        $scope.kundentypen = [];
                    }
                    $scope.editingKundentypBool = true;
                    var newKundentyp = cloneObj(defaults.modelKundentyp);
                    $scope.editingKundentyp = newKundentyp;
                    $scope.editingKundentyp.isNew = true;
                    $scope.kundentypen.unshift(newKundentyp);
                    $scope.kundentypenTableParams.reload();
                }
            };

            //functions to save, cancel, modify or delete the produkteKategorie 

            $scope.saveProduktekategorie = function(produktekategorie) {
                produktekategorie.editable = false;
                $scope.editingProduktekategorieBool = false;
                $scope.produktekategorie = new ProduktekategorienModel(produktekategorie);
                return $scope.produktekategorie.$save();
            };

            $scope.cancelProduktekategorie = function(produktekategorie) {
                if(produktekategorie.isNew) {
                    var produktekategorieIndex = $scope.produktekategorien.indexOf(produktekategorie);
                    $scope.produktekategorien.splice(produktekategorieIndex, 1);
                }
                if($scope.originalProduktekategorie) {
                    var isProduktekategorieById = function (element) {
                        return produktekategorie.id === element.id;
                    };
                    var originalProduktekategorieIndex = $scope.produktekategorien.findIndex(isProduktekategorieById);
                    if(originalProduktekategorieIndex >= 0) {
                        $scope.produktekategorien[originalProduktekategorieIndex] = $scope.originalProduktekategorie;
                    }
                    $scope.produktekategorie = undefined;
                }
                produktekategorie.editable = false;
                $scope.editingProduktekategorieBool = false;
                $scope.produktekategorienTableParams.reload();
            };

            $scope.editProduktekategorie = function(produktekategorie) {
                $scope.originalProduktekategorie = cloneObj(produktekategorie);
                produktekategorie.editable = true;
                $scope.editingProduktekategorieBool = true;
            };

            $scope.deleteProduktekategorie = function(produktekategorie) {
                produktekategorie.editable = false
                $scope.produktekategorie = new ProduktekategorienModel(produktekategorie);
                return $scope.produktekategorie.$delete();
            };

            $scope.addProduktekategorie = function() {
                if(!$scope.editingProduktekategorieBool) {
                    if(angular.isUndefined($scope.produktekategorien)) {
                        $scope.produktekategorien = [];
                    }
                    $scope.editingProduktekategorieBool = true;
                    var newProduktekategorie = cloneObj(defaults.modelProduktekategorie);
                    $scope.editingProduktekategorie = newProduktekategorie;
                    $scope.editingProduktekategorie.isNew = true;
                    $scope.produktekategorien.unshift(newProduktekategorie);
                    $scope.produktekategorienTableParams.reload();
                }
            };

            //functions to save, cancel, modify or delete the PersonCategory 

            $scope.savePersonCategory = function(personCategory) {
                personCategory.editable = false;
                $scope.editingPersonCategoryBool = false;
                $scope.personCategory = new PersonCategoriesModel(personCategory);
                return $scope.personCategory.$save();
            };

            $scope.cancelPersonCategory = function(personCategory) {
                if(personCategory.isNew) {
                    var personCategoryIndex = $scope.personCategories.indexOf(personCategory);
                    $scope.personCategories.splice(personCategoryIndex, 1);
                }
                if($scope.originalPersonCategory) {
                    var isPersonCategoryById = function (element) {
                        return personCategory.id === element.id;
                    };
                    var originalPersonCategoryIndex = $scope.personCategories.findIndex(isPersonCategoryById);
                    if(originalPersonCategoryIndex >= 0) {
                        $scope.personCategories[originalPersonCategoryIndex] = $scope.originalPersonCategory;
                    }
                    $scope.originalPersonCategory = undefined;
                }
                personCategory.editable = false;
                $scope.editingPersonCategoryBool = false;
                $scope.personCategoriesTableParams.reload();
            };

            $scope.editPersonCategory = function(personCategory) {
                $scope.originalPersonCategory = cloneObj(personCategory);
                personCategory.editable = true;
                $scope.editingPersonCategoryBool = true;
            };

            $scope.deletePersonCategory = function(personCategory) {
                personCategory.editable = false;
                $scope.personCategory = new PersonCategoriesModel(personCategory);
                return $scope.personCategory.$delete();
            };

            $scope.addPersonCategory = function() {
                if(!$scope.editingPersonCategoryBool) {
                    if(angular.isUndefined($scope.personCategories)) {
                        $scope.personCategories = [];
                    }
                    $scope.editingPersonCategoryBool = true;
                    var newPersonCategory = cloneObj(defaults.modelPersonCategory);
                    $scope.editingPersonCategory = newPersonCategory;
                    $scope.editingPersonCategory.isNew = true;
                    $scope.personCategories.unshift(newPersonCategory);
                    $scope.personCategoriesTableParams.reload();
                }
            };


            if (!$scope.kundentypenTableParams) {
                //use default tableParams
                $scope.kundentypenTableParams = new NgTableParams({ // jshint ignore:line
                    page: 1,
                    count: 1000,
                    sorting: {
                        name: 'asc'
                    }
                }, {
                    filterDelay: 0,
                    groupOptions: {
                        isExpanded: true
                    },
                    getData: function(params) {
                        if (!$scope.kundentypen) {
                            return;
                        }
                        // use build-in angular filter
                        var orderedData = params.sorting ?
                            $filter('orderBy')($scope.kundentypen, params.orderBy()) :
                            $scope.kundentypen;

                        params.total(orderedData.length);
                        return orderedData;
                    }

                });
            }

            if (!$scope.produktekategorienTableParams) {
                //use default tableParams
                $scope.produktekategorienTableParams = new NgTableParams({ // jshint ignore:line
                    page: 1,
                    count: 1000,
                    sorting: {
                        name: 'asc'
                    }
                }, {
                    filterDelay: 0,
                    groupOptions: {
                        isExpanded: true
                    },
                    getData: function(params) {
                        if (!$scope.produktekategorien) {
                            return;
                        }
                        // use build-in angular filter
                        var orderedData = params.sorting ?
                            $filter('orderBy')($scope.produktekategorien, params.orderBy()) :
                            $scope.produktekategorien;

                        params.total(orderedData.length);
                        return orderedData;
                    }

                });
            }

            if (!$scope.personCategoriesTableParams) {
                //use default tableParams
                $scope.personCategoriesTableParams = new NgTableParams({ // jshint ignore:line
                    page: 1,
                    count: 1000,
                    sorting: {
                        name: 'asc'
                    }
                }, {
                    filterDelay: 0,
                    groupOptions: {
                        isExpanded: true
                    },
                    getData: function(params) {
                        if (!$scope.personCategories) {
                            return;
                        }
                        // use build-in angular filter
                        var orderedData = params.sorting ?
                            $filter('orderBy')($scope.personCategories, params.orderBy()) :
                            $scope.personCategories;

                        params.total(orderedData.length);
                        return orderedData;
                    }

                });
            }

            $scope.saveProjekt = function() {
                return $scope.kontodaten.$save().then($scope.projekt.$save(function(){
                    $scope.projektForm.$setPristine();
                }));
            };

            $scope.logoFile = undefined;
            // upload on file select or drop
            $scope.uploadLogo = function(file) {
                if (!file) {
                    return;
                }
                Upload.upload({
                    url: $scope.logoUrl,
                    data: {
                        file: file
                    }
                }).then(function() {
                    //regenerate logo url to reload image
                    $scope.logoUrl = $scope.generateLogoUrl();
                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                });
            };

            $scope.generateLogoUrl = function() {
                return API_URL + 'projekt/' + $scope.projekt.id + '/logo';
            };

            $scope.downloadImportFile = function() {
                OpenProjektModel.fetchImportFile({
                }, function(file) {
                    FileSaver.saveAs(file.response, 'importFile' + '.ods');
                });
            };

            $scope.downloadStyle = function(style) {
                OpenProjektModel.fetchStyle({
                    style: style
                }, function(file) {
                    FileSaver.saveAs(file.response, style + '.css');
                });
            };

            $scope.uploadStyle = function(file, style) {
                if (!file) {
                    return;
                }
                Upload.upload({
                    url: API_URL + 'projekt/' + $scope.projekt.id + '/' + style,
                    data: {
                        file: file
                    }
                }).then(function() {
                    //regenerate logo url to reload image
                    $scope.logoUrl = $scope.generateLogoUrl();
                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                });
            };

            $scope.localeBCP47Pattern = /^(((([A-Za-z]{2,3}(-([A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-([A-Za-z]{4}))?(-([A-Za-z]{2}|[0-9]{3}))?(-([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-([0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(x(-[A-Za-z0-9]{1,8})+))?)|(x(-[A-Za-z0-9]{1,8})+)|((en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)))$/;
        }
    ]);
