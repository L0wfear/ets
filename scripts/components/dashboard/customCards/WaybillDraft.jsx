import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import WaybillClosed from './WaybillClosed.jsx';
import cx from 'classnames';

export default class WaybillDraft extends WaybillClosed {

  constructor(props) {
    super(props);
  }

  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => (
          <li key={i} className="pointer" onClick={this.action.bind(this, item)}>
            {`${item.title}`}
          </li>
        ))}
      </ul>
    );
  }

  renderItems() {
    let canView = this.context.flux.getStore('session').getPermission("waybill.read");

    return this.props.items.map((item,i) => {
      let itemClassName = cx('dashboard-card-item', {'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action), 'no-pointer-events': !canView});
      return <Div key={i} className={itemClassName} >
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
