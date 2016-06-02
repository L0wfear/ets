import React, { Component } from 'react';
import Div from '../../ui/Div.jsx';
import { Modal, Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Field from '../../ui/Field.jsx';
import Datepicker from '../../ui/DatePicker.jsx';
import {getFormattedDateTimeSeconds} from 'utils/dates';
import moment from 'moment';
import { isEmpty } from 'utils/functions';
import connectToStores from 'flummox/connect';
import { createValidDateTime } from 'utils/dates';

class CurrentMissionRejectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      car_id: null,
      date_start: null,
      date_end: null
    };
  }

  async handleChange(field, e) {
    switch (field) {
      case 'comment':
        this.setState({comment: e.target.value});
        break;
      case 'car_id':
        let id = this.props.mission.mission_id || this.props.mission.id;
        let payload = {
          car_id: e,
          mission_id: id
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
          comment: this.state.comment,
          date_start: this.state.date_start,
          date_end: this.state.date_end,
        };
        this.context.flux.getActions('missions').createMissionFromReassignation(payload);
        break;
        case 'update':
        if (this.state.result.missions) {
          let missions = JSON.stringify(this.state.result.missions);
          let payload = {
            car_id: this.state.car_id,
            mission_id: this.state.mission_id,
            comment: this.state.comment,
            missions,
            date_start: this.state.date_start,
            date_end: this.state.date_end,
            waybill_id: this.state.result.waybill_id
          };
          this.context.flux.getActions('missions').updateMissionFromReassignation(payload);
        } else {
          let payload = {
            car_id: this.state.car_id,
            mission_id: this.state.mission_id,
            comment: this.state.comment,
            date_start: this.state.date_start,
            date_end: this.state.date_end,
            waybill_id: this.state.result.waybill_id
          }
          this.context.flux.getActions('missions').updateMissionFromReassignation(payload);
        };
        break;
      }
    }
    this.props.onReject();
    this.props.onFormHide();
  }

  handleDateChange(field, mission_id, value) {
    let {missions} = this.state.result;
    missions.forEach((mission) => {
      if (mission.id === mission_id) {
        mission[field] = createValidDateTime(value);
      };
    });
    this.setState({missions});
  }

  componentWillReceiveProps() {
    if (this.props.show === false) this.setState({car_id: null, comment: '', date_end: null, date_start: null});
    if (this.props.mission) {
      let mission_id = this.props.mission.mission_id || this.props.mission.id;
      let date_start = this.props.mission.mission_date_start || this.props.mission.date_start;
      let date_end = this.props.mission.mission_date_end || this.props.mission.date_end;
      this.setState({mission_id, date_end, date_start});
    }
  }

  componentDidMount() {
    this.context.flux.getActions('objects').getCars();
  }

  render() {
    let { state, props } = this;
    let errors = [];
    let CARS = (props.carsList && props.mission) ? props.carsList.map((e) => ({value: e.asuods_id, label: e.gov_number})).filter((e) => e.label !== props.mission.car_gov_number) : [];
    let title = props.mission ? 'Задание, ТС: '+props.mission.car_gov_number : '';
    let missions = this.state.result ? this.state.result.missions : null;
    let datePickers = missions && missions.map((mission, i) => {
      console.log(mission);
      return <Row style={{marginBottom: '3px'}} key={i}>
        <Col md={3}>
          <label style={{marginRight: "10px", paddingTop: '3px'}}>{`№: ${mission.number}(${mission.name})`}</label>
        </Col>
        <Col md={9}>
          <Div className="inline-block reports-date">
            <Datepicker date={mission.date_start} onChange={this.handleDateChange.bind(this, 'date_start', mission.id)}/>
          </Div>
          <Div className="inline-block reports-date">
            <Datepicker date={mission.date_end} onChange={this.handleDateChange.bind(this, 'date_end', mission.id)}/>
          </Div>
        </Col>
      </Row>
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
              {state.result && state.result.missions ? <Row>
                <Col md={3}>
                  <label>Переносимое задание</label>
                </Col>
                <Col md={9} >
                  <Div className="inline-block reports-date">
                    <Datepicker date={this.state.date_start} onChange={this.handleChange.bind(this, 'date_start')}/>
                  </Div>
                  <Div className="inline-block reports-date">
                    <Datepicker date={this.state.date_end} onChange={this.handleChange.bind(this, 'date_end')}/>
                  </Div>
                </Col>
              </Row>
              : ''}
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
