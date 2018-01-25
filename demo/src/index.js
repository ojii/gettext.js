// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Immutable from 'immutable';
import po_en from 'raw-loader!./locales/en/LC_MESSAGES/messages.po';
import po_ja from 'raw-loader!./locales/ja/LC_MESSAGES/messages.po';

import English from './locales/en/LC_MESSAGES/messages.mo';
import Japanese from './locales/ja/LC_MESSAGES/messages.mo';

import 'bulma/css/bulma.css'
import gettext from '../../src/runtime';

type Lang = string;

const LOCALES: Immutable.Map<Lang, Translations> = Immutable.Map({
  '': new gettext.Translations(),
  'en': English,
  'ja': Japanese
});
const LANGUAGES = Immutable.List(LOCALES.keys());
const LANGNAMES: Immutable.Map<Lang, string> = Immutable.Map({
  '': 'Reset',
  'en': 'English',
  'ja': 'Japanese'
});

function LangButton({lang, active, onClick}: {lang: Lang, active: Lang, onClick: () => void}) {
  const isActive = lang === active;
  return <span className={classNames('button', {'is-selected': isActive, 'is-info': isActive})} onClick={onClick}>{LANGNAMES.get(lang)}</span>;
}

class Strings extends Component<{gettext: gettext.Translations}, {num: number}> {
  state = {
    num: 0
  };

  render() {
    return (
      <div>
        <p>
          <code>gettext.gettext('simple-string')</code> {this.props.gettext.gettext('simple-string')}
        </p>
        <p>
          <code>gettext.ngettext('singular-string', 'plural-string', {this.state.num})</code> {this.props.gettext.ngettext('singular-string', 'plural-string', this.state.num)}
        </p>
        <input type='number' value={this.state.num} onChange={e => this.setState({num: parseInt(e.target.value, 10)})} />
      </div>
    );
  }
}

class Demo extends Component<{}, {lang: Lang}> {
  state = {
    lang: ''
  };

  render() {
    return (
      <div className="container">
        <h1 className="title">
          Gettext.js Demo
        </h1>
        <div className="container">
          <div className="control">
            <div className="buttons has-addons">
              {LANGUAGES.map(lang => <LangButton key={lang} lang={lang} active={this.state.lang} onClick={() => this.setState({lang: lang})} />)}
            </div>
          </div>
        </div>
        <div className="container">
          <Strings gettext={LOCALES.get(this.state.lang)} />
        </div>
        <div className="container">
          <h2 className="subtitle">English PO file</h2>
          <pre>
            {po_en}
          </pre>
        </div>
        <div className="container">
          <h2 className="subtitle">Japanese PO file</h2>
          <pre>
            {po_ja}
          </pre>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);
