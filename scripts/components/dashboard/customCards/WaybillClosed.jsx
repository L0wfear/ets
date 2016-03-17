import React from 'react';
import Div from '../../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import FaxogrammMissionsFormWrap from '../../directories/faxogramm/FaxogrammMissionsFormWrap.jsx';
import { FluxContext } from '../../decorators/index.js';
import WaybillFormWrap from '../../waybill/WaybillFormWrap.jsx';

@FluxContext
export default class WaybillClosed extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      selectedWaybill: null,
      showWaybillForm: false,
    });
  }

  action(item) {
    console.log(this);
    this.props.openFullList(true);
    this.context.flux.getActions('waybills').getWaybill(item.data.waybill_id).then(r => this.setState({showWaybillForm: true, selectedWaybill: r.result[0]}));
  }

  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => (
          <li key={i} className="pointer" onClick={this.action.bind(this, item)}>
              {`№${item.data.waybill_number}, ${item.data.car_gov_number}, ${item.data.driver_fio}`}
          </li>
        ))}
      </ul>
    );
  }

  renderCustomCardData() {
    return (
      <WaybillFormWrap onFormHide={() => this.setState({showWaybillForm: false})}
                       showForm={this.state.showWaybillForm}
                       element={this.state.selectedWaybill}
                       {...this.props}/>
    )
  }

}
