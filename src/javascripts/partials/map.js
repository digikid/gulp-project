$.fn.renderMap = function(options) {

    var settings = $.extend(true, {}, {
        data: null,
        zoom: 10,
        controls: [],
        offset: [],
        markers: {
            layout: {
                cssClass: 'map__marker',
                cssClassActive: 'map__marker is-active',
                cssClassVisited: 'map__marker is-visited',
                toggle: false
            },
            content: {
                id: null,
                before: '',
                after: ''
            },
            image: {
                path: document.location.origin + '/images/',
                default: 'marker',
                active: 'marker-active',
                visited: 'marker-visited',
                extension: 'svg',
                size: [50, 50],
                offset: [0, -50],
                toggle: false
            },
            onClick: null
        },
        lazy: true,
        rootMargin: '200px 0px',
        disableTouch: true,
        disableZoom: true,
        onRendered: null,
        onMarkerClick: null
    }, options);

    if (window.isMapAPIReady === undefined) {
        window.isMapAPIReady = false;
    };

    return this.each(function() {
        var _this = this,
            $this = $(this),
            id = $(this).attr('data-map-id') || $(this).attr('id').replace('#', '');

        _this.waitAPI = function() {
            window.isMapAPIReady = true;
            if (window.ymaps && window.ymaps.Map) {
                _this.render();
            } else {
                setTimeout(_this.waitAPI, 200);
            };
        };

        _this.init = function() {
            if (!window.isMapAPIReady) {
                $.getScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', _this.waitAPI);
            } else {
                _this.render();
            };
            $(window).resize(_this.resizeListeners).trigger('resize');
        };

        _this.addMarkers = function() {
            var layout = {
                default: {
                    image: settings.markers.image.path + settings.markers.image.default + '.' + settings.markers.image.extension,
                    layout: ymaps.templateLayoutFactory.createClass('<div class="' + settings.markers.layout.cssClass + '">$[properties.iconContent]</div>')
                },
                active: {
                    image: settings.markers.image.path + settings.markers.image.active + '.' + settings.markers.image.extension,
                    layout: ymaps.templateLayoutFactory.createClass('<div class="' + settings.markers.layout.cssClassActive + '">$[properties.iconContent]</div>')
                },
                visited: {
                    image: settings.markers.image.path + settings.markers.image.visited + '.' + settings.markers.image.extension,
                    layout: ymaps.templateLayoutFactory.createClass('<div class="' + settings.markers.layout.cssClassVisited + '">$[properties.iconContent]</div>')
                }
            };

            $.each(settings.data, function(i, object) {
                var properties = settings.markers.content.id ? {
                        iconContent: settings.markers.content.before + object[settings.markers.content.id] + settings.markers.content.after
                    } : {};

                var options = settings.markers.content.id ? {
                        iconLayout: layout.default.layout,
                        iconPane: 'overlaps'
                    } : {
                        iconLayout: 'default#image',
                        iconImageHref: (settings.data.length > 1 && i === 0) ? layout.active.image : layout.default.image,
                        iconImageSize: settings.markers.image.size,
                        iconImageOffset: settings.markers.image.offset
                    };

                var marker = new ymaps.Placemark(object.coords, properties, options);

                var markerObject = {
                    id: object.id.toString(),
                    marker: marker,
                    visited: false
                };

                marker.events.add('click', function () {
                    markerObject.visited = true;

                    if (settings.markers.layout.toggle || settings.markers.image.toggle) {
                        $.each(window.maps[id].markers, function(i, marker) {
                            var iconLayout, iconImage;

                            if (marker.id === object.id.toString()) {
                                iconLayout = layout.active.layout;
                                iconImage = layout.active.image;
                            } else if (marker.visited) {
                                iconLayout = layout.visited.layout;
                                iconImage = layout.visited.image;
                            };

                            if (settings.markers.content.id) {
                                if (iconLayout) {
                                    marker.marker.options.set('iconLayout', iconLayout);
                                };
                            } else {
                                if (iconImage) {
                                    marker.marker.options.set('iconImageHref', iconImage);
                                };
                            };
                        });
                    };

                    if (typeof settings.markers.onClick === 'function') {
                        settings.markers.onClick(markerObject, window.maps[id]);
                    };
                });

                window.maps[id].markers.push(markerObject);
                window.maps[id].map.geoObjects.add(marker);
            });
        };

        _this.setOffset = function(offset) {
            if (offset.length !== 2) return;

            var center = window.maps[id].map.getCenter(),
                zoom = window.maps[id].map.getZoom();

            var pixelCenter = [
                window.maps[id].map.getGlobalPixelCenter(center)[0] - offset[0],
                window.maps[id].map.getGlobalPixelCenter(center)[1] - offset[1]
            ];

            var geoCenter = window.maps[id].map.options.get('projection').fromGlobalPixels(pixelCenter, zoom);

            window.maps[id].map.setCenter(geoCenter);
        };

        _this.render = function() {
            window.ymaps.ready(function() {

                if (window.maps === undefined) {
                    window.maps = {};
                };

                if (!(id in window.maps)) {
                    window.maps[id] = {
                        id: id,
                        map: null,
                        markers: [],
                        setOffset: _this.setOffset
                    };
                };

                if (!settings.data || window.maps[id].map !== null) {
                    return;
                };

                // render map layout
                window.maps[id].map = new ymaps.Map(_this, {
                    center: settings.data[0].coords,
                    zoom: settings.zoom,
                    controls: settings.controls
                }, {
                    searchControlProvider: 'yandex#search'
                });

                // add markers
                if (settings.markers) {
                    _this.addMarkers();
                };

                // centerize map
                if (settings.data.length > 1) {
                    var zoom = window.maps[id].map.getZoom();

                    window.maps[id].map.setBounds(window.maps[id].map.geoObjects.getBounds());
                    window.maps[id].map.setZoom(zoom - 1);
                };

                // move map center
                if (Array.isArray(settings.offset) && settings.offset.length === 2) {
                    _this.setOffset(settings.offset);
                };

                // disable touch event
                if (settings.disableTouch) {
                    window.maps[id].map.behaviors.disable('multiTouch');
                };

                // disable zoom event
                if (settings.disableZoom) {
                    window.maps[id].map.behaviors.disable('scrollZoom');
                };

                // disable drag event on mobile devices
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    window.maps[id].map.behaviors.disable('drag');
                };

                var layer = window.maps[id].map.layers.get(0).get(0);

                _this.waitForTilesLoad(layer).then(function() {
                    if (typeof settings.onRendered === 'function') {
                        return new Promise(function(resolve, reject) {
                            settings.onRendered(window.maps[id]);
                            resolve();
                        }).then(function() {
                            _this.show();
                        });
                    } else {
                        _this.show();
                    };
                });
            });
        };

        _this.getTileContainer = function(layer) {
            for (var k in layer) {
                if (layer.hasOwnProperty(k)) {
                    if (
                        layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer ||
                        layer[k] instanceof ymaps.layer.tileContainer.DomContainer
                    ) {
                        return layer[k];
                    };
                };
            };
            return null;
        };

        _this.waitForTilesLoad = function(layer) {
            return new ymaps.vow.Promise(function(resolve, reject) {
                var tc = _this.getTileContainer(layer),
                    readyAll = true;
                tc.tiles.each(function(tile, number) {
                    if (!tile.isReady()) {
                        readyAll = false;
                    };
                });
                if (readyAll) {
                    resolve();
                } else {
                    tc.events.once('ready', function() {
                        resolve();
                    });
                };
            });
        };

        _this.show = function() {
            $this.addClass('is-ready');
        };

        if (settings.lazy) {
            lozad(_this, {
                rootMargin: settings.rootMargin,
                loaded: function(el) {
                    _this.init();
                }
            }).observe();
        } else {
            _this.init();
        };
    });
};
