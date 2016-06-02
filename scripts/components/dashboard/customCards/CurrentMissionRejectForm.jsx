import React, { Component } from 'react';
import Div from '../../ui/Div.jsx';
import { Modal, Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Field from '../../ui/Field.jsx';
import Datepicker from '../../ui/DatePicker.jsx';
import {getFormattedDateTimeSeconds} from 'utils/dates';
import moment from 'moment';
import { isEmpty } from 'utils/functions';
import connectToStores from 'flummox/connect';

class CurrentMissionRejectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      car_id: null,
      editDates: false,
    };
  }

  async handleChange(field, e) {
    switch (field) {
      case 'comment':
        this.setState({comment: e.target.value});
        break;
      case 'car_id':
        let payload = {
          car_id: e,
          mission_id: this.props.mission.mission_id
        }
        let result = await this.context.flux.getActions('missions').getMissionReassignationParameters(payload);
        let data = result ? result.result : null
        this.setState({[field]: e, result: data});
        break;
      default:
        this.setState({[field]: e});
    }
  }

  async handleSubmit() {
    if (!this.state.result) {
      let mission = await this.context.flux.getActions('missions').getMissionById(this.state.mission_id);
      mission = mission.result[0];
  		mission.status = 'fail';
  		mission.comment = this.state.comment;
  		await this.context.flux.getActions('missions').updateMission(mission);
    } else {
      switch(this.state.result.mark) {
        case 'create':
        let payload = {
          car_id: this.state.car_id,
          mission_id: this.state.mission_id,
          comment: this.state.comment
        }
        this.context.flux.getActions('missions').createMissionFromReassignation(payload);
        break;
        case 'update':
        if (this.state.result.time_slots) {
          let payload = {
            car_id: this.state.car_id,
            mission_id: this.state.mission_id,
            comment: this.state.comment,
            missions: this.state.result.missions,
            waybill_id: this.state.result.waybill_id
          }
          this.context.flux.getActions('missions').updateMissionFromReassignation(payload);
        } else {
          let payload = {
            car_id: this.state.car_id,
            mission_id: this.state.mission_id,
            comment: this.state.comment,
            waybill_id: this.state.result.waybill_id
          }
          this.context.flux.getActions('missions').updateMissionFromReassignation(payload);
        }
        break;
      }
    }
    this.props.onReject();
  }

  handleDateChange(field, mission_id, value) {
    let {missions} = this.state.result;
    missions.forEach((mission) => {
      if (mission.id === mission_id) {
        mission[field] = value;
      };
    });
    this.setState({missions});
  }

  componentDidMount() {
    this.setState({mission_id: this.props.mission.mission_id});
  }

  render() {
    let { state, props } = this;
    let errors = [];
    let CARS = (props.carsList && props.mission) ? props.carsList.map((e) => ({value: e.asuods_id, label: e.gov_number})).filter((e) => e.label !== props.mission.car_gov_number) : [];
    let title = props.mission ? 'Задание: ' + props.mission.mission_name + ', ТС: '+props.mission.car_gov_number : '';
    let missions = this.state.result ? this.state.result.missions : null;

    let datePickers = missions && missions.map((mission, i) => {
      console.log(mission);
      return <div>
        <Div className="inline-block reports-date">
          <Datepicker date={mission.date_start} onChange={this.handleDateChange.bind(this, 'date_start', mission.id)}/>
        </Div>
        <Div className="inline-block reports-date">
          <Datepicker date={mission.date_end} onChange={this.handleDateChange.bind(this, 'date_end', mission.id)}/>
        </Div>
      </div>
            });

            return (
          <Modal {...props} className="mission-reject-info-modal" backdrop="static">

            <Modal.Header closeButton onHide={props.onFormHide}>
              <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Field
                  type="string"
                  label="Введите причину"
                  value={state.comment}
                  error={errors['comment']}
                  onChange={this.handleChange.bind(this, 'comment')} />
              <Field
                  type="select"
                  label="Переназначить задание на"
                  error={errors['car_id']}
                  options={CARS}
                  value={state.car_id}
                  onChange={this.handleChange.bind(this, 'car_id')}
                  clearable={true} />
              <br/>
              {datePickers}
	      </Modal.Body>

	      <Modal.Footer>
					<Div>
		      	<Button onClick={this.handleSubmit.bind(this)} >{'Сохранить'}</Button>
		      	<Button onClick={props.onFormHide} >{'Отменить'}</Button>
					</Div>
	      </Modal.Footer>

			</Modal>
    )
  }
}

CurrentMissionRejectForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(CurrentMissionRejectForm, ['objects', 'missions']);
