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

    let si = _.groupBy(subItems, (e) => moment(e.data.create_date).format(global.APP_DATE_FORMAT));
    si = _.map(si, (ar) => _.sortBy(ar, (e) => e.data.mission_status !== "Выполнено"));
    si = _.sortBy(si, (ar) => -moment(ar[0].data.create_date).unix());
    si = si.map((ar) => {
      ar[0].data.groupStart = true;
      ar[ar.length-1].data.groupEnd = true;
      return ar;
    })
    si = _.flatten(si);
    subItems = si;

    console.log(si)

    return (
      <ul>
        {subItems.map((item, i) => (<div key={i}>
          {item.data.groupStart ? <center><span style={{fontWeight: "bold"}}>{moment(item.data.create_date).format(global.APP_DATE_FORMAT)}</span></center> : ''}
          <li key={i} className={item.data.mission_status === "Выполнено" ? "pointer_completed" : "pointer_in_progress"} onClick={this.action.bind(this, item)}>
            {`№${item.data.waybill_number} (${item.data.mission_status}), ${item.data.car_gov_number}`}
            <br/>
            {`${item.data.driver_fio || ''}${item.data.driver_phone ? ', ' + item.data.driver_phone : ''}`}
            {item.data.groupEnd ? <p/> : ''}
          </li></div>
          ))}
      </ul>
    );
  }

}
