import React from 'react';
import cx from 'classnames';
import { Panel as BootstrapPanel, Collapse, Glyphicon, Fade, Well } from 'react-bootstrap';

import Div from 'components/ui/Div.jsx';
import { wrappedRef } from 'utils/decorators';

import DashboardCardMedium from '../DashboardCardMedium.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';

const Panel = wrappedRef(BootstrapPanel);

export default class OdhNotCoveredByMissions extends DashboardCardMedium {
  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => <li key={i}>{`${item.name} (${item.left_passes})`}</li>)}
      </ul>
    );
  }

  selectItem(i) {
    this.setState({ selectedItem: null });
    setTimeout(() => {
      const item = this.props.items[i];
      if ((item && item.sub_items && item.sub_items.length) || i === null || (item && item.data)) {
        this.setState({ selectedItem: i });
        this.props.openSubitemsList(i === null);
      } else if (typeof this.action === 'function') {
        this.action(i);
      }
    }, 50)
  }

  renderItems() {
    const canView = this.context.flux.getStore('session').getPermission(['odh.list', 'dt.list']);

    return this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item', { 'pointer': (item.data) || (item.sub_items && item.sub_items.length) || (this.action), 'no-pointer-events': !canView });
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


  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const sub_items = selectedItem !== null ? selectedItem.sub_items || [] : [];
    const data = selectedItem !== null ? selectedItem.data || {} : {};
    const items = this.renderItems();
    let styleObject = {
      width: this.state.cardWidth, marginLeft: this.state.cardWidth + 30,
    };
    if (this.props.direction === 'left') {
      styleObject = {
        width: this.state.cardWidth, right: this.state.cardWidth + 44,
      };
    }
    if (!this.state.cardWidth) {
      styleObject = {};
    }
    const firstItems = items.slice(0, 2);
    const otherItems = items.slice(2, items.length);
    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard} />;

    // отрефакторить
    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={Header} bsStyle="success" wrappedRef={node => (this._card = node)}>
          <Div className="dashboard-card-items">
            {firstItems}
            <Collapse in={this.state.fullListOpen}>
              <Div>
                {otherItems}
              </Div>
            </Collapse>
          </Div>

          <Div className="menu-down-block" hidden={otherItems.length === 0}>
            <Div style={{ textAlign: 'center' }} hidden={this.state.fullListOpen}>
              <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList} />
            </Div>
            <Div style={{ textAlign: 'center' }} hidden={!this.state.fullListOpen}>
              <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList} />
            </Div>
          </Div>

          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (sub_items.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(sub_items.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <Well>
              <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                <Glyphicon glyph="remove" />
              </Div>
              <h5>{!!selectedItem ? `Список ${selectedItem.object_type}` : ''}</h5>
              <div style={{ marginTop: 15 }} />
              {this.renderSubitems(sub_items)}
              {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
            </Well>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}

      </Div>
    );
  }
}
