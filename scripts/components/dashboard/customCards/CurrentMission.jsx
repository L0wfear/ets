import React from 'react';
import Div from '../../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import {getFormattedDateTimeSeconds} from 'utils/dates';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import moment from 'moment';
import MissionInfoFormWrap from '../MissionInfoFormWrap.jsx';
import { isEmpty } from 'utils/functions';

let getDataTraveledYet = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  return parseInt(data, 10);
}

let getEstimatedFinishTime = (data) => {
  if (typeof data === 'string' && data.indexOf('2') === -1) {
    return data;
  }
  return moment(data).format(`${global.APP_DATE_FORMAT} HH:mm`);
}


export default class CurrentMission extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMissionInfoForm: false,
      selectedMission: null,
    });
  }

  async completeMission(id) {
		let mission = await this.context.flux.getActions('missions').getMissionById(id);
        mission = mission.result[0];
		mission.status = 'complete';
		await this.context.flux.getActions('missions').updateMission(mission);
    this.selectItem(null);
    this.props.refreshCard();
	}

  action(i) {
    let { selectedItem } = this.state;
    this.setState({selectedItem: selectedItem === i ? null : i});
    this.props.openSubitemsList(true);
  }

  selectMission(i) {
    this.setState({selectedMission: i});
    this.props.openSubitemsList(this.state.selectedItem === null);
  }

  missionAction(data) {
    this.props.openSubitemsList(true);
    this.setState({showMissionInfoForm: true, mission: data});
  }

  renderSelectedMission() {

  }

  renderSubitems(subItems) {
    return this.renderSelectedMission();
  }

  renderCollapsibleSubitems(item, i) {
    let { subItems } = item;
      return (
        <Collapse in={this.state.selectedItem === i}>
          <Div>
            <ul>
              {subItems.map((item, key) => <li key={key} onClick={this.selectMission.bind(this, key)}>{item.title || item}</li>)}
            </ul>
          </Div>
        </Collapse>
      );
  }

  renderCustomCardData() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedMissionIndex = this.state.selectedMission;
    if (isEmpty(selectedItemIndex) || isEmpty(selectedMissionIndex)) return <div/>;
    let selectedItem = this.props.items[selectedItemIndex].subItems[selectedMissionIndex] || null;
    let data = selectedItem !== null ? selectedItem.data || {} : {};

    return (
      <Div hidden={!data || (data && !data.mission_name)}>
        <ul>
          <li><b>Задание:</b> {data.mission_name}</li>
          <li><b>Тех. операция:</b> {data.technical_operation_name}</li>
          <li><b>Водитель:</b> {data.driver_fio}</li>
          <li><b>Гос. номер ТС:</b> {data.car_gov_number}</li>
          <li><b>Начало задания:</b> {getFormattedDateTimeSeconds(data.mission_date_start)}</li>
          <li><b>Окончание задания:</b> {getFormattedDateTimeSeconds(data.mission_date_end)}</li>
          <li><b>Расчетное время выполнения:</b> {getEstimatedFinishTime(data.estimated_finish_time || 'Подсчет')}</li>
          <li><b>Пройдено:</b> {getDataTraveledYet(data.traveled_yet)}</li>
          <li><a className="pointer" onClick={(e) => {e.preventDefault(); this.missionAction(data);}}>Подробнее...</a></li>
          <Div className="text-right">
            <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, data.mission_id)}>Завершить</Button>
          </Div>
        </ul>
      </Div>
    );
  }

  renderCustomCardForm() {
    return (
      <MissionInfoFormWrap onFormHide={() => this.setState({showMissionInfoForm: false})}
                         showForm={this.state.showMissionInfoForm}
                         element={this.state.mission}
                         {...this.props}/>
    );
  }

}
