import React from 'react';
import Div from '../../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import FaxogrammMissionsFormWrap from '../../directories/faxogramm/FaxogrammMissionsFormWrap.jsx';
import WaybillClosed from './WaybillClosed.jsx';

export default class WaybillActive extends WaybillClosed {

  constructor(props) {
    super(props);
  }

  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => (
          <li key={i} className="pointer" onClick={this.action.bind(this, item)}>
            {`№${item.data.waybill_number} (${item.data.mission_status}), ${item.data.car_gov_number}`}
            <br/>
            {`${item.data.driver_fio}, ${item.data.driver_phone}`}
          </li>
        ))}
      </ul>
    );
  }

}
