import React from 'react';
import { autobind } from 'core-decorators';
import { Panel as BootstrapPanel, Collapse } from 'react-bootstrap';
import cx from 'classnames';

import Div from 'components/ui/Div.jsx';
import { wrappedRef } from 'utils/decorators';
// TODO move to HOC
import DashboardCardMedium from 'components/dashboard/DashboardCardMedium.jsx';

const styleDashboardCardHeader = { cursor: 'pointer' };

const DashboardCardHeader = props => (
    <Div onClick={props.onClick} style={styleDashboardCardHeader}>
      <Div className="dashboard-card-title">{`${props.title}:`}</Div>
    </Div>
  );

const Panel = wrappedRef(BootstrapPanel);

@autobind
export default class CurrentMission extends DashboardCardMedium {

  constructor(props, context) {
    super(props, context);

    this.canView = context.flux.getStore('session').getPermission('mission.read');
  }

  selectItem(i) {
    this.props.selectItem('items_centralized', i);
  }

  selectMission(id) {
    this.props.selectMission(id);
  }


  renderCollapsibleSubitems(item, i) {
    const { subItems = [] } = item;

    return (
      <Collapse in={this.props.selectedItem === i}>
        <Div className={!this.canView ? 'no-pointer-events' : 'pointer'}>
          <ul>
            {subItems.map((subItem, key) => <li key={key} onClick={this.selectMission.bind(this, subItem.id)}>{subItem.title || subItem}</li>)}
          </ul>
        </Div>
      </Collapse>
    );
  }

  render() {
    const items = this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item-inner', { 'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action) });
      const status = item.title.split('').reverse().join('').split(' ')[0].split('').reverse().join('');
      const title = item.title.split(status)[0];
      return (
        <Div key={i} className="dashboard-card-item">
          <Div className={itemClassName} onClick={this.selectItem.bind(this, i)}>
            {title}
            <span title="Общее кол-во заданий на текущую тех.операцию">
              {status}
            </span>
          </Div>
          {typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''}
        </Div>
      );
    });

    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.toggleFullList}/>;

    // отрефакторить

    return (
      <Div md={12}>
        <Panel className="dashboard-card no-margin-bottom" header={Header} bsStyle="success" wrappedRef={node => (this._card = node)}>
          <Div className="dashboard-card-items">
            <Collapse in={this.state.fullListOpen}>
              <Div>
                {items}
              </Div>
            </Collapse>
          </Div>
          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>
      </Div>
    );
  }

}
