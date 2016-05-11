import React from 'react';
import Div from '../../ui/Div.jsx';
import _ from 'lodash';
import moment from 'moment';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import FaxogrammMissionsFormWrap from '../../directories/faxogramm/FaxogrammMissionsFormWrap.jsx';
import WaybillClosed from './WaybillClosed.jsx';

export default class WaybillActive extends WaybillClosed {

  constructor(props) {
    super(props);
  }

  renderSubitems(subItems) {

    subItems
      .sort((a,b) => (new Date(b.data.create_date).getTime() - new Date(a.data.create_date).getTime()))
      .map((e, i, a) => {
        if (a[i+1]) {
          if (e.data.create_date !== a[i+1].data.create_date) {
            e.data.break = true;
          }
        }
        return e;
      });
    subItems = _(subItems)
      .groupBy((e) => moment(e.data.create_date).format(global.APP_DATE_FORMAT))
      .map((ar) => _.sortBy(ar, (e) => e.data.mission_status !== 'Выполнено'))
      .flatten()
      .value()

    console.log(subItems);

    return (
      <ul>
        {subItems.map((item, i) => (
          <li key={i} className={item.data.mission_status === "Выполнено" ? "pointer_completed" : "pointer_in_progress"} onClick={this.action.bind(this, item)}>
            {`№${item.data.waybill_number} (${item.data.mission_status}), ${item.data.car_gov_number}`}
            <br/>
            {`${item.data.driver_fio || ''}${item.data.driver_phone ? ', ' + item.data.driver_phone : ''}`}
            {item.data.break ? <p/> : ''}
          </li>
          ))}
      </ul>
    );
  }

}
