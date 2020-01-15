import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

type IPropsNotifiVersionPopup = {
  currV: string;
  nextV: string;
};

const NotifyCheckVersion: React.FC<IPropsNotifiVersionPopup> = (props) => (
  <div className="check-version-notification">
    <div className="text-version-container">
      <div className="one-text-version">
        <span>Текущая версия:</span>
        <span style={{ color: UiConstants.colorError}}>{props.currV}</span>
      </div>
      <div className="one-text-version">
        <span>Актуальная версия:&nbsp;</span>
        <span style={{ color: 'green'}}>{props.nextV}</span>
      </div>
    </div>
    <EtsBootstrap.Button onClick={() => global.window.location.reload()}><EtsBootstrap.Glyphicon glyph="refresh"/> Обновить</EtsBootstrap.Button>
  </div>
);

export default NotifyCheckVersion;
