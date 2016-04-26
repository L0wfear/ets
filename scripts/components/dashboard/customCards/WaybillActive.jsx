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

    let subItemsCompleted = subItems.filter((e) => e.data.mission_status === 'Выполнено');
    let subItemsInProgress = subItems.filter((e) => e.data.mission_status === 'В работе');

    return (
      <ul>
        {subItemsCompleted.map((item, i) => (
          <li key={i} className="pointer_completed" onClick={this.action.bind(this, item)}>
            {`№${item.data.waybill_number} (${item.data.mission_status}), ${item.data.car_gov_number}`}
            <br/>
            {`${item.data.driver_fio || ''}${item.data.driver_phone ? ', ' + item.data.driver_phone : ''}`}
          </li>
        ))}
        {subItemsInProgress.map((item, i) => (
          <li key={i} className="pointer_in_progress" onClick={this.action.bind(this, item)}>
            {`№${item.data.waybill_number} (${item.data.mission_status}), ${item.data.car_gov_number}`}
            <br/>
            {`${item.data.driver_fio || ''}${item.data.driver_phone ? ', ' + item.data.driver_phone : ''}`}
          </li>
        ))}
      </ul>
    );
  }

}
