import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import WaybillClosed from './WaybillClosed.jsx';

export default class WaybillDraft extends WaybillClosed {

  renderSubitems({ subItems }) {
    let si = _.groupBy(subItems, e => moment(e.data.waybill_date_create).format(global.APP_DATE_FORMAT));
    si = _.sortBy(si, ar => -moment(ar[0].data.waybill_date_create).unix());
    si = si.map((ar) => {
      ar[0].data.groupStart = true;
      ar[ar.length - 1].data.groupEnd = true;
      return ar;
    });
    si = _.flatten(si);
    subItems = si;

    return (
      <ul>
        {subItems.map((item, i) => (<div key={i}>
          {item.data.groupStart ? <center><span style={{ fontWeight: 'bold' }}>{moment(item.data.waybill_date_create).format(global.APP_DATE_FORMAT)}</span></center> : ''}
          <li key={i} className="pointer" onClick={this.action.bind(this, item)}>
            {`${item.title}`}
            {item.data.groupEnd ? <p /> : ''}
          </li></div>
        ))}
      </ul>
    );
  }

  selectItem(i) {
    const {
      count,
    } = this.props;

    this.setState({ selectedItem: null });
    setTimeout(() => {
      if (!!count) {
        if (typeof i === 'number') {
          this.context.flux.getActions('dashboard').getWaybillDraft().then(waybillSubItems => this.setState({ waybillSubItems }));
        }
        this.props.openSubitemsList(i === null);
      }
    }, 50);
  }

  renderItems() {
    const {
      count,
      title,
    } = this.props;

    const canView = this.context.flux.getStore('session').getPermission(['waybill.read']);
    const itemClassName = cx('dashboard-card-item', { 'pointer': true, 'no-pointer-events': !canView });

    return (
      <Div className={itemClassName} >
        <Div hidden={typeof count !== 'number'} >
          <Div className="dashboard-card-item-inner-singlevalue" onClick={this.selectItem.bind(this, 0)}>
            {count}
          </Div>
        </Div>
        <Div hidden={typeof count === 'number'} >
          <Div className="dashboard-card-item-inner" onClick={this.selectItem.bind(this, 0)}>
            {title}
          </Div>
        </Div>
      </Div>
    );
  }

}
