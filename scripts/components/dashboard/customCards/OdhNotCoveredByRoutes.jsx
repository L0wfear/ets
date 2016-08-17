import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import cx from 'classnames';

export default class OdhNotCoveredByRoutes extends DashboardCardMedium {

  static contextTypes = {
    history: React.PropTypes.object,
    flux: React.PropTypes.object
  }

  constructor(props) {
    super(props);
  }

  action(technical_operation_id) {
    console.log(technical_operation_id);
    this.context.history.pushState(null, `/routes-list/?technical_operation_id=${technical_operation_id}`);
  }

  renderCustomCardData() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || {};
    let technical_operation_id = selectedItem.technical_operation_id;
    return (
      <Div>
        <Div className="text-right">
          <Button className="dashboard-card-action-button" onClick={(e) => {e.preventDefault(); this.action(technical_operation_id);}}>Перейти к маршрутам</Button>
        </Div>
      </Div>
    );
  }

  renderItems() {
    let canView = this.context.flux.getStore('session').getPermission(["odh.get", "dt.get"]);

    return this.props.items.map((item,i) => {
      let itemClassName = cx('dashboard-card-item', {'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action), 'no-pointer-events': !canView});
      return <Div key={i} className={itemClassName}>
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
    });
  }

}
