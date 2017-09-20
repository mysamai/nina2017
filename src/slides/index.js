import React from 'react';
import * as slides from './slides';

export default function (sam) {
  const order = [
    'splash',
    'about',
    'iceland',
    'speechRecognition',
    'tokenize',
    'stem',
    'combine',
    'featurize',
    'train',
    'classify',
    'summary',
    'coc',
    'conclusion'
  ];

  let currentSlide = -1;

  const showSlide = offset => {
    const content = document.getElementById('content');
    const oldSlide = currentSlide;

    content.className = content.className.replace(' home', '');

    if(offset === 'previous') {
      currentSlide = Math.max(currentSlide - 1, 0);
    } else if(offset === 'next') {
      currentSlide = Math.min(currentSlide + 1, order.length - 1);
    } else {
      currentSlide = 0;
    }

    if(currentSlide === oldSlide) {
      return;
    }

    const slideName = order[currentSlide];
    const Slide = slides[slideName];

    sam.render(<div className={`slide ${slideName}`}>
      <Slide />
    </div>, sam.element);
  };

  window.document.addEventListener('keydown', event => {
    const tag = event.target.tagName.toLowerCase();

    if(tag === 'input' || tag === 'textarea') {
      return;
    }
    
    if(event.code === 'ArrowRight') {
      showSlide('next');
    } else if(event.code === 'ArrowLeft') {
      showSlide('previous');
    }
  });

  sam.action('slides', (el, classification) => {
    showSlide();
  });
}
