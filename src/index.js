import mysam from 'mysam-ui';
import slides from './slides';

const sam = window.sam = mysam(document.getElementById('content'));

sam.configure(slides);
sam.runAction('slides');
