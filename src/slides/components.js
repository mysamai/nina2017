import React from 'react';
import { observer } from 'mobx-react';

class RecognizerButtonComponent extends React.Component {
  get recognizer() {
    return this.props.recognizer;
  }

  componentWillUnmount() {
    this.recognizer.teardown();
  }

  render() {
    const { listening } = this.recognizer;
    const className = `icon-base ${listening ? 'icon-mysam-icon' : 'icon-microphone'}`;

    return <button type='button' className={className}
      onClick={() => this.recognizer.toggle()} />;
  }
}

class RecognizerFormComponent extends React.Component {
  submit(ev) {
    const { onSubmit, recognizer } = this.props;
    const text = ev.target.querySelector('input').value;

    recognizer.transcript = {
      text, confidence: 1
    }

    if(typeof onSubmit === 'function') {
      onSubmit(text);
    }

    ev.preventDefault();
  }

  componentDidUpdate() {
    const { text } = this.props.recognizer.transcript;

    if(text) {
      this.input.value = text;
    }
  }

  render() {
    const { recognizer, showSubmit } = this.props;

    return <form onSubmit={this.submit.bind(this)} className='recognizer'>
      <input type='text' ref={input => { this.input = input; }} defaultValue={recognizer.transcript.text} />
      <RecognizerButton recognizer={recognizer} />
      {showSubmit ? <button style={{ marginLeft: '10px' }} className='icon-base icon-checkmark' type='submit' /> : null}
    </form>;
  }
}

export const RecognizerButton = observer(RecognizerButtonComponent);
export const RecognizerForm = observer(RecognizerFormComponent);
