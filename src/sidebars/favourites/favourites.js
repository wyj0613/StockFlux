﻿(function() {
    'use strict';

    angular.module('openfin.favourites', ['openfin.store', 'openfin.quandl'])
        .controller('FavouritesCtrl', ['storeService', 'quandlService', function(storeService, quandlService) {
            var self = this;
            self.stocks = [];

            var icons = {
                up: 'glyphicon-triangle-top',
                down: 'glyphicon-triangle-bottom'
            };

            var bellColours = {
                on: '#42D8BD',
                off: '#1A1F26'
            };

            self.icon = function(stock) {
                return stock.delta < 0 ? icons.down : icons.up;
            };

            self.bellStyle = function(stock) {
                return stock.notification ? bellColours.on : bellColours.off;
            };

            self.bellClick = function(stock) {
                stock.notification = !stock.notification;
            };

            var favourites = storeService.get();

            favourites.map(function(favourite) {
                quandlService.getData(favourite, function(stock) {
                    var data = stock.data[0],
                        price,
                        delta,
                        percentage;

                    if (data) {
                        price = data.close;
                        delta = data.close - data.open;
                        percentage = delta / data.open * 100;

                        self.stocks.push({
                            name: stock.name,
                            code: stock.code,
                            price: price,
                            delta: delta,
                            percentage: Math.abs(percentage),
                            notification: false
                        });
                    }
                });
            });
        }])
        .directive('favourite', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/favourite-preview.html',
                link: function(scope, element, attrs) {
                    var tearElement = element[0].getElementsByClassName('tear')[0];

                    fin.desktop.main(function() {
                        function createConfig() {
                            return {
                                'name': 'duplicate-demo' + Math.random(),
                                'maxWidth': 226,
                                'maxHeight': 119,
                                'defaultWidth': 226,
                                'defaultHeight': 119,
                                'width': 226,
                                'height': 119,
                                'autoShow': false,
                                'url': 'tearout/tearout.html',
                                'frame': false,
                                'resizable': false,
                                'maximizable': false
                            }
                        }

                        tearout.initialise({
                            element: tearElement,
                            tearoutWindow: new fin.desktop.Window(createConfig()),
                            dropTarget: tearElement.parentNode
                        });
                    });
                },
                scope: {
                    stock: '=',
                    icon: '&',
                    bellStyle: '&',
                    bellClick: '&'
                }
            }
        }]);
}());
