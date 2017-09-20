import { extendObservable } from 'mobx';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer'

const stem = (sentence, keepStops = true) => {
  return PorterStemmer.tokenizeAndStem(
    sentence.toLowerCase(), keepStops
  );
};

export default class Featurizer {
  constructor() {
    extendObservable(this, {
      sentences: [
        'I like lasagna',
        'I don\'t like JIRA'
      ]
    });
  }

  get combined() {
    return uniq(flatten(this.sentences.map(
      current => stem(current)
    )));
  }

  get stems() {
    return this.sentences.map(
      current => stem(current)
    );
  }

  get featurized() {
    return this.stems.map(current =>
      this.featurize(current)
    );
  }

  featurize(content) {
    const tokens = typeof content === 'string'
      ? stem(content) : content;

    return this.combined.map(current =>
      tokens.indexOf(current) === -1 ? 0 : 1
    );
  }
};

Featurizer.stem = stem;
