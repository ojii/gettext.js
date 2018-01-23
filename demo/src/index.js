// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Immutable from 'immutable';
import Gettext, {load} from '../../src/gettext';

import po_en from 'raw-loader!./locales/en/LC_MESSAGES/messages.po';
import po_ja from 'raw-loader!./locales/ja/LC_MESSAGES/messages.po';

import 'bulma/css/bulma.css'

type Lang = string;

const LANGUAGES: Immutable.List<Lang> = Immutable.List(['', 'ja', 'en']);
const LANGNAMES: Immutable.Map<Lang, string> = Immutable.Map({
  '': 'Reset',
  'en': 'English',
  'ja': 'Japanese'
});

function LangButton({lang, active, onClick}: {lang: Lang, active: Lang, onClick: () => void}) {
  const isActive = lang === active;
  return <span className={classNames('button', {'is-selected': isActive, 'is-info': isActive})} onClick={onClick}>{LANGNAMES.get(lang)}</span>;
}

class Example extends Component<{locale: gettext.Gettext}, {num: number}> {
  state = {
    num: 0
  };

  render() {
    console.log(this.props.locale.catalog);
    return (
      <div>
        <p>
          <code>gettext.gettext('simple-string')</code> {this.props.locale.gettext('simple-string')}
        </p>
        <p>
          <code>gettext.ngettext('singular-string', 'plural-string', {this.state.num})</code> {this.props.locale.ngettext('singular-string', 'plural-string', this.state.num)}
        </p>
        <input type='number' value={this.state.num} onChange={e => this.setState({num: parseInt(e.target.value, 10)})} />
      </div>
    );
  }
}

class Strings extends Component<{lang: Lang}, {translations: Immutable.Map<Lang, gettext.Gettext>}> {
  state = {
    translations: Immutable.Map({
      '': new Gettext()
    })
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    LANGUAGES.map(lang => {
      if (!lang.length) return;
      load(`src/locales/${lang}/LC_MESSAGES/messages.mo`).then(locale => this.safeSetState(state => {
        return {
          translations: state.translations.set(lang, locale)
        };
      }));
    })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  safeSetState(...args) {
    if (!this.mounted) return;
    this.setState(...args);
  }

  get loaded() {
    return this.state.translations.size === LANGUAGES.size;
  }

  render() {
    return this.loaded ? <Example locale={this.state.translations.get(this.props.lang)} /> : <span>Loading...</span>;
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
          <Strings lang={this.state.lang} />
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
