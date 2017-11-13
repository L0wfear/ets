import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Button } from 'react-bootstrap';
import cx from 'classnames';
import DashboardCardMedium from '../DashboardCardMedium.jsx';

export default class OdhNotCoveredByRoutes extends DashboardCardMedium {

  static contextTypes = {
    history: React.PropTypes.any,
    flux: React.PropTypes.object,
  }

  action(technical_operation_id) {
    console.log(technical_operation_id);
    this.context.history.pushState(null, `/routes-list/?technical_operation_id=${technical_operation_id}`);
  }

  renderCustomCardData() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || {};
    const technical_operation_id = selectedItem.technical_operation_id;
    return (
      <Div>
        <Div className="text-right">
          <Button className="dashboard-card-action-button" onClick={(e) => { e.preventDefault(); this.action(technical_operation_id); }}>Перейти к маршрутам</Button>
        </Div>
      </Div>
    );
  }

  renderItems() {
    const canView = this.context.flux.getStore('session').getPermission(['odh.read', 'dt.read']);

    return this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item', { 'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action), 'no-pointer-events': !canView });
      return (<Div key={i} className={itemClassName}>
        {typeof item.value !== 'undefined' ?
          <Div className="dashboard-card-item-inner-singlevalue" onClick={this.selectItem.bind(this, i)}>
            {item.value}
          </Div>
          :
          <Div className="dashboard-card-item-inner" onClick={this.selectItem.bind(this, i)}>
            {item.title}
          </Div>
        }
        {
          typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''
        }
      </Div>);
    });
  }

}
