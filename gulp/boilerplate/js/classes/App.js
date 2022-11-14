import $ from 'jquery';

import Component from './Component';

export default class App {
    static constructors = [];

    constructor() {
        this.data = {};
        this.components = {};
    };

    registerComponents() {
        App.constructors.forEach(([Component, options]) => {
            const component = new Component(...options);

            if (component instanceof Component) {
                const { id } = component;

                if (typeof id === 'string') {
                    this.components[id] = component;
                };
            };
        });
    };

    init = (cb) => {
        const { registerComponents } = this;

        $(function() {
            registerComponents.call(this);

            if (typeof cb === 'function') {
                cb.call(this);
            };
        }.bind(this));
    };

    use = (Component, ...options) => {
        if (typeof Component === 'function') {
            App.constructors.push([Component, options]);
        };
    };
};