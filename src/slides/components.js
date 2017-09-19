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
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  componentWillReceiveProps(nextProps) {
    const { text = '' } = nextProps.recognizer.transcript;

    this.setState({ text });
  }

  updateText(ev) {
    const text = ev.target.value;

    this.setState({ text });
  }

  submit(ev) {
    const { onSubmit } = this.props;
    const text = ev.target.querySelector('input').value;

    this.props.recognizer.transcript = {
      text, confidence: 1
    }

    if(typeof onSubmit === 'function') {
      onSubmit(text);
    }

    ev.preventDefault();
  }

  render() {
    const { recognizer, showSubmit } = this.props;
    const { text = '' } = recognizer.transcript;

    return <form onSubmit={this.submit.bind(this)} className='recognizer'>
      <input type='text' value={this.state.text} onChange={this.updateText.bind(this)} />
      <input type='hidden' value={text} />
      <RecognizerButton recognizer={recognizer} />
      {showSubmit ? <button style={{ marginLeft: '10px' }} className='icon-base icon-checkmark' type='submit' /> : null}
    </form>;
  }
}

export const RecognizerButton = observer(RecognizerButtonComponent);
export const RecognizerForm = observer(RecognizerFormComponent);
