import 'intersection-observer';
import cssVars from 'css-vars-ponyfill';

// CSS variables
cssVars();

// SVGElement.contains
if (!SVGElement.prototype.contains) {
    SVGElement.prototype.contains = HTMLDivElement.prototype.contains;
};