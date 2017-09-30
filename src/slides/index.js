import React from 'react';
import * as slides from './slides';

const slideOrder = [
  'splash',
  'about',
  'link',
  'iceland',
  'speechRecognition',
  'brainjs',
  'tokenize',
  'stem',
  'combine',
  'featurize',
  'train',
  'classify',
  'naturalBrain',
  'mysam',
  'lessons',
  'coc',
  'conclusion'
];

export default function (sam) {
  let currentSlide = 0;

  const updateSlide = direction => {
    const oldSlide = currentSlide;

    if(direction === 'next') {
      currentSlide = Math.min(slideOrder.length - 1, currentSlide + 1);
    } else if(direction === 'previous') {
      currentSlide = Math.max(0, currentSlide - 1);
    }

    if(currentSlide !== oldSlide) {
      sam.runAction('slides', {
        action: {
          slide: slideOrder[currentSlide]
        }
      });
    }
  }

  const socket = io('http://localhost:8899', {
    transports: [ 'websocket' ],
    reconnectionAttempts: 2,
    timeout: 1000
  });

  socket.on('flic-action created', data => {
    switch(data.type) {
      case 'click':
        sam.activeRecognizer.toggle();
        break;
      case 'doubleclick':
        updateSlide('next');
        break;
    }
  });

  window.document.addEventListener('keydown', event => {
    const tag = event.target.tagName.toLowerCase();

    if(tag === 'input' || tag === 'textarea') {
      return;
    }
    
    if(event.code === 'ArrowRight') {
      updateSlide('next');
    } else if(event.code === 'ArrowLeft') {
      updateSlide('previous');
    }
  });

  sam.learn('slides', {
    description: 'Show slide',
    form (classification = {}) {
      const action = classification.action || {};

      return <div>
        <select className='slide' defaultValue={action.slide}>
          {slideOrder.map(name =>
            <option value={name} key={name}>{name}</option>
          )}
        </select>
      </div>;
    },
    onSubmit (form) {
      return {
        slide: form.querySelector('.slide').value
      };
    }
  });

  sam.action('slides', (el, classification = {}) => {
    const action = (classification && classification.action) || {};
    const { slide = 'splash' } = action;
    const Slide = slides[slide];
    const content = document.getElementById('content');
    const setRecognizer = recognizer => {
      sam.activeRecognizer = recognizer;
      return recognizer;
    }

    currentSlide = slideOrder.indexOf(slide);
    sam.activeRecognizer = sam.recognizer;

    if(slide === 'splash') {
      content.className += ' home';
    }

    const teardown = sam.render(<div className={`slide ${slide}`}>
      <Slide {... { sam, classification, setRecognizer }} />
    </div>, sam.element);

    return function() {
      content.className = content.className.replace(' home', '');
      teardown();
    }
  });
}
