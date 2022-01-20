import Bowser from 'bowser';

const device = Bowser.parse(window.navigator.userAgent);

export default device;