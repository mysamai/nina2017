import React from 'react';
import { observer } from 'mobx-react';
import Highlight from 'react-highlight';
import PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer';
import Tokenizer from 'natural/lib/natural/tokenizers/aggressive_tokenizer';
import Recognizer from 'mysam-ui/src/recognizer';

import { RecognizerButton } from './components';

export function splash() {
  return <h1 className='animated fadeIn'>
    When AI makes mistakes
  </h1>;
}

export function about() {
  return <div>
    <img src='assets/profile.jpeg' />
    <h1>David Luecke</h1>
    <h2>
      <a href=''>@daffl</a>
      <a href=''>daffl</a>
    </h2>
  </div>;
}

export function iceland() {
  return <iframe width='85%' height='90%' src='https://www.youtube.com/embed/C1Hld-ONeFA?start=488&end=518' frameBorder='0' allowfullscreen></iframe>;
}

export function speechRecognition() {
  const r = new Recognizer({
    continuous: true,
    interimResults: false
  });

  const Slide = observer(() =>
    <div className='padded'>
    <h1>HTML5 can hear  you</h1>
    <Highlight className="js">{`
      var recognition = new webkitSpeechRecognition();
      recognition.onresult = function(event) {
        console.log(event)
      }
      recognition.start();
    `}</Highlight>
    <RecognizerButton recognizer={r} />
    <p>{r.transcript.text || <br />}</p>
  </div>);

  return <Slide recognizer={r} />
}

export function tokenize() {

}
