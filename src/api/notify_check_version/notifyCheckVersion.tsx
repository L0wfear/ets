import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import EtsThemeProvider from 'components/new/ui/@bootstrap/EtsThemeProvider';

interface IPropsNotifiVersionPopup {
  currV: string;
  nextV: string;
}

const NotifyCheckVersion: React.FC<IPropsNotifiVersionPopup> = (props) => (
  <EtsThemeProvider>
    <div className="check-version-notification">
      <div className="text-version-container">
        <div className="one-text-version">
          <span>Текущая версия:</span>
          <span style={{ color: 'red'}}>{props.currV}</span>
        </div>
        <div className="one-text-version">
          <span>Новая версия:&nbsp;</span>
          <span style={{ color: 'green'}}>{props.nextV}</span>
        </div>
      </div>
      <EtsBootstrap.Button onClick={() => global.window.location.reload()}><EtsBootstrap.Glyphicon glyph="refresh"/> Обновить</EtsBootstrap.Button>
    </div>
  </EtsThemeProvider>
);

export default NotifyCheckVersion;
