import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connectToStores, FluxContext } from 'utils/decorators';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import Div from 'components/ui/Div';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import { getFormattedDateTime, createValidDateTime } from 'utils/dates';
import { reassignMissionSuccessNotification } from 'utils/notifications';
import { cloneDeep, get, isEmpty } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import memoize from 'memoize-one';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

@connectToStores(['objects', 'missions'])
@FluxContext
class MissionRejectForm extends React.Component {
  static get propTypes() {
    return {
      mission: PropTypes.object,
      missions: PropTypes.object,
      onReject: PropTypes.func.isRequired,
      actionGetAndSetInStoreMissionCancelReasons: PropTypes.func.isRequired,
      actionResetMissionCancelReasons: PropTypes.func.isRequired,
      missionCancelReasonsList: PropTypes.array.isRequired,
    };
  }

  static get defaultProps() {
    return {
      missions: null,
    };
  }

  makeOptionFromMissionCancelReasonsList = memoize((missionCancelReasonsList) =>
    missionCancelReasonsList.map(defaultSelectListMapper),
  );

  constructor(props) {
    super(props);
    const { mission, missions } = props;

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
      reason_id: null, // изменить
    };
  }

  componentDidMount() {
    this.context.flux.getActions('objects').getCars();
    this.getCarFuncTypesByNormId();
    this.props.actionGetAndSetInStoreMissionCancelReasons();
  }

  componentWillUnmount() {
    // this.props.actionResetMissionCancelReasons();
  }

  getCarFuncTypesByNormId() {
    const { missionList, mIndex } = this.state;

    const { norm_id, date_start: datetime } = missionList[mIndex];

    if (norm_id) {
      this.context.flux
        .getActions('missions')
        .getCleaningByTypeInActiveMission({
          type: 'norm_registry',
          norm_id,
          datetime,
        })
        .then(({ result: { rows: [norm_data] } }) => {
          const car_func_types = norm_data.car_func_types.map(({ id }) => id);

          this.setState({ car_func_types });
        })
        .catch(() => this.setState({ car_func_types: [] }));
    }
  }

  getPropsMission(
    missionList = this.state.missionList,
    mIndex = this.state.mIndex,
  ) {
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
  };

  handleChangeCarId = async (car_id) => {
    if (car_id) {
      const { missionList, mIndex } = this.state;

      const mission_id
        = missionList[mIndex].mission_id || missionList[mIndex].id;
      const payload = {
        car_id,
        mission_id,
      };
      const result = await this.context.flux
        .getActions('missions')
        .getMissionReassignationParameters(payload);
      const data = result ? result.result : null;

      this.setState({
        car_id,
        data,
      });
    } else {
      this.setState({
        car_id,
        data: null,
      });
    }
  };

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
  };

  handleChangeCancelReason = async (car_id) => {
    if (car_id) {
      const { missionList, mIndex } = this.state;

      const mission_id
        = missionList[mIndex].mission_id || missionList[mIndex].id;
      const payload = {
        car_id,
        mission_id,
      };
      const result = await this.context.flux
        .getActions('missions')
        .getMissionReassignationParameters(payload);
      const data = result ? result.result : null;

      this.setState({
        car_id,
        data,
      });
    } else {
      this.setState({
        car_id,
        data: null,
      });
    }
  };

  handleMissionsDateChange(field, mission_id, value) {
    this.setState(({ data }) => ({
      data: {
        ...data,
        missions: data.missions.map((mission) => {
          if (mission.id === mission_id) {
            return {
              ...mission,
              [field]: createValidDateTime(value),
            };
          }

          return mission;
        }),
      },
    }));
  }

  handleChange(field, e) {
    this.setState({ [field]: e });
  }

  handleSubmit = async () => {
    let resolve;
    let payload;
    const { action_at, isWaybillForm } = this.props;
    const { reason_id } = this.state;
    let handlerName = 'createMissionFromReassignation'; // имя хендлера для ПЛ

    const status
      = get(
        this.props.missionCancelReasonsList.find(
          (reason) => reason.id === reason_id,
        ),
        'status',
        null,
      ) || this.state.status;

    if (!this.state.data) {
      let mission = null;
      try {
        mission = await this.props.actionGetMissionById(
          this.state.mission_id,
          {},
        );
      } catch (error) {
        console.error(error); // tslint:disable-line
      }
      if (mission) {
        mission.comment = this.state.comment;
        mission.mission_id = this.state.mission_id;
        payload = {
          ...mission,
          action_at,
          reason_id,
          status,
        };
        handlerName = 'updateMission'; // рак
        if (!isWaybillForm) {
          resolve = await this.props.actionUpdateMission(payload, {});
        }
      }
    } else {
      switch (this.state.data.mark) {
        case 'create':
          payload = {
            car_id: this.state.car_id,
            mission_id: this.state.mission_id,
            comment: this.state.comment,
            date_start: this.state.date_start,
            date_end: this.state.date_end,
            action_at,
            reason_id: this.state.reason_id,
            status,
          };
          if (!isWaybillForm) {
            resolve = await this.context.flux
              .getActions('missions')
              .createMissionFromReassignation(payload);
          }
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
              action_at,
              reason_id: this.state.reason_id,
              status,
            };
          } else {
            payload = {
              car_id: this.state.car_id,
              mission_id: this.state.mission_id,
              comment: this.state.comment,
              date_start: this.state.date_start,
              date_end: this.state.date_end,
              waybill_id: this.state.data.waybill_id,
              action_at,
              reason_id: this.state.reason_id,
              status,
            };
          }
          handlerName = 'updateMissionFromReassignation'; // рак
          if (!isWaybillForm) {
            resolve = await this.context.flux
              .getActions('missions')
              .updateMissionFromReassignation(payload);
          }
          break;
        default:
          break;
      }
    }
    if (
      !isWaybillForm
      && (!resolve.errors || (resolve.errors && !resolve.errors.length))
    ) {
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

    if (isWaybillForm) {
      const waybillPayload = {
        payload,
        handlerName,
      };
      this.props.onReject(waybillPayload);
    }
  };

  render() {
    const { state, props } = this;

    const errors = {};
    const { car_func_types, missionList, mIndex } = state;

    const mission = missionList[mIndex];

    if (!state.reason_id)
      errors.reason_id = 'Поле должно быть обязательно заполнено'; // убрать это чудо, после перехода на withForm

    let CARS = [];
    const {
      car_gov_number: mission_car_gov_number,
      number,
      // waybill_number,
    } = mission;

    CARS = props.carsList.reduce(
      (carOptions, { asuods_id, gov_number, type_id: car_type_id }) => {
        if (
          mission_car_gov_number !== gov_number
          && (!isEmpty(car_func_types)
            ? car_func_types.includes(car_type_id)
            : true)
        ) {
          carOptions.push({ value: asuods_id, label: gov_number });
        }

        return carOptions;
      },
      [],
    );

    const CANCEL_REASON = this.makeOptionFromMissionCancelReasonsList(
      this.props.missionCancelReasonsList,
    );

    const title = `Задание №${number}, ТС: ${mission_car_gov_number}`;
    // const waybillText = waybill_number ? `, задание будет исключено из ПЛ №${waybill_number}` : '';
    // const bodyText = `Статус задания №${number} будет изменен на «Не назначено»${waybillText}`;
    const missions = this.state.data ? this.state.data.missions : null;
    const datePickers
      = missions
      && missions.map((oneM, i) => (
        <EtsBootstrap.Row style={{ marginBottom: '4px' }} key={i}>
          <EtsBootstrap.Col md={4} style={{ paddingRight: '0' }}>
            <div
              title={oneM.technical_operation_name}
              style={{
                paddingTop: '9px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}>
              {`№: ${oneM.number} (${oneM.technical_operation_name})`}
            </div>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col
            md={8}
            style={{
              textAlign: 'right',
              paddingLeft: '0',
              whiteSpace: 'nowrap',
            }}>
            <Div className="inline-block reports-date">
              <Datepicker
                date={oneM.date_start}
                onChange={this.handleMissionsDateChange.bind(
                  this,
                  'date_start',
                  oneM.id,
                )}
              />
            </Div>
            {' — '}
            <Div className="inline-block reports-date">
              <Datepicker
                date={oneM.date_end}
                onChange={this.handleMissionsDateChange.bind(
                  this,
                  'date_end',
                  oneM.id,
                )}
              />
            </Div>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      ));

    return (
      <EtsBootstrap.ModalContainer
        id="modal-mission-reject"
        show={this.props.show}
        onHide={this.props.onHide}
        dialogClassName="mission-reject-info-modal"
        backdrop="static">
        <EtsBootstrap.ModalHeader>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>

        <ModalBody>
          <Field
            type="select"
            label="Введите причину:"
            value={state.reason_id}
            error={errors.reason_id}
            options={CANCEL_REASON}
            onChange={this.handleChange.bind(this, 'reason_id')}
          />
          <Field
            type="select"
            label="Переназначить задание на ТС:"
            error={errors.car_id}
            options={CARS}
            value={state.car_id}
            onChange={this.handleChangeCarId}
            clearable
          />
          <Field
            type="string"
            label="Примечание:"
            value={state.comment}
            error={errors.comment}
            onChange={this.handleChangeComment}
            placeholder="Поле ввода дополнительной информации"
          />
          <br />
          {state.data && state.data.missions ? (
            <Div>
              <label style={{ marginBottom: '10px' }}>
                {`Задание будет добавлено в п.л. №${
                  state.data.waybill_number
                } (Выезд: ${getFormattedDateTime(
                  state.data.waybill_plan_departure_date,
                )}, Возвращение: ${getFormattedDateTime(
                  state.data.waybill_plan_arrival_date,
                )})`}
              </label>
              <EtsBootstrap.Row style={{ marginBottom: '4px' }}>
                <EtsBootstrap.Col md={4} style={{ paddingRight: '0' }}>
                  <div
                    style={{
                      paddingTop: '9px',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}>
                    Переносимое задание
                  </div>
                </EtsBootstrap.Col>
                <EtsBootstrap.Col
                  md={8}
                  style={{
                    textAlign: 'right',
                    paddingLeft: '0',
                    whiteSpace: 'nowrap',
                  }}>
                  <Div className="inline-block reports-date">
                    <Datepicker
                      date={state.date_start}
                      onChange={this.handleChange.bind(this, 'date_start')}
                    />
                  </Div>
                  {' — '}
                  <Div className="inline-block reports-date">
                    <Datepicker
                      date={state.date_end}
                      onChange={this.handleChange.bind(this, 'date_end')}
                    />
                  </Div>
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </Div>
          ) : (
            ''
          )}
          {datePickers}
        </ModalBody>

        <EtsBootstrap.ModalFooter>
          <Div>
            <EtsBootstrap.Button
              disabled={!!errors.reason_id}
              onClick={this.handleSubmit}>
              Сохранить
            </EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={this.reject}>
              Отменить
            </EtsBootstrap.Button>
          </Div>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose(
  connect(
    (state) => ({
      missionCancelReasonsList: getSomeUniqState(state)
        .missionCancelReasonsList,
    }),
    (dispatch) => ({
      actionGetMissionById: (...arg) =>
        dispatch(
          missionsActions.actionGetMissionById(...arg), // Добавить page, path после перехода на withForm и tsx (см где вызывается)
        ),
      actionUpdateMission: (...arg) =>
        dispatch(missionsActions.actionUpdateMission(...arg)),
      actionGetAndSetInStoreMissionCancelReasons: () =>
        dispatch(
          someUniqActions.actionGetAndSetInStoreMissionCancelReasons(
            {},
            {}, // Добавить page, path после перехода на withForm и tsx
          ),
        ),
      actionResetMissionCancelReasons: () =>
        dispatch(
          someUniqActions.actionResetMissionCancelReasons(
            {},
            {}, // Добавить page, path после перехода на withForm и tsx
          ),
        ),
    }),
  ),
)(MissionRejectForm);
