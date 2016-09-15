import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import { getFormattedDateTimeSeconds } from 'utils/dates';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';
import cx from 'classnames';
import moment from 'moment';
import MissionInfoFormWrap from '../MissionInfoFormWrap.jsx';
import { isEmpty } from 'utils/functions';
import MissionRejectForm from '../../missions/mission/MissionRejectForm.jsx';

const getDataTraveledYet = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};

const getEstimatedFinishTime = (data) => {
  if (typeof data === 'string' && data.indexOf('2') === -1) {
    return data;
  }
  return moment(data).format(`${global.APP_DATE_FORMAT} HH:mm`);
};


export default class CurrentMission extends DashboardCardMedium {

  constructor(props, context) {
    super(props, context);

    this.state = Object.assign(this.state, {
      showMissionInfoForm: false,
      showMissionRejectForm: false,
      selectedMission: null,
    });

    this.canView = context.flux.getStore('session').getPermission('mission.read');
    this.canCompleteOrReject = context.flux.getStore('session').getPermission('mission.update');
  }

  async completeMission(id) {
    let mission = await this.context.flux.getActions('missions').getMissionById(id);
    mission = mission.result.rows[0];
    mission.status = 'complete';
    await this.context.flux.getActions('missions').updateMission(mission);
    this.selectItem(null);
    this.props.refreshCard();
  }

  async rejectMission(id) {
    this.setState({ showMissionRejectForm: true });
  }

  onReject(refresh) {
    this.setState({ showMissionRejectForm: false });
    if (refresh) {
      this.selectItem(null);
      this.props.refreshCard();
    }
  }

  selectItem(i) {
    const item = this.props.items[i];
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data)) {
      const { selectedItem } = this.state;
      this.setState({ selectedItem: selectedItem === i ? null : i });
      this.props.openSubitemsList(true);
    }
  }

  selectMission(i) {
    this.setState({ selectedMission: i });
    this.props.openSubitemsList(this.state.selectedItem === null);
  }

  missionAction(data) {
    this.props.openSubitemsList(true);
    this.setState({ showMissionInfoForm: true, mission: data });
  }

  renderSelectedMission() {

  }

  renderSubitems(subItems) {
    return this.renderSelectedMission();
  }

  renderCollapsibleSubitems(item, i) {
    let { subItems = [] } = item;

    return (
      <Collapse in={this.state.selectedItem === i}>
        <Div className={!this.canView ? 'no-pointer-events' : 'pointer'}>
          <ul>
            {subItems.map((item, key) => <li key={key} onClick={this.selectMission.bind(this, key)}>{item.title || item}</li>)}
          </ul>
        </Div>
      </Collapse>
    );
  }

  renderCustomCardData() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedMissionIndex = this.state.selectedMission;
    if (isEmpty(selectedItemIndex) || isEmpty(selectedMissionIndex)) return <div />;
    const selectedItem = this.props.items[selectedItemIndex].subItems[selectedMissionIndex] || null;
    const data = selectedItem !== null ? selectedItem.data || {} : {};

    return (
      <Div>
        <Div hidden={!data || (data && !data.mission_name)}>
          <ul>
            <li><b>Задание:</b> {data.mission_name}</li>
            <li><b>Тех. операция:</b> {data.technical_operation_name}</li>
            <li><b>Водитель:</b> {data.driver_fio}</li>
            <li><b>Рег. номер ТС:</b> {data.car_gov_number}</li>
            <li><b>Начало задания:</b> {getFormattedDateTimeSeconds(data.mission_date_start)}</li>
            <li><b>Окончание задания:</b> {getFormattedDateTimeSeconds(data.mission_date_end)}</li>
            <li><b>Расчетное время выполнения:</b> {getEstimatedFinishTime(data.estimated_finish_time || 'Подсчет')}</li>
            <li><b>Пройдено в рабочем режиме:</b> {getDataTraveledYet(data.traveled_yet)}</li>
            <li><b>Пройдено с рабочей скоростью:</b> {getDataTraveledYet(data.route_with_work_speed + data.with_work_speed_time)}</li>
            <li><b>Пройдено с превышением рабочей скорости:</b> {getDataTraveledYet(data.route_with_high_speed + data.with_high_speed_time)}</li>
            {this.canView ? <li><a className="pointer" onClick={(e) => { e.preventDefault(); this.missionAction(data); }}>Подробнее...</a></li> : ''}
            {this.canCompleteOrReject ? <Div className="text-right">
              <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, data.mission_id)}>Выполнено</Button>
              <Button className="dashboard-card-action-button" onClick={this.rejectMission.bind(this, data.mission_id)}>Не выполнено</Button>
            </Div> : ''}
          </ul>
        </Div>
        <MissionRejectForm
          show={this.state.showMissionRejectForm}
          onReject={this.onReject.bind(this)}
          mission={data}
        />
      </Div>
    );
  }

  renderCustomCardForm() {
    return (
      <MissionInfoFormWrap
        onFormHide={() => this.setState({ showMissionInfoForm: false })}
        showForm={this.state.showMissionInfoForm}
        element={this.state.mission}
        {...this.props}
      />
    );
  }

  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
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
        {typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''}
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
        <Panel className="dashboard-card" header={Header} bsStyle="success" ref="card">
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
