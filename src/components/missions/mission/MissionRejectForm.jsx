import React, { Component, PropTypes } from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/DatePicker';
import { getFormattedDateTime, createValidDateTime } from 'utils/dates';
import { reassignMissionSuccessNotification } from 'utils/notifications.js';
import _ from 'lodash';

@connectToStores(['objects', 'missions'])
@FluxContext
export default class MissionRejectForm extends Component {

  static get propTypes() {
    return {
      show: PropTypes.bool,
      mission: PropTypes.object,
      onReject: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      car_id: null,
      date_start: null,
      date_end: null,
    };
  }

  componentWillMount() {
    if (this.props.fromDashboard) {
      this.context.flux.getActions('objects').getCars();
    }
  }

  componentWillReceiveProps(props) {
    if (props.show === false) {
      this.setState({
        car_id: null,
        comment: '',
        date_end: null,
        date_start: null,
        result: null,
      });
    }
    if (props.show !== this.props.show && props.show === true) {
      this.context.flux.getActions('objects').getCars();
    }

    if (props.mission) {
      const mission_id = props.mission.mission_id || props.mission.id;
      const date_start = props.mission.mission_date_start || props.mission.date_start;
      const date_end = props.mission.mission_date_end || props.mission.date_end;
      this.setState({ mission_id, date_end, date_start });
    }
  }

  componentWillUpdate(props, state) {
    if (state.car_id && !this.state.car_id) {
      this.setState({ comment: `Перенос задания с ТС: ${props.mission.car_gov_number}` });
    }
  }

  async handleChange(field, e) {
    switch (field) {
      case 'comment':
        this.setState({ comment: e.target.value });
        break;
      case 'car_id': {
        const mission_id = this.props.mission.mission_id || this.props.mission.id;
        const payload = {
          car_id: e,
          mission_id,
        };
        const result = await this.context.flux.getActions('missions').getMissionReassignationParameters(payload);
        const data = result ? result.result : null;
        this.setState({ [field]: e, data });
        break;
      }
      default:
        this.setState({ [field]: e });
    }
  }

  async handleSubmit() {
    let resolve;
    let payload;
    if (!this.state.data) {
      let mission = await this.context.flux.getActions('missions').getMissionById(this.state.mission_id);
      mission = mission.result.rows[0];
      mission.status = 'fail';
      mission.comment = this.state.comment;
      resolve = await this.context.flux.getActions('missions').updateMission(mission);
    } else {
      switch (this.state.data.mark) {
        case 'create':
          payload = {
            car_id: this.state.car_id,
            mission_id: this.state.mission_id,
            comment: this.state.comment,
            date_start: this.state.date_start,
            date_end: this.state.date_end,
          };
          resolve = await this.context.flux.getActions('missions').createMissionFromReassignation(payload);
          break;
        case 'update':
          if (this.state.data.missions) {
            const missions = _.cloneDeep(this.state.data.missions);
            payload = {
              car_id: this.state.car_id,
              mission_id: this.state.mission_id,
              comment: this.state.comment,
              missions,
              date_start: this.state.date_start,
              date_end: this.state.date_end,
              waybill_id: this.state.data.waybill_id,
            };
          } else {
            payload = {
              car_id: this.state.car_id,
              mission_id: this.state.mission_id,
              comment: this.state.comment,
              date_start: this.state.date_start,
              date_end: this.state.date_end,
              waybill_id: this.state.data.waybill_id,
            };
          }
          resolve = await this.context.flux.getActions('missions').updateMissionFromReassignation(payload);
          break;
        default:
          break;
      }
    }
    if (!resolve.errors || (resolve.errors && !resolve.errors.length)) {
      global.NOTIFICATION_SYSTEM.notify(reassignMissionSuccessNotification);
      this.props.onReject(true);
    }
  }

  handleMissionsDateChange(field, mission_id, value) {
    const { missions } = this.state.data;
    missions.forEach((mission) => {
      if (mission.id === mission_id) {
        mission[field] = createValidDateTime(value);
      }
    });
    this.setState({ missions });
  }

  render() {
    const { state, props } = this;
    const errors = {};
    if (!state.comment) errors.comment = 'Поле должно быть обязательно заполнено';
    const CARS = (props.carsList && props.mission) ? props.carsList.map(e => ({ value: e.asuods_id, label: e.gov_number })).filter(e => e.label !== props.mission.car_gov_number) : [];
    const title = props.mission ? `Задание, ТС: ${props.mission.car_gov_number}` : '';
    const missions = this.state.data ? this.state.data.missions : null;
    const datePickers = missions && missions.map((mission, i) =>
       (
         <Row style={{ marginBottom: '4px' }} key={i}>
           <Col md={4} style={{ paddingRight: '0' }}>
             <div
               title={mission.technical_operation_name}
               style={{
                 paddingTop: '9px',
                 textOverflow: 'ellipsis',
                 whiteSpace: 'nowrap',
                 overflow: 'hidden',
               }}
             >
               {`№: ${mission.number} (${mission.technical_operation_name})`}
             </div>
           </Col>
           <Col md={8} style={{ textAlign: 'right', paddingLeft: '0', whiteSpace: 'nowrap' }}>
             <Div className="inline-block reports-date">
               <Datepicker date={mission.date_start} onChange={this.handleMissionsDateChange.bind(this, 'date_start', mission.id)} />
             </Div>
             {' — '}
             <Div className="inline-block reports-date">
               <Datepicker date={mission.date_end} onChange={this.handleMissionsDateChange.bind(this, 'date_end', mission.id)} />
             </Div>
           </Col>
         </Row>
      )
    );

    return (
      <Modal {...props} dialogClassName="mission-reject-info-modal" backdrop="static">

        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Field
            type="string"
            label="Введите причину:"
            value={state.comment}
            error={errors.comment}
            onChange={this.handleChange.bind(this, 'comment')}
          />
          <Field
            type="select"
            label="Переназначить задание на:"
            error={errors.car_id}
            options={CARS}
            value={state.car_id}
            onChange={this.handleChange.bind(this, 'car_id')}
            clearable
          />
          <br />
          {state.data && state.data.missions ? <Div>
            <label style={{ marginBottom: '10px' }}>
              {`Задание будет добавлено в п.л. №${state.data.waybill_number} (Выезд: ${getFormattedDateTime(state.data.waybill_plan_departure_date)}, Возвращение: ${getFormattedDateTime(state.data.waybill_plan_arrival_date)})`}
            </label>
            <Row style={{ marginBottom: '4px' }}>
              <Col md={4} style={{ paddingRight: '0' }}>
                <div style={{
                  paddingTop: '9px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                >Переносимое задание</div>
              </Col>
              <Col md={8} style={{ textAlign: 'right', paddingLeft: '0', whiteSpace: 'nowrap' }}>
                <Div className="inline-block reports-date">
                  <Datepicker date={state.date_start} onChange={this.handleChange.bind(this, 'date_start')} />
                </Div>
                {' — '}
                <Div className="inline-block reports-date">
                  <Datepicker date={state.date_end} onChange={this.handleChange.bind(this, 'date_end')} />
                </Div>
              </Col>
            </Row>
          </Div> : ''}
          {datePickers}
        </ModalBody>

        <Modal.Footer>
          <Div>
            <Button disabled={!!errors.comment} onClick={this.handleSubmit.bind(this)} >{'Сохранить'}</Button>
            <Button onClick={props.onReject.bind(this, false)} >{'Отменить'}</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
