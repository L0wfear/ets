import React, { Component, PropTypes } from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/DatePicker';
import { getFormattedDateTime, createValidDateTime } from 'utils/dates';
import { reassignMissionSuccessNotification } from 'utils/notifications.js';
import {
  cloneDeep,
  isEmpty,
} from 'lodash';

@connectToStores(['objects', 'missions'])
@FluxContext
export default class MissionRejectForm extends Component {

  static get propTypes() {
    return {
      mission: PropTypes.object,
      missions: PropTypes.object,
      onReject: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    const {
      mission,
      missions,
    } = props;

    const missionList = [];
    let mIndex = 0;

    if (!isEmpty(missions)) {
      const missionsArray = Object.values(missions);

      missionList.push(...missionsArray);
      mIndex = missionsArray.length - 1;
    } else {
      missionList.push(mission);
    }

    this.state = {
      missionList,
      mIndex,
      comment: '',
      ...this.getPropsMission(missionList, mIndex),
      car_id: null,
      car_func_types: [],
      needUpdateParent: false,
    };
  }

  componentDidMount() {
    this.context.flux.getActions('objects').getCars();
    this.getCarFuncTypesByNormId();
  }

  getCarFuncTypesByNormId() {
    const {
      missionList,
      mIndex,
    } = this.state;

    const { norm_id, date_start: datetime } = missionList[mIndex];

    if (norm_id) {
      this.context.flux.getActions('missions')
        .getCleaningByTypeInActiveMission({ type: 'norm_registry', norm_id, datetime }).then(({ result: { rows: [norm_data] } }) => {
          const car_func_types = norm_data.car_func_types.map(({ id }) => id);

          this.setState({ car_func_types });
        })
        .catch(() => this.setState({ car_func_types: [] }));
    }
  }

  getPropsMission(missionList = this.state.missionList, mIndex = this.state.mIndex) {
    const mission = missionList[mIndex];

    const mission_id = mission.mission_id || mission.id;
    const date_start = mission.mission_date_start || mission.date_start;
    const date_end = mission.mission_date_end || mission.date_end;

    return {
      mission_id,
      date_end,
      date_start,
    };
  }

  handleChangeComment = (e) => {
    this.setState({ comment: e.target.value });
  }
  handleChangeCarId = async (car_id) => {
    const {
      missionList,
      mIndex,
    } = this.state;

    const mission_id = missionList[mIndex].mission_id || missionList[mIndex].id;
    const payload = {
      car_id,
      mission_id,
    };
    const result = await this.context.flux.getActions('missions').getMissionReassignationParameters(payload);
    const data = result ? result.result : null;

    this.setState({
      car_id,
      data,
      comment: '',
    });
  }

  handleChange(field, e) {
    this.setState({ [field]: e });
  }

  async handleSubmit() {
    let resolve;
    let payload;
    if (!this.state.data) {
      let mission = await this.context.flux.getActions('missions').getMissionById(this.state.mission_id);
      mission = mission.result.rows[0];
      mission.status = 'fail';
      mission.comment = this.state.comment;
      resolve = await this.context.flux.getActions('missions').updateMission(mission, false);
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
            const missions = cloneDeep(this.state.data.missions);
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
      const { missionList, mIndex } = this.state;
      global.NOTIFICATION_SYSTEM.notify(reassignMissionSuccessNotification);

      if (mIndex === 0) {
        this.props.onReject(true);
      } else {
        this.setState({
          needUpdateParent: true,
          comment: '',
          car_id: null,
          mIndex: mIndex - 1,
          ...this.getPropsMission(missionList, mIndex - 1),
        });
      }
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

  reject = () => {
    const { mIndex, missionList } = this.state;
    if (mIndex === 0) {
      const { needUpdateParent } = this.state;
      this.props.onReject(needUpdateParent);
    } else {
      this.setState({
        comment: '',
        car_id: null,
        mIndex: mIndex - 1,
        ...this.getPropsMission(missionList, mIndex - 1),
      });
    }
  }

  render() {
    const { state, props } = this;

    const errors = {};
    const { car_func_types, missionList, mIndex } = state;

    const mission = missionList[mIndex];

    if (!state.comment) errors.comment = 'Поле должно быть обязательно заполнено';

    let CARS = [];
    const {
      car_gov_number: mission_car_gov_number,
    } = mission;

    CARS = props.carsList.reduce((carOptions, { asuods_id, gov_number, type_id: car_type_id }) => {
      if ((mission_car_gov_number !== gov_number) && (!isEmpty(car_func_types) ? car_func_types.includes(car_type_id) : true)) {
        carOptions.push({ value: asuods_id, label: gov_number });
      }

      return carOptions;
    }, []);

    const title = `Задание, ТС: ${mission_car_gov_number}`;
    const missions = this.state.data ? this.state.data.missions : null;
    const datePickers = missions && missions.map((oneM, i) =>
       (
         <Row style={{ marginBottom: '4px' }} key={i}>
           <Col md={4} style={{ paddingRight: '0' }}>
             <div
               title={oneM.technical_operation_name}
               style={{
                 paddingTop: '9px',
                 textOverflow: 'ellipsis',
                 whiteSpace: 'nowrap',
                 overflow: 'hidden',
               }}
             >
               {`№: ${oneM.number} (${oneM.technical_operation_name})`}
             </div>
           </Col>
           <Col md={8} style={{ textAlign: 'right', paddingLeft: '0', whiteSpace: 'nowrap' }}>
             <Div className="inline-block reports-date">
               <Datepicker date={oneM.date_start} onChange={this.handleMissionsDateChange.bind(this, 'date_start', oneM.id)} />
             </Div>
             {' — '}
             <Div className="inline-block reports-date">
               <Datepicker date={oneM.date_end} onChange={this.handleMissionsDateChange.bind(this, 'date_end', oneM.id)} />
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
            onChange={this.handleChangeComment}
          />
          <Field
            type="select"
            label="Переназначить задание на:"
            error={errors.car_id}
            options={CARS}
            value={state.car_id}
            onChange={this.handleChangeCarId}
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
            <Button onClick={this.reject} >{'Отменить'}</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
