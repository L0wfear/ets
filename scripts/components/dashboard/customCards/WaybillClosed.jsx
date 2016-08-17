import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import { FluxContext } from 'utils/decorators';
import WaybillFormWrap from '../../waybill/WaybillFormWrap.jsx';
import cx from 'classnames';

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
    if (!(item && item.data)) return;
    this.props.openSubitemsList(true);
    this.context.flux.getActions('waybills').getWaybill(item.data.waybill_id).then(r => {
      if (r.result[0]) this.setState({showWaybillForm: true, selectedWaybill: r.result[0]});
    });
  }

  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => (
          <li key={i} onClick={this.action.bind(this, item)}>
              {`№${item.data.waybill_number}, ${item.data.car_gov_number}, ${item.data.driver_fio}`}
          </li>
        ))}
      </ul>
    );
  }

  onFormHide() {
    this.props.refreshCard('waybill_draft');
    this.props.refreshCard('waybill_active');
    this.props.refreshCard('waybill_closed');
    this.props.refreshCard('current_missions');
    this.setState({showWaybillForm: false});
  }

  renderCustomCardForm() {
    return (
      <WaybillFormWrap onFormHide={this.onFormHide.bind(this)}
                       showForm={this.state.showWaybillForm}
                       element={this.state.selectedWaybill}
                       {...this.props}/>
    )
  }

}
