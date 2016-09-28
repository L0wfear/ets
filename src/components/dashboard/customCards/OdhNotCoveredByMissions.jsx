import React from 'react';
import cx from 'classnames';
import Div from 'components/ui/Div.jsx';
import DashboardCardMedium from '../DashboardCardMedium.jsx';

export default class OdhNotCoveredByMissions extends DashboardCardMedium {
  renderItems() {
    const canView = this.context.flux.getStore('session').getPermission(['odh.list', 'dt.list']);

    return this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item', { 'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action), 'no-pointer-events': !canView });
      return (
        <Div key={i} className={itemClassName}>
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
        </Div>
      );
    });
  }
}
