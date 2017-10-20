import * as React from 'react';
import {
  Button,
  Glyphicon,
} from 'react-bootstrap';

interface IPropsNotifiVersionPopup {
  currV: string;
  nextV: string;
}

const getNotifyCheckVersion: React.SFC<IPropsNotifiVersionPopup> = props => (
    <div className="check-version-notification">
      <div className="text-version-container">
        <div className="one-text-version">
          <span>Текущая версия:</span>
          <span style={{ color: 'red'}}>{props.currV}</span>
        </div>
        <div className="one-text-version">
          <span>Новая версия:</span>
          <span style={{ color: 'green'}}>{props.nextV}</span>
        </div>
      </div>
      <Button onClick={() => global.window.location.reload()}><Glyphicon glyph="refresh"/> Обновить</Button>
    </div>
  );

export default getNotifyCheckVersion;
