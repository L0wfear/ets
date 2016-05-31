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
      editDates: true,
    };
  }

  handleChange(field, e) {
    switch (field) {
      case 'comment':
        this.setState({comment: e.target.value});
        break;
      default:
        this.setState({[field]: e});
    }
  }

  handleSubmit() {
    console.log(this.state);
  }

  async componentDidMount() {
    let mission = await this.context.flux.getActions('missions').getMissionById(this.props.mission);
    mission = mission.result[0];
    this.setState({mission});
  }

  render() {
    let { state, props } = this;
    let errors = [];
    let CARS = (props.carsList && state.mission) ? props.carsList.map((e) => ({value: e.asuods_id, label: e.gov_number})).filter((e) => e.label !== state.mission.car_gov_number) : [];
    let title = state.mission ? 'Задание, ТС: '+state.mission.car_gov_number : '';

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
