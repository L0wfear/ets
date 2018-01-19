import React from 'react';
import { autobind } from 'core-decorators';
import cx from 'classnames';

import { wrappedRef, FluxContext } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { Panel as BootstrapPanel, Collapse, Glyphicon, Fade, Well } from 'react-bootstrap';

import DashboardCardMedium from '../DashboardCardMedium.jsx';
import WaybillFormWrap from '../../waybill/WaybillFormWrap.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';

const Panel = wrappedRef(BootstrapPanel);

@autobind
@FluxContext
export default class WaybillClosed extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      selectedWaybill: null,
      showWaybillForm: false,
      waybillSubItems: [],
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

  onWaybillFormHide = () => {
    this.props.refreshCard('waybill_draft');
    this.props.refreshCard('waybill_in_progress');
    this.props.refreshCard('waybill_completed');
    this.props.refreshCard('waybill_closed');
    this.props.refreshCard('current_missions');
    this.setState({ showWaybillForm: false });
  }

  renderCustomCardForm() {
    return (
      <WaybillFormWrap
        onFormHide={this.onWaybillFormHide}
        onCallback={this.onWaybillFormHide}
        showForm={this.state.showWaybillForm}
        element={this.state.selectedWaybill}
        {...this.props}
        fromDashboard
      />
    );
  }

  renderItems() {
    const {
      count,
      title,
    } = this.props;

    const itemClassName = cx('dashboard-card-item', { 'pointer': true });

    return (
      <Div className={itemClassName} >
        <Div hidden={typeof count !== 'number'} >
          <Div className="dashboard-card-item-inner-singlevalue" onClick={this.selectItem.bind(this, 0)}>
            {count}
          </Div>
        </Div>
        <Div hidden={typeof count === 'number'}>
          <Div className="dashboard-card-item-inner" onClick={this.selectItem.bind(this, 0)}>
            {title}
          </Div>
        </Div>
      </Div>
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
          this.context.flux.getActions('dashboard').getWaybillClosed().then(waybillSubItems => this.setState({ waybillSubItems }));
        }
        this.props.openSubitemsList(i === null);
      }
    }, 50);
  }

  render() {
    const { waybillSubItems = [] } = this.state;

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
    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard} />;

    // отрефакторить
    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={Header} bsStyle="success" wrappedRef={node => (this._card = node)}>
          <Div className="dashboard-card-items">
            {items}
          </Div>
          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={waybillSubItems.length === 0 || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(waybillSubItems.length === 0) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: waybillSubItems.length > 0 && this.props.itemOpened })} >
          <Fade in={waybillSubItems.length !== null && this.props.itemOpened}>
            <Well>
              <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                <Glyphicon glyph="remove" />
              </Div>
              <h5>{this.props.itemsTitle}</h5>
              <div style={{ marginTop: 15 }} />
              {this.renderSubitems(waybillSubItems)}
              {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
            </Well>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}
      </Div>
    );
  }

}
