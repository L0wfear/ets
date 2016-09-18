import React from 'react';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import { FluxContext } from 'utils/decorators';
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
    if (!(item && item.data)) return;
    this.props.openSubitemsList(true);
    this.context.flux.getActions('waybills').getWaybill(item.data.waybill_id).then((r) => {
      if (r.result) this.setState({ showWaybillForm: true, selectedWaybill: r.result });
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
    this.setState({ showWaybillForm: false });
  }

  renderCustomCardForm() {
    return (
      <WaybillFormWrap
        onFormHide={this.onFormHide.bind(this)}
        showForm={this.state.showWaybillForm}
        element={this.state.selectedWaybill}
        {...this.props}
      />
    );
  }

}
