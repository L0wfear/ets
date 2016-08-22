import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import WaybillClosed from './WaybillClosed.jsx';
import cx from 'classnames';
import moment from 'moment';

export default class WaybillDraft extends WaybillClosed {

  constructor(props) {
    super(props);
  }

  renderSubitems(subItems) {
    let si = _.groupBy(subItems, (e) => moment(e.data.waybill_date_create).format(global.APP_DATE_FORMAT));
    si = _.sortBy(si, (ar) => -moment(ar[0].data.waybill_date_create).unix());
    si = si.map((ar) => {
      ar[0].data.groupStart = true;
      ar[ar.length-1].data.groupEnd = true;
      return ar;
    })
    si = _.flatten(si);
    subItems = si;

    return (
      <ul>
        {subItems.map((item, i) => (<div key={i}>
          {item.data.groupStart ? <center><span style={{fontWeight: "bold"}}>{moment(item.data.waybill_date_create).format(global.APP_DATE_FORMAT)}</span></center> : ''}
          <li key={i} className='pointer' onClick={this.action.bind(this, item)}>
            {`${item.title}`}
            {item.data.groupEnd ? <p/> : ''}
          </li></div>
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
