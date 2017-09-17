import React from 'react';
import { observer } from 'mobx-react';

class RecognizerButtonClass extends React.Component {
  get recognizer() {
    return this.props.recognizer;
  }

  componentWillUnmount() {
    this.recognizer.teardown();
  }

  render() {
    const { listening } = this.recognizer;
    const className = `icon-base ${listening ? 'icon-mysam-icon' : 'icon-microphone'}`;

    return <button onClick={() => this.recognizer.toggle()}
      className={className} />;
  }
}

export const RecognizerButton = observer(RecognizerButtonClass);
