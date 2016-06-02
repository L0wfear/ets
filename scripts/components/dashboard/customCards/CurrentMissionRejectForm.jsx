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

  handleChange(field, e) {
    switch (field) {
      case 'comment':
        this.setState({comment: e.target.value});
        break;
      case 'car_id':
        this.setState({[field]: e});
        break;
      default:
        this.setState({[field]: e});
    }
  }

  async componentWillUpdate(nextProps, nextState) {
    if (nextState.car_id && this.state.car_id !== nextState.car_id) {
      let payload = {
        car_id: nextState.car_id,
        mission_id: this.props.mission.mission_id
      }
      let result = await this.context.flux.getActions('missions').getMissionReassignationParameters(payload);
      console.log(result);
    }
  }

  handleSubmit() {
    console.log(this.state);
  }

  componentDidMount() {
    this.setState({mission_id: this.props.mission.mission_id});
  }

  render() {
    let { state, props } = this;
    let errors = [];
    let CARS = (props.carsList && props.mission) ? props.carsList.map((e) => ({value: e.asuods_id, label: e.gov_number})).filter((e) => e.label !== props.mission.car_gov_number) : [];
    let title = props.mission ? 'Задание: ' + props.mission.mission_name + ', ТС: '+props.mission.car_gov_number : '';

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
          <Div hidden={!this.state.editDates}>
            <Div className="inline-block reports-date">
              <Datepicker date={state.date_from} onChange={this.handleChange.bind(this, 'date_from')}/>
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker date={state.date_to} onChange={this.handleChange.bind(this, 'date_to')}/>
            </Div>
          </Div>
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
