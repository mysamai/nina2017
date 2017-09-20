import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Highlight from 'react-highlight';
import brain from 'brain.js';
import PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer';
import Tokenizer from 'natural/lib/natural/tokenizers/aggressive_tokenizer';
import Recognizer from 'mysam-ui/src/recognizer';

import Featurizer from './featurizer';
import { RecognizerButton, RecognizerForm } from './components';

const features = new Featurizer();

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
  return <iframe width='85%' height='90%' src='https://www.youtube.com/embed/C1Hld-ONeFA?start=488&end=518' frameBorder='0' allowFullScreen></iframe>;
}

export function speechRecognition() {
  const r = new Recognizer({
    continuous: true,
    interimResults: true
  });

  const Slide = observer(() => <div className='padded'>
    <h1>HTML5 can hear  you</h1>
    <Highlight className="js">{
`var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
  console.log(event)
}
recognition.start();`
    }</Highlight>
    <RecognizerButton recognizer={r} />
    <p>{r.transcript.text || <br />}</p>
  </div>);

  return <Slide />
}

export function tokenize() {
  const r = new Recognizer();
  const Slide = observer(() => {
    const { text = '' } = r.transcript;

    const tokenized = new Tokenizer().tokenize(text.toLowerCase());

    return <div className='padded'>
      <h1>Tokenize</h1>
      <input type="text" value={text} />
      <RecognizerButton recognizer={r} />
      <Highlight className="js">{
`const tokens = new Tokenizer().tokenize('${text.toLowerCase()}');

${JSON.stringify(tokenized)}`
      }</Highlight>
    </div>;
  });

  return <Slide />;
}

export function stem() {
  const r = new Recognizer();
  const Slide = observer(() => {
    const { text = '' } = r.transcript;
    const sentence = text.toLowerCase();

    const stemmed = Featurizer.stem(sentence, false);
    const stemmedAll = Featurizer.stem(sentence, true);

    return <div className='padded'>
      <h1>Stem</h1>
      <p>Create the word stem for each token</p>
      <RecognizerForm recognizer={r} />
      <Highlight className="js">{
`// All word stems
${JSON.stringify(stemmedAll)}

// Without stop words
${JSON.stringify(stemmed)}`
      }</Highlight>
    </div>;
  });

  return <Slide />;
}

export function combine() {
  const r = new Recognizer();
  const { sentences } = features;

  const Slide = observer(() => {
    const stemmedSentences = sentences.map(current => `
// ${current}
${JSON.stringify(Featurizer.stem(current))}
    `).join('');

    return <div className='padded'>
      <h1>Combine tokens</h1>
      <RecognizerForm recognizer={r} showSubmit
        onSubmit={text => sentences.push(text)} />
      <Highlight className="js">{
`${stemmedSentences}
// Combined tokens
${JSON.stringify(features.combined)}`
      }</Highlight>
    </div>
  });

  return <Slide />;
}

export function featurize() {
  const Slide = observer(() => {
    const featurized = features.sentences.map(sentence => {
      const stem = Featurizer.stem(sentence);

return `// ${sentence}
${JSON.stringify(stem)}
${JSON.stringify(features.featurize(stem))}
`;
    }).join('\n');

    return <div className='padded'>
      <h1>Featurize</h1>
      <Highlight className="js">{
`// Combined tokens
${JSON.stringify(features.combined)}

${featurized}`
      }</Highlight>
    </div>
  });

  return <Slide />;
}

export function train() {
  const Slide = observer(() => {
    const inputs = features.stems.map((tokens, index) => {
      const label = index % 2 ? 'bad' : 'good';
return `
  // ${JSON.stringify(tokens)}
  { input: ${JSON.stringify(features.featurize(tokens))}, output: { ${label}: 1 } }`
    });

    return <div className='padded'>
      <h1>Label and train</h1>
      <Highlight className="js">{
`const brain = require('brain.js');
const net = new brain.NeuralNetwork();

net.train([${inputs.join(',\n')}
]);`
      }</Highlight>
    </div>;
  });

  return <Slide />
}

export function classify() {
  const r = new Recognizer();
  const net = new brain.NeuralNetwork();
  const trainings = features.stems.map((tokens, index) => {
    const label = index % 2 ? 'bad' : 'good';
    return {
      input: features.featurize(tokens),
      output: { [label]: 1 }
    };
  });

  net.train(trainings);

  const Slide = observer(() => {
    const { text = '' } = r.transcript;
    const stemmed = Featurizer.stem(text);
    const featurized = features.featurize(stemmed);

    return <div className='padded'>
      <h1>Classify</h1>
      <RecognizerForm recognizer={r} />
      <Highlight className="js">{
`// ${JSON.stringify(features.combined)}
// ${JSON.stringify(stemmed)}

net.run(${JSON.stringify(featurized)})

${JSON.stringify(net.run(featurized), null, '  ')}`
      }</Highlight>
    </div>;
  });

  return <Slide />;
}

export function summary() {
  return <div className='padded'>
    <ul>
      <li>You don't need always need huge datasets for machine learning</li>
    </ul>
  </div>;
}

export function coc() {
  return <div className='padded'>
    <h2><i>
      "Software that learns doesn't break, it makes mistakes
    </i></h2>

    <img src='assets/slacklog.png' alt='Sadly the Robot assistant did not read the CoC :p' />
  </div>;
}

export function conclusion() {
  return <div className='padded'>
    <ul>
      <li>Can we make Machine Learning more accessible?</li>
      <li>How will we relate to technology that learns?</li>
      <li>What is its User Experience?</li>
      <li>What does it mean when data becomes the technology?</li>
    </ul>
  </div>;
}
