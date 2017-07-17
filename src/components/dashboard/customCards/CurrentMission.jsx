import React from 'react';
import moment from 'moment';
import { autobind } from 'core-decorators';
import { Panel as BootstrapPanel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import cx from 'classnames';

import Div from 'components/ui/Div.jsx';
import { getFormattedDateTimeSeconds } from 'utils/dates';
import { wrappedRef } from 'utils/decorators';
// TODO move to HOC
import Preloader from 'components/ui/Preloader.jsx';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';
import MissionInfoFormWrap from '../MissionInfoFormWrap.jsx';
import MissionRejectForm from '../../missions/mission/MissionRejectForm.jsx';

const VALUE_FOR_FIXED = {
  TWO_F: {
    val: 2,
    list: [
      'кв. м.',
      'м.',
    ],
  },
  THREE_F: {
    val: 3,
    list: [
      'км',
    ],
  },
  floatFixed: (data, val) => parseFloat(data).toFixed(val),
};

const checkFixed = (data, key) => {
  const clone = [...data];

  if (VALUE_FOR_FIXED[key].list.includes(data[1])) {
    clone[0] = VALUE_FOR_FIXED.floatFixed(clone[0], VALUE_FOR_FIXED[key].val);
  }

  return clone;
};

const MedViewLabel = props =>
  <div style={{ marginBottom: 5, marginTop: 5 }}>
    <span style={{ fontSize: 16, color: 'red' }}>{props.children}</span>
  </div>;

const Panel = wrappedRef(BootstrapPanel);

const getDataTraveledYet = (data) => {
  if (typeof data === 'object') {
    return data.join(' ');
  }

  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};

const getEstimatedFinishTime = (data) => {
  if (typeof data === 'string' && data.indexOf('2') === -1) {
    return data;
  }
  return moment(data).format(`${global.APP_DATE_FORMAT} HH:mm`);
};

@autobind
export default class CurrentMission extends DashboardCardMedium {

  constructor(props, context) {
    super(props, context);

    this.state = Object.assign(this.state, {
      showMissionInfoForm: false,
      showMissionRejectForm: false,
      selectedMission: null,
      customCardLoading: true,
      equipmentData: null,
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

  rejectMission() {
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

  async getEquipmentData(gps_code, date_start, date_end) {
    const { flux } = this.context;
    this.setState({ loadingFields: true, equipmentData: null });
    const equipmentData = await flux.getActions('cars').getTrack(gps_code, date_start, date_end)
      .then(r => Object.keys(r.equipment)
        .map(k => r.equipment[k].distance)
        .reduce((a, b) => a + b, 0)
      );
    this.setState({ loadingFields: false, equipmentData });
  }

  async selectMission(id) {
    const { flux } = this.context;
    this.setState({ customCardLoading: true });
    this.props.openSubitemsList(this.state.selectedItem === null);
    const missionData = await flux.getActions('missions').getMissionData(id).then(r => r.result);
    const cars = await flux.getActions('objects').getCars().then(r => r.result);
    const carGpsCode = cars.find(c => c.gov_number === missionData.car_data.gov_number).gps_code;
    this.setState({ selectedMission: missionData, customCardLoading: false },
      () => this.getEquipmentData(carGpsCode, missionData.mission_data.date_start, missionData.mission_data.date_end));
    document.getElementById('dashboard-time').scrollIntoView();
  }

  missionAction() {
    this.props.openSubitemsList(true);
    this.setState({ showMissionInfoForm: true });
  }

  renderCollapsibleSubitems(item, i) {
    const { subItems = [] } = item;

    return (
      <Collapse in={this.state.selectedItem === i}>
        <Div className={!this.canView ? 'no-pointer-events' : 'pointer'}>
          <ul>
            {subItems.map((subItem, key) => <li key={key} onClick={this.selectMission.bind(this, subItem.id)}>{subItem.title || subItem}</li>)}
          </ul>
        </Div>
      </Collapse>
    );
  }

  renderCustomCardData() {
    const { customCardLoading, selectedMission, loadingFields, equipmentData } = this.state;
    if (selectedMission === null) return <div />;
    const { mission_data, car_data, report_data, route_data,
      technical_operation_data, waybill_data } = selectedMission;
    if (customCardLoading) {
      return <Preloader />;
    }

    const data = {
      ...mission_data,
      car_gov_number: car_data.gov_number,
    };

    const medLabelVisibility = car_data.driver_allowed !== undefined && !car_data.driver_allowed;

    const traveledAndCheck_unit = checkFixed([report_data.traveled, report_data.check_unit], 'TWO_F');
    const traveled_high_speedAndCheck_unit = checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F');
    const equipmentDataAndCheck_unit = checkFixed([equipmentData / 1000, 'км'], 'THREE_F');

    return (
      <Div>
        <Div hidden={Object.keys(selectedMission) === 0}>
          <ul>
            <li><b>Задание:</b>
              {mission_data.name}
            </li>
            <li><b>Тех. операция:</b>
              {technical_operation_data.name}
            </li>
            <li><b>Водитель:</b>
              {car_data.driver_fio}
            </li>
            {medLabelVisibility && <MedViewLabel>Не пройден внеплановый мед. осмотр</MedViewLabel>}
            <li><b>Рег. номер ТС:</b>
              {car_data.gov_number}
            </li>
            <li><b>Начало задания:</b>
              {getFormattedDateTimeSeconds(mission_data.date_start)}
            </li>
            <li><b>Окончание задания:</b>
              {getFormattedDateTimeSeconds(mission_data.date_end)}
            </li>
            <li><b>Расчетное время выполнения:</b>
              {getEstimatedFinishTime(report_data.estimated_finish_time || 'Подсчет')}
            </li>
            <li><b>Пройдено в рабочем режиме:</b>
              {getDataTraveledYet(traveledAndCheck_unit)}
            </li>
            <li><b>Пройдено с рабочей скоростью:</b>
              {getDataTraveledYet([...traveledAndCheck_unit, report_data.time_work_speed])}
            </li>
            <li><b>Пройдено с превышением рабочей скорости:</b>
              {getDataTraveledYet([...traveled_high_speedAndCheck_unit, report_data.time_high_speed])}
            </li>
            <li><b>Общий пробег с работающим оборудованием:</b>
              {loadingFields ? <Preloader type="field" /> : `${getDataTraveledYet(equipmentDataAndCheck_unit)}`}
            </li>
            {this.canView ? <div><a className="pointer" onClick={(e) => { e.preventDefault(); this.missionAction(selectedMission); }}>Подробнее...</a></div> : ''}
            {this.canCompleteOrReject ? <Div className="text-right">
              <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, mission_data.id)}>Выполнено</Button>
              <Button className="dashboard-card-action-button" onClick={this.rejectMission.bind(this, mission_data.id)}>Не выполнено</Button>
            </Div> : ''}
          </ul>
        </Div>
        {this.state.showMissionRejectForm && <MissionRejectForm
          show={this.state.showMissionRejectForm}
          onReject={this.onReject}
          mission={data}
        />}
      </Div>
    );
  }

  renderCustomCardForm() {
    return (
      <MissionInfoFormWrap
        onFormHide={() => this.setState({ showMissionInfoForm: false })}
        showForm={this.state.showMissionInfoForm}
        element={this.state.selectedMission}
        equipmentData={this.state.equipmentData}
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
      return (
        <Div key={i} className="dashboard-card-item">
          <Div className={itemClassName} onClick={this.selectItem.bind(this, i)}>
            {title}
            <span title='Кол-во заданий в статусе "Назначено" / Общее кол-во заданий на текущую тех.операцию'>
              {status}
            </span>
          </Div>
          {typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''}
        </Div>
      );
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

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <Well>
              <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                <Glyphicon glyph="remove" />
              </Div>
              <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
              <div style={{ marginTop: 15 }} />
              {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
            </Well>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}

      </Div>
    );
  }

}
