import React from 'react';
import Div from '../../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import {getFormattedDateTimeSeconds} from '../../../utils/dates.js';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import moment from 'moment';
import MissionInfoFormWrap from '../MissionInfoFormWrap.jsx';


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

  action(data) {
    this.props.openFullList(true);
    this.setState({showMissionInfoForm: true, mission: data});
  }

  renderCustomCardData() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || null;
    let subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
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
          <li><a className="pointer" onClick={(e) => {e.preventDefault(); this.action(data);}}>Подробнее...</a></li>
          <Div className="text-right">
            <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, data.mission_id)}>Завершить</Button>
          </Div>
        </ul>


        <MissionInfoFormWrap onFormHide={() => this.setState({showMissionInfoForm: false})}
														 showForm={this.state.showMissionInfoForm}
                             element={this.state.mission}
														 {...this.props}/>
      </Div>
    );
  }

}
