import mode from './mode';

const paths = {
    templates: `${origin}/templates`,
    markers: `${origin}/images/markers`
};

if (mode === 'demo') {
    paths.templates = 'path/to/demo/templates';
    paths.markers = 'path/to/demo/markers';
};

if (mode === 'build') {
    paths.templates = 'path/to/build/templates';
    paths.markers = 'path/to/build/markers';
};

export default paths;