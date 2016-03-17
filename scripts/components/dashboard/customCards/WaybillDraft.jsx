import React from 'react';
import Div from '../../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import WaybillClosed from './WaybillClosed.jsx';

export default class WaybillDraft extends WaybillClosed {

  constructor(props) {
    super(props);
  }

  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => (
          <li key={i} className="pointer" onClick={this.action.bind(this, item)}>
            {`№${item.data.waybill_number}`}
          </li>
        ))}
      </ul>
    );
  }

}
