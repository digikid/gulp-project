import $ from 'jquery';
import { Fancybox } from '@fancyapps/ui';

export default id => {
    const { fancybox: settings } = $.settings;

    Fancybox.close();

    Fancybox.show([{
        src: `#modal-${id}`
    }], settings);
};