import mysam from 'mysam/browser';
import ui from 'mysam-ui';
import slides from './slides';

const app = mysam();
const sam = ui(document.getElementById('content'), app);

sam.configure(slides);
sam.runAction('slides');

window.sam = sam;
