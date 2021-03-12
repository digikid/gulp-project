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
                path: window._MARKERS_PATH || document.location.origin + '/images/',
                default: 'marker',
                active: 'marker-active',
                visited: 'marker-visited',
                extension: 'svg',
                size: [50, 50],
                offset: [-25, -50],
                toggle: false
            },
            onClick: null
        },
        apiKey: null,
        clusters: false,
        lazy: true,
        rootMargin: '200px 0px',
        events: {
            touch: false,
            zoom: false,
            drag: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)
        },
        onRendered: null,
        onMarkerClick: null
    }, options);

    if (!window.maps) {
        window.maps = {};
    };

    if (window.isMapAPIReady === undefined) {
        window.isMapAPIReady = false;
    };

    if (!settings.data) return;

    return this.each(function() {
        var _this = this,
            $this = $(this),
            id = $(this).attr('data-map-id') || $(this).attr('id').replace('#', ''),
            single = $this.attr('data-single') !== undefined,
            zoom = $this.attr('data-map-zoom') || settings.zoom,
            itemId = +$this.attr('data-object-id') || +$this.attr('data-item-id'),
            apiKey = $(this).attr('data-api-key') || settings.apiKey;

        _this.data = itemId && single ? settings.data.filter(function(item) {
            return +item.id === itemId;
        }) : settings.data;

        _this.waitAPI = function() {
            if (window.ymaps && window.ymaps.Map) {
                window.isMapAPIReady = true;
                _this.render();
            } else {
                setTimeout(_this.waitAPI, 200);
            };
        };

        _this.init = function() {
            var apiURL = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU' + (apiKey ? '&amp;apikey=' + apiKey : '');

            $this.removeClass('is-ready');

            if (!window.isMapAPIReady) {
                $.getScript(apiURL, _this.waitAPI);
            } else {
                _this.render();
            };

            $(window).resize(_this.resizeListeners).trigger('resize');
        };

        _this.addMarkers = function() {
            if (!settings.markers) return;

            _this.markers = [];

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

            $.each(_this.data, function(i, object) {
                var properties = settings.markers.content.id ? {
                        iconContent: settings.markers.content.before + object[settings.markers.content.id] + settings.markers.content.after
                    } : {};

                var options = settings.markers.content.id ? {
                        iconLayout: layout.default.layout,
                        iconPane: 'overlaps'
                    } : {
                        iconLayout: 'default#image',
                        iconImageHref: +object.id === itemId ? layout.active.image : layout.default.image,
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
                        settings.markers.onClick(markerObject, window.maps[id], $this);
                    };
                });

                _this.markers.push(marker);

                window.maps[id].markers.push(markerObject);
                window.maps[id].map.geoObjects.add(marker);
            });
        };

        _this.addClusters = function() {
            if (!settings.clusters || !settings.markers || _this.data.length < 2) return;

            var clusterer = new ymaps.Clusterer({
                hasBalloon: false,
                hasHint: false,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false,
                clusterIconLayout: ymaps.templateLayoutFactory.createClass('<div class="map__cluster">{{ properties.geoObjects.length }}</div>'),
                clusterIconShape: {
                    type: 'Rectangle',
                    coordinates: [[0, 0], [50, 36]]
                }
            });

            clusterer.add(_this.markers);

            window.maps[id].map.geoObjects.add(clusterer);

            if (itemId && window.matchMedia('(min-width: 768px)').matches) {
                var zoom = window.maps[id].map.getZoom(),
                    center = _this.data.filter(function(item) {
                        return +item.id === itemId;
                    });

                if (center.length) {
                    center = center[0].coords;

                    window.maps[id].map.setCenter(center, zoom, {
                        checkZoomRange: true
                    });
                };
            } else {
                window.maps[id].map.setBounds(clusterer.getBounds(), {
                    checkZoomRange: true
                });
            };
        };

        _this.centerize = function() {
            if (_this.data.length < 2 || settings.clusters) return;

            var zoom = window.maps[id].map.getZoom();

            window.maps[id].map.setBounds(window.maps[id].map.geoObjects.getBounds());
            window.maps[id].map.setZoom(zoom - 1);
        };

        _this.setOffset = function(offset) {
            var offset = offset || settings.offset;

            if (!(offset instanceof Array) || offset.length !== 2) return;

            var center = window.maps[id].map.getCenter(),
                zoom = window.maps[id].map.getZoom();

            var pixelCenter = [
                window.maps[id].map.getGlobalPixelCenter(center)[0] - offset[0],
                window.maps[id].map.getGlobalPixelCenter(center)[1] - offset[1]
            ];

            var geoCenter = window.maps[id].map.options.get('projection').fromGlobalPixels(pixelCenter, zoom);

            window.maps[id].map.setCenter(geoCenter);
        };

        _this.initMapEvents = function() {
            if (settings.events) {
                if (!settings.events.touch) {
                    window.maps[id].map.behaviors.disable('multiTouch');
                };

                if (!settings.events.zoom) {
                    window.maps[id].map.behaviors.disable('scrollZoom');
                };

                if (!settings.events.drag) {
                    window.maps[id].map.behaviors.disable('drag');
                };
            } else {
                window.maps[id].map.behaviors.disable('multiTouch');
                window.maps[id].map.behaviors.disable('multiTouch');
                window.maps[id].map.behaviors.disable('drag');
            };
        };

        _this.waitLoading = function() {
            var layer = window.maps[id].map.layers.get(0).get(0);

            _this.waitForTilesLoad(layer).then(function() {
                if (typeof settings.onRendered === 'function') {
                    return new Promise(function(resolve, reject) {
                        settings.onRendered(window.maps[id], $this);
                        resolve();
                    }).then(function() {
                        _this.show();
                    });
                } else {
                    _this.show();
                };
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

        _this.render = function() {
            window.ymaps.ready(function() {
                window.maps[id] = {
                    id: id,
                    $el: $this,
                    map: new ymaps.Map(_this, {
                        center: _this.data[0].coords,
                        zoom: zoom,
                        controls: settings.controls
                    }, {
                        searchControlProvider: 'yandex#search'
                    }),
                    markers: [],
                    setOffset: _this.setOffset
                };

                _this.addMarkers();
                _this.addClusters();
                _this.centerize();
                _this.setOffset();

                if (!$this.closest('.modal').length) {
                    _this.initMapEvents();
                };

                _this.waitLoading();
            });
        };

        _this.show = function() {
            $this.addClass('is-ready');
        };

        _this.destroy = function() {
            window.maps[id].map.destroy();
            delete window.maps[id];
        };

        if (id in window.maps) {
            _this.destroy();
            _this.init();
        } else {
            if (settings.lazy && window.lozad) {
                var observer = lozad(_this, {
                    rootMargin: settings.rootMargin,
                    loaded: function() {
                        _this.init();
                    }
                });
                observer.observe();
            } else {
                _this.init();
            };
        };
    });
};
