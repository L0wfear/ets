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
import DashboardCardMedium from 'components/dashboard/DashboardCardMedium.jsx';
import DashboardCardHeader from 'components/dashboard/DashboardCardHeader.jsx';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoFormWrap.jsx';
import MissionRejectForm from 'components/missions/mission/MissionRejectForm.jsx';
import DashboardItemChevron from 'components/dashboard/DashboardItemChevron.jsx';


import ItemsCentralized from 'components/dashboard/customCards/CurrentMissionItems/ItemsCentralized';
import ItemsDecentralized from 'components/dashboard/customCards/CurrentMissionItems/ItemsDecentralized';

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
      selectetdType: null,
    });

    this.canView = context.flux.getStore('session').getPermission('mission.read');
    this.canCompleteOrReject = context.flux.getStore('session').getPermission('mission.update');
  }

  async completeMission(id) {
    let mission = await this.context.flux.getActions('missions').getMissionById(id);
    mission = mission.result.rows[0];
    mission.status = 'complete';
    await this.context.flux.getActions('missions').updateMission(mission, false);
    this.selectItem(this.state.selectetdType, null);
    this.props.refreshCard();
  }

  rejectMission() {
    this.setState({ showMissionRejectForm: true });
  }

  onReject(refresh) {
    this.setState({ showMissionRejectForm: false });
    if (refresh) {
      this.selectItem(this.state.selectetdType, null);
      this.props.refreshCard();
    }
  }

  selectItem = (key, i) => {
    const item = (key && this.props[key][i]) || null;
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data)) {
      const { selectedItem } = this.state;
      this.setState({ selectetdType: key, selectedItem: selectedItem === i ? null : i });
      this.props.openSubitemsList(true);
    }
  }

  selectMission = async (id) => {
    const { flux } = this.context;
    this.setState({ customCardLoading: true });
    this.props.openSubitemsList(this.state.selectedItem === null);
    const missionData = await flux.getActions('missions').getMissionData(id);
    if (missionData.warnings) {
      global.NOTIFICATION_SYSTEM.notify(missionData.warnings[0], 'error');
    } else {
      this.setState({ selectedMission: missionData.result, customCardLoading: false });
      document.getElementById('dashboard-time').scrollIntoView();
    }
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
    const { customCardLoading, selectedMission } = this.state;
    if (selectedMission === null) return <div />;

    const {
      mission_data,
      car_data,
      report_data,
      technical_operation_data,
    } = selectedMission;
    const { sensor_traveled_working } = mission_data;

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
    const sensor_traveled_workingAndCheck_unit = checkFixed([sensor_traveled_working / 1000, 'км'], 'THREE_F');

    return (
      <Div>
        <Div hidden={Object.keys(selectedMission) === 0}>
          <ul>
            <li><b>Задание: </b>
              №{mission_data.number}
            </li>
            <li><b>Тех. операция: </b>
              {technical_operation_data.name}
            </li>
            <li><b>Элемент: </b>
              {mission_data.element}
            </li>
            <li><b>Водитель: </b>
              {car_data.driver_fio}
            </li>
            {medLabelVisibility && <MedViewLabel>Не пройден внеплановый мед. осмотр</MedViewLabel>}
            <li><b>Номер телефона: </b>
              {car_data.driver_phone || 'нет данных'}
            </li>
            <li><b>Рег. номер ТС: </b>
              {car_data.gov_number}
            </li>
            <li><b>Начало задания: </b>
              {getFormattedDateTimeSeconds(mission_data.date_start)}
            </li>
            <li><b>Окончание задания: </b>
              {getFormattedDateTimeSeconds(mission_data.date_end)}
            </li>
            <li><b>Расчетное время выполнения: </b>
              {getEstimatedFinishTime(report_data.estimated_finish_time || 'Подсчет')}
            </li>
            <li><b>Пройдено в рабочем режиме: </b>
              {getDataTraveledYet(traveledAndCheck_unit)}
            </li>
            <li><b>Пройдено с рабочей скоростью: </b>
              {getDataTraveledYet([...traveledAndCheck_unit, report_data.time_work_speed])}
            </li>
            <li><b>Пройдено с превышением рабочей скорости: </b>
              {getDataTraveledYet([...traveled_high_speedAndCheck_unit, report_data.time_high_speed])}
            </li>
            <li><b>Общий пробег с работающим оборудованием: </b>
              {`${sensor_traveled_working ? getDataTraveledYet(sensor_traveled_workingAndCheck_unit) : 'Данные будут отображены после выполнения задания'}`}
            </li>
            {this.canView ? <div><a className="pointer" onClick={(e) => { e.preventDefault(); this.missionAction(selectedMission); }}>Подробнее...</a></div> : ''}
            {this.canCompleteOrReject ? <Div className="text-right">
              <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, mission_data.id)}>Выполнено</Button>
              <Button className="dashboard-card-action-button" onClick={this.rejectMission.bind(this, mission_data.id)}>Не выполнено</Button>
            </Div> : ''}
          </ul>
        </Div>
        {this.state.showMissionRejectForm &&
          <MissionRejectForm
            show={this.state.showMissionRejectForm}
            onReject={this.onReject}
            mission={data}
          />
        }
      </Div>
    );
  }


  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectetdType = this.state.selectetdType;
    const selectedItem = (selectetdType && this.props.items[selectedItemIndex]) || null;
    const subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    const data = selectedItem !== null ? selectedItem.data || {} : {};
    // отрефакторить
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

    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={Header} bsStyle="success" wrappedRef={node => (this._card = node)}>
          <Div className="dashboard-card-items">
            <ItemsCentralized
              items={this.props.items_centralized}
              title={this.props.title_centralized}
              selectItem={this.selectItem}
              selectMission={this.selectMission}
              selectedItem={selectetdType === 'items_centralized' ? this.state.selectedItem : null}
            />
            <ItemsDecentralized
              items={this.props.items_decentralized}
              title={this.props.title_decentralized}
              selectItem={this.selectItem}
              selectMission={this.selectMission}
              selectedItem={selectetdType === 'items_decentralized' ? this.state.selectedItem : null}
            />
          </Div>
          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>
        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <Well>
              <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, selectetdType, null)}>
                <Glyphicon glyph="remove" />
              </Div>
              <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
              <div style={{ marginTop: 15 }} />
              {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
            </Well>
          </Fade>
        </Div>
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.selectedMission}
          {...this.props}
        />
      </Div>
    );
  }

}
