import mysam from 'mysam';
import ui from 'mysam-ui';
import slides from './slides';

const app = mysam();
const sam = window.sam = ui(document.getElementById('content'), app);

sam.configure(slides);
sam.runAction('slides');
