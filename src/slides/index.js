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

  window.document.addEventListener('keydown', event => {
    const tag = event.target.tagName.toLowerCase();
    const oldSlide = currentSlide;

    if(tag === 'input' || tag === 'textarea') {
      return;
    }
    
    if(event.code === 'ArrowRight') {
      currentSlide = Math.min(slideOrder.length - 1, currentSlide + 1);
    } else if(event.code === 'ArrowLeft') {
      currentSlide = Math.max(0, currentSlide - 1);
    }

    if(currentSlide !== oldSlide) {
      sam.runAction('slides', {
        action: {
          slide: slideOrder[currentSlide]
        }
      });
    }
  });

  sam.learn('slides', {
    description: 'Show slide',
    form (classification = {}) {
      const action = classification.action || {};

      return <select className='slide' defaultValue={action.slide}>
        {slideOrder.map(name =>
          <option value={name} key={name}>{name}</option>
        )}
      </select>;
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

    if(slide === 'splash') {
      content.className += ' home';
    }

    const teardown = sam.render(<div className={`slide ${slide}`}>
      <Slide />
    </div>, sam.element);

    return function() {
      content.className = content.className.replace(' home', '');
      teardown();
    }
  });
}
