import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel as BootstrapPanel, Collapse, Glyphicon, Fade, Well, Button, Modal } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';
import { getFormattedDateTimeSeconds } from 'utils/dates';
import cx from 'classnames';
import { isEmpty } from 'utils/functions';
import { FluxContext, wrappedRef } from 'utils/decorators';
import DutyMissionFormReject from 'components/missions/duty_mission/DutyMissionFormReject.jsx';

import DashboardCardMedium from '../DashboardCardMedium.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';

const Panel = wrappedRef(BootstrapPanel);

@FluxContext
export default class CurrentDutyMissions extends DashboardCardMedium {

  constructor(props, context) {
    super(props, context);

    this.state = Object.assign(this.state, {
      showCurrentDutyMissionForm: false,
      dutyMissionToRejectList: [],
    });

    this.canView = context.flux.getStore('session').getPermission('duty_mission.read');
    this.canCompleteOrReject = context.flux.getStore('session').getPermission('duty_mission.update');
  }

  async showCurrentDutyMissionForm(data) {
    this.props.openSubitemsList(true);
    const route = await this.context.flux.getActions('routes').getRouteById(data.duty_mission_route_id);
    this.setState({ showCurrentDutyMissionForm: true, selectedDutyMission: data, route });
  }
  hideCurrentDutyMissionForm = () => this.setState({ showCurrentDutyMissionForm: false });

  selectItem(i) {
    const item = this.props.items[i];
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data)) {
      const { selectedItem } = this.state;
      this.setState({ selectedItem: selectedItem === i ? null : i });
      this.props.openSubitemsList(true);
    }
  }

  selectedDutyMission(i) {
    this.setState({ selectedDutyMission: i });
    this.props.openSubitemsList(this.state.selectedItem === null);
  }

  async completeMission(id) {
    let mission = await this.context.flux.getActions('missions').getDutyMissionById(id);
    mission = mission.result.rows[0];
    mission.status = 'complete';
    await this.context.flux.getActions('missions').updateDutyMission(mission);
    this.selectItem(null);
    this.props.refreshCard();
  }

  async rejectMission(id) {
    const mission = await this.context.flux.getActions('missions').getDutyMissionById(id).then(({ result: { rows: [m] } }) => m);
    this.setState({
      dutyMissionToRejectList: [mission],
    });
    this.selectItem(null);
    this.props.refreshCard();
  }
  handleRejectAll = (allQuery, needUpdate) => {
    Promise.all(allQuery).then(() => {
      if (needUpdate) {
        this.props.refreshCard();
      }
      this.setState({
        dutyMissionToRejectList: [],
      });
    })
    .catch(() => {
      this.setState({
        dutyMissionToRejectList: [],
      });
    });
  }
  renderSubitems() {
    return this.renderSelectedMission();
  }

  renderSelectedMission() {

  }

  renderCollapsibleSubitems(item, i) {
    const { subItems = [] } = item;

    return (
      <Collapse in={this.state.selectedItem === i}>
        <Div className={!this.canView ? 'no-pointer-events' : 'pointer'}>
          <ul>
            {subItems.map((subItem, key) => <li key={key} onClick={this.selectedDutyMission.bind(this, key)}>{subItem.title || subItem}</li>)}
          </ul>
        </Div>
      </Collapse>
    );
  }

  renderCustomCardData() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedDutyMissionIndex = this.state.selectedDutyMission;
    if (isEmpty(selectedItemIndex) || isEmpty(selectedDutyMissionIndex)) return <div />;
    const selectedItem = this.props.items[selectedItemIndex] ? this.props.items[selectedItemIndex].subItems[selectedDutyMissionIndex] || null : null;
    const data = selectedItem !== null ? selectedItem.data || {} : {};

    return (
      <Div>
        <Div hidden={!data || (data && !data.technical_operation_name)}>
          <ul>
            <li><b>№ задания:</b> {data.duty_mission_number}</li>
            <li><b>Техоперация:</b> {data.technical_operation_name}</li>
            <li><b>Начало задания (плановое):</b> {getFormattedDateTimeSeconds(data.duty_mission_date_start)}</li>
            <li><b>Окончание задания (плановое):</b> {getFormattedDateTimeSeconds(data.duty_mission_date_end)}</li>
            <li><b>ФИО бригадира:</b> {data.foreman_fio}</li>
            <li><b>Номер телефона бригадира:</b> {data.foreman_phone}</li>
            {this.canView ? <li><a className="pointer" onClick={(e) => { e.preventDefault(); this.showCurrentDutyMissionForm(data); }}>Показать на карте</a></li> : ''}
            {this.canCompleteOrReject ? <Div className="text-right">
              <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, data.duty_mission_id)}>Выполнено</Button>
              <Button className="dashboard-card-action-button" onClick={this.rejectMission.bind(this, data.duty_mission_id)}>Не выполнено</Button>
            </Div> : ''}
          </ul>
        </Div>
      </Div>
    );
  }

  renderCustomCardForm() {
    if (!this.state.selectedDutyMission || !this.state.route) return (<div />);

    const {
      route,
      selectedDutyMission: {
        duty_mission_number,
        foreman_fio,
      },
      showCurrentDutyMissionForm,
    } = this.state;

    return (
      <Div hidden={!showCurrentDutyMissionForm} >
        <Modal bsSize="large" show onHide={this.hideCurrentDutyMissionForm} backdrop="static">

          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{`Наряд-задание № ${duty_mission_number}  бригадир ${foreman_fio}`}</Modal.Title>
          </Modal.Header>

          <ModalBody>
            <RouteInfo route={route} mapOnly />
          </ModalBody>

        </Modal>
      </Div>
    );
  }

  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const {
      subItems = [],
    } = selectedItem || {};
    const data = selectedItem !== null ? selectedItem.data || {} : {};
    const items = this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item-inner', { 'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action) });
      const status = item.title.split('').reverse().join('').split(' ')[0].split('').reverse().join('');
      const title = item.title.split(status)[0];
      return (<Div key={i} className="dashboard-card-item">
        <Div className={itemClassName} onClick={this.selectItem.bind(this, i)}>
          {title}
          <span title='Кол-во заданий в статусе "Назначено" / Общее кол-во заданий на текущую тех.операцию'>
            {status}
          </span>
        </Div>
        {
          typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''
        }
      </Div>);
    });
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
    // let dashboardCardClass = cx('dashboard-card', {'visibilityHidden'});
    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard.bind(this)} />;
    // отрефакторить

    return (
      <Div md={12}>
        <Div hidden={this.state.dutyMissionToRejectList.length === 0} >
          <DutyMissionFormReject
            rejectedDutyMission={this.state.dutyMissionToRejectList}
            onRejectAll={this.handleRejectAll}
          />
        </Div>
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
              <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList.bind(this)} />
            </Div>
            <Div style={{ textAlign: 'center' }} hidden={!this.state.fullListOpen}>
              <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList.bind(this)} />
            </Div>
          </Div>

          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <div>
              <Well>
                <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                  <Glyphicon glyph="remove" />
                </Div>
                <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
                <div style={{ marginTop: 15 }} />
                {this.renderSubitems(subItems)}
                {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
              </Well>
            </div>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}

      </Div>
    );
  }

}
