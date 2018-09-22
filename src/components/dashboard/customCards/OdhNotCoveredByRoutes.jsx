import cx from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import * as queryString from 'query-string';
import * as PropTypes from 'prop-types';

import Div from 'components/ui/Div.jsx';
import DashboardCardMedium from '../DashboardCardMedium.jsx';

export default class OdhNotCoveredByRoutes extends DashboardCardMedium {

  static contextTypes = {
    history: PropTypes.any,
    flux: PropTypes.object,
  }

  action(technical_operation_id) {
    console.log(technical_operation_id); // eslint-disable-line
    const query = queryString.stringify({ technical_operation_id });
    this.context.history.push(`/routes-list/?${query}`);
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
    const canView = this.context.flux.getStore('session').getPermission(['odh.read', 'dt.read'], true);

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
