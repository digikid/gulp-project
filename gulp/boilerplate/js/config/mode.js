const { hostname, port } = location;

const mode = (hostname === 'localhost' || hostname === '127.0.0.1' || port === '9002') ? 'local' : (hostname === 'demo.relevant.ru') ? 'demo' : 'build';

export default mode;