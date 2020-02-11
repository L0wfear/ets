import * as React from 'react';
import memoize from 'memoize-one';
import { cloneDeep, get, isEmpty } from 'lodash';
import { connect } from 'react-redux';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';

import {
  getFormattedDateTime,
  createValidDateTime,
} from 'components/@next/@utils/dates/dates';
import { reassignMissionSuccessNotification } from 'utils/notifications';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState, getAutobaseState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { carGetAndSetInStore } from 'redux-main/reducers/modules/autobase/car/actions';
import {
  actionGetMissionReassignationParameters,
  actionPostMissionReassignationParameters,
  actionPutMissionReassignationParameters,
} from 'redux-main/reducers/modules/missions/mission/actions';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import MissionLine from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/mission/form/MissionLine';
import { ReduxState } from 'redux-main/@types/state';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

type StateProps = {
  missionCancelReasonsList: IStateSomeUniq['missionCancelReasonsList'];
  carList: IStateAutobase['carList'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  mission?: Mission;
  missions?: Record<string, Mission>;
  page?: string;

  action_at: string | Date;
  isWaybillForm?: boolean;

  show: boolean;
  onReject?: (needUpdate: boolean, edcRequestIds?: State['edcRequestIds']) => any;
  onRejectForWaybill?: (obj: { payload: any; handlerName: 'actionPostMissionReassignationParameters' | 'updateMission' | 'actionPutMissionReassignationParameters';}) => any;
};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

type State = {
  missionList: Array<Mission>;
  mIndex: number;
  mission_id: Mission['id'];
  date_start: Mission['date_start'];
  date_end: Mission['date_end'];
  comment: string;
  car_id: number;
  needUpdateParent: boolean;
  reason_id: number;
  edcRequestIds: Array<{
    request_id: number;
    request_number: string;
  }>;
  data: any;
  missionById: any;
};

const formPage = 'MissionRejectForm';

class MissionRejectForm extends React.Component<Props, State> {

  public static readonly defaultProps: Partial<Props> = {
    missions: null,
    carList: [],
  };

  private static carIdFilterOptions(optionPros): boolean {
    return get(optionPros, 'data.available_to_bind', false);
  }

  private readonly makeOptionFromMissionCancelReasonsList = memoize((missionCancelReasonsList) =>
    missionCancelReasonsList.map(defaultSelectListMapper),
  );

  public constructor(props: Props) {
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
      needUpdateParent: false,
      reason_id: null, // изменить
      edcRequestIds: null,
      data: null,
      missionById: null,
    };
  }

  public componentDidMount(): void {
    this.props.dispatch(someUniqActions.actionGetAndSetInStoreMissionCancelReasons({}, { page: formPage }));
    this.updateMissionData(this.state.mission_id);
  }

  public componentDidUpdate(prevProps, prevState): void {
    if (this.state.mission_id !== prevState.mission_id) {
      this.updateMissionData(this.state.mission_id);
    }
  }

  public componentWillUnmount(): void {
    // this.props.actionResetMissionCancelReasons();
  }

  private readonly updateMissionData = (mission_id: number): void => {
    try {
      this.props.dispatch(
        missionsActions.actionGetMissionById(
          mission_id,
          { page: formPage },
        ),
      ).then((missionById) => {
        if (missionById) {
          this.getCarFuncTypesByNormId(missionById);
          this.setState({ missionById });
        }
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
    }
  };

  private readonly getCarFuncTypesByNormId = async (missionById): Promise<void> => {
    const { norm_id, date_start: norms_on_date } = missionById || {};

    if (norm_id) {
      this.props.dispatch(carGetAndSetInStore({
        norm_ids: norm_id,
        norms_on_date,
      }, { page: formPage }));
    }
  };

  private getPropsMission(
    missionList = this.state.missionList,
    mIndex = this.state.mIndex,
  ) {
    const mission = missionList[mIndex];

    const mission_id = mission.id;
    const date_start = mission.date_start;
    const date_end = mission.date_end;

    return {
      mission_id,
      date_end,
      date_start,
    };
  }

  private readonly handleChangeCarId = async (car_id: number): Promise<void> => {
    if (car_id) {
      const { missionList, mIndex } = this.state;

      const mission_id = missionList[mIndex].id;
      const payload = {
        car_id,
        mission_id,
      };
      const data = await this.props.dispatch(
        actionGetMissionReassignationParameters(
          payload,
          { page: formPage },
        ),
      );

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

  private readonly reject = (): void => {
    const { mIndex, missionList } = this.state;
    if (this.props.isWaybillForm){
      this.props.onRejectForWaybill(null);
      return;
    }
    if (mIndex === 0) {
      const { needUpdateParent } = this.state;
      this.props.onReject(needUpdateParent, this.state.edcRequestIds);
    } else {
      const newState = {
        comment: '',
        car_id: null,
        mIndex: mIndex - 1,
        ...this.getPropsMission(missionList, mIndex - 1),
      };
      this.setState(newState);
    }
  };

  private readonly handleMissionsDateChange = (mission_id, field, value): void => {
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
  };

  private readonly handleChange = (field: keyof State, e): void => {
    const value = get(e, 'target.value', e) as State[keyof State];

    this.setState((oldState) => ({
      ...oldState,
      [field]: value,
    }));
  };

  private readonly handleSubmit = async (): Promise<void> => {
    let resolve;
    let payload;
    const { action_at, isWaybillForm } = this.props;
    const { reason_id } = this.state;
    // можно хранить callback вместо имени
    // например handlerCallback = () => Promise.resolver(payload);
    // и тогда можно не передавать paylod в родителя
    let handlerName = 'actionPostMissionReassignationParameters'; // имя хендлера для ПЛ

    const status = get(
      this.props.missionCancelReasonsList.find(
        (reason) => reason.id === reason_id,
      ),
      'status',
      null,
    );

    if (!this.state.data) {
      let mission = null;
      if (!this.state.missionById) {
        // вроде как не актульно, тк при отмене в цепочке заданий идёт запрос за заданием
        try {
          mission = await this.props.dispatch(
            missionsActions.actionGetMissionById(
              this.state.mission_id,
              { page: formPage },
            ),
          );
        } catch (error) {
          console.error(error); // tslint:disable-line
        }
      } else {
        mission = {
          ...this.state.missionById,
        };
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
          resolve = await this.props.dispatch(missionsActions.actionUpdateMission(payload, { page: formPage })); // Приходит объект, а не массив
          const { request_id, request_number, close_request } = resolve;
          const successEdcRequestIds = close_request
            ? [{ request_id, request_number }]
            : null;

          this.setState({ edcRequestIds: successEdcRequestIds });
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
            resolve = await this.props.dispatch(
              actionPostMissionReassignationParameters(
                payload,
                { page: formPage },
              ),
            );
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
          handlerName = 'actionPutMissionReassignationParameters'; // рак
          if (!isWaybillForm) {
            resolve = await this.props.dispatch(
              actionPutMissionReassignationParameters(
                payload,
                { page: formPage },
              ),
            );
          }
          break;
        default:
          break;
      }
    }
    const errors_length = get(resolve, 'errors.length');

    if (!isWaybillForm && !errors_length) {
      const { missionList, mIndex } = this.state;
      global.NOTIFICATION_SYSTEM.notify(reassignMissionSuccessNotification);

      if (mIndex === 0) {
        this.props.onReject(true, this.state.edcRequestIds);
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
      this.props.onRejectForWaybill(waybillPayload as any);
    }
  };

  private get carIdOptions() {
    const { carList } = this.props;
    const { missionList, mIndex } = this.state;

    const mission = missionList[mIndex];
    const { car_gov_number: mission_car_gov_number } = mission;

    return carList.reduce((accumulator, car) => {
      const { asuods_id, gov_number } = car;

      if (mission_car_gov_number !== gov_number) {
        return [
          ...accumulator,
          { ...car, value: asuods_id, label: gov_number },
        ];
      }

      return accumulator;
    }, []);
  }

  public render(): JSX.Element {
    const { state } = this;

    const errors: Record<string, string> = {};
    const { missionList, mIndex } = state;

    const mission = missionList[mIndex];

    if (!state.reason_id) {
      errors.reason_id = 'Поле должно быть обязательно заполнено'; // убрать это чудо, после перехода на withForm
    }

    const {
      car_gov_number: mission_car_gov_number,
      number,
      // waybill_number,
    } = mission;

    const CANCEL_REASON = this.makeOptionFromMissionCancelReasonsList(
      this.props.missionCancelReasonsList,
    );

    const column_id = get(this.state, 'missionById.column_id');
    const title = `Задание №${number}, ТС: ${mission_car_gov_number}${
      column_id ? `. Колонна № ${column_id}` : ''
    }`;
    const missions = get(this.state.data, 'missions') || [];

    return (
      <React.Fragment>
        <EtsBootstrap.ModalContainer
          id="modal-mission-reject"
          show={this.props.show}
          bsSize="medium">
          <EtsBootstrap.ModalHeader>
            <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
          </EtsBootstrap.ModalHeader>

          <ModalBodyPreloader page={formPage} typePreloader="mainpage">
            <ExtField
              type="select"
              label="Введите причину:"
              value={state.reason_id}
              error={errors.reason_id}
              options={CANCEL_REASON}
              onChange={this.handleChange}
              boundKeys="reason_id"
              id="reason_id"
            />
            <ExtField
              type="select"
              label="Переназначить задание на ТС:"
              error={errors.car_id}
              options={this.carIdOptions}
              filterOption={MissionRejectForm.carIdFilterOptions}
              value={state.car_id}
              onChange={this.handleChangeCarId}
              id="car_id"
              clearable
            />
            <ExtField
              type="string"
              label="Примечание:"
              value={state.comment}
              error={errors.comment}
              onChange={this.handleChange}
              placeholder="Поле ввода дополнительной информации"
              boundKeys="comment"
              id="comment"
            />
            <br />
            {
              Boolean(missions[0]) && (
                <EtsBootstrap.Row>
                  <EtsBootstrap.Col md={12}>
                    <FieldLabel>
                      {`Задание будет добавлено в п.л. №${
                        state.data.waybill_number
                      } (Выезд: ${getFormattedDateTime(
                        state.data.waybill_plan_departure_date,
                      )}, Возвращение: ${getFormattedDateTime(
                        state.data.waybill_plan_arrival_date,
                      )})`}
                    </FieldLabel>
                    <DatePickerRange
                      date_start_id="date_start"
                      date_start_value={this.state.date_start}
                      date_start_time={true}

                      date_end_id="date_end"
                      date_end_value={this.state.date_end}
                      date_end_time={true}
                      label="Переносимое задание"
                      onChange={this.handleChange}
                    />
                  </EtsBootstrap.Col>
                </EtsBootstrap.Row>
              )
            }
            {
              missions.map((missionData) => (
                <MissionLine
                  key={missionData.id}
                  missionData={missionData}
                  onChange={this.handleMissionsDateChange}
                />
              ))
            }
          </ModalBodyPreloader>

          <EtsBootstrap.ModalFooter>
            <EtsBootstrap.Button
              disabled={!!errors.reason_id}
              onClick={this.handleSubmit}>
              Сохранить
            </EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={this.reject}>
              Отменить
            </EtsBootstrap.Button>
          </EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalContainer>
      </React.Fragment>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    missionCancelReasonsList: getSomeUniqState(state).missionCancelReasonsList,
    carList: getAutobaseState(state).carList,
  }),
)(MissionRejectForm);
