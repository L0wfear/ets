import * as React from 'react';
import { get } from 'lodash';
import { isEmpty } from 'utils/functions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import * as Button from 'react-bootstrap/lib/Button';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { ExtField } from 'components/ui/new/field/ExtField';
import { components } from 'react-select';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';
import { getWarningNotification } from 'utils/notifications';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import MissionRejectForm from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/mission/form/MissionRejectForm';

const ButtonCreateMission = withRequirePermissionsNew({
  permissions: missionPermissions.create,
})(Button);

class MissionField extends React.Component<any, any> {
  state = {
    showMissionForm: false,
    selectedMission: null,
    showMissionRejectForm: false,
    status: '',
    action_at: '',
    mission_id_list: [],
    rejectedMission: null,
  };

  multiValueContainerReander({ innerProps, data, ...props }) {
    const newInnerProps = {
      ...innerProps,
      title: data.title ? data.title : '',
    };
    return (
      <components.MultiValueContainer innerProps={newInnerProps} {...props} />
    );
  }

  handleMissionsChange = (newFormData) => {
    // Если удаляем миссию и статус ПЛ Активен
    if ( newFormData.length < this.props.state.mission_id_list.length && this.props.state.status === 'active' ) {
      const {
        missionsList,
        state: { mission_id_list, gov_number: car_gov_number },
      } = this.props;

      const deletedElementId = mission_id_list.find(
        (mission: any) => !newFormData.includes(mission),
      );

      const deletedElement = missionsList.find((mission) =>
        mission.id === deletedElementId,
      );

      const rejectedMission = {
        ...deletedElement,
        car_gov_number,
      };

      if (rejectedMission.can_be_closed_wb) {
        this.rejectMission(rejectedMission);
        return;
      }
    }
    this.props.handleChange('mission_id_list', newFormData);
  }

  onMissionFormHide = (isSubmitted, result) => {
    if (isSubmitted) {
      const id = get(result, 'id', null);

      if (id) {
        const {
          car_id,
          mission_id_list: [...mission_id_list],
        } = this.props.state;
        mission_id_list.push(id);
        this.props.handleChange('mission_id_list', mission_id_list);
        this.props.getMissionsByCarAndDates(
          { ...this.props.state, mission_id_list },
          car_id,
          false,
        );
      }
    }

    this.setState({
      showMissionForm: false,
      selectedMission: null,
    });
  };

  createMission = () => {
    const {
      carsList = [],
      state,
      state: { car_id },
    } = this.props;

    const carData: Car = carsList.find(
      ({ asuods_id }) => asuods_id === car_id,
    );

    this.props.actionSetDependenceWaybillDataForMission(this.props.state);

    const selectedMission: Partial<Mission> = {
      car_gov_numbers: [get(carData, 'gov_number', null)],
      car_ids: [car_id],
      car_model_names: [get(carData, 'model_name', null)],
      car_special_model_names: [get(carData, 'special_model_name', null)],
      car_type_ids: [get(carData, 'type_id', null)],
      car_type_names: [get(carData, 'type_name', null)],
      structure_id: state.structure_id,
      waybill_id: this.props.state.id || -1,
      date_start: this.props.state.fact_departure_date || this.props.state.plan_departure_date,
      date_end: this.props.state.fact_arrival_date || this.props.state.plan_arrival_date,
    };

    this.setState({
      showMissionForm: true,
      selectedMission,
    });
  };

  rejectMission = (rejectedMission) => {
    loadMoscowTime()
      .then(({ time }) => {
        const action_at = time.date;
        this.setState({
          showMissionRejectForm: true,
          action_at,
          rejectedMission,
        });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(
            getWarningNotification('Произошла непредвиденная ошибка отмены!'),
          );
        }
      });
  };

  onReject = (waybillPayload) => {
    const {
      rejectMissionList,
    } = this.props;

    // если НЕ!!! нажали на отмену или крестик в rejectForm
    if (waybillPayload) {
      const {
        state: { mission_id_list },
      } = this.props;

      this.props.handleChange(
        'mission_id_list',
        mission_id_list.filter(
          (id) => id !== waybillPayload.payload.mission_id,
        ),
      );

      this.props.setRejectMissionList([...rejectMissionList, waybillPayload]);
    }

    this.setState({
      showMissionRejectForm: false,
      rejectedMission: null,
    });
  }

  render() {
    const {
      state,
      errors,
      missionsList,
      notAvailableMissions,
      IS_CLOSED,
      isPermittedByKey,
      origFormState,
    } = this.props;

    const { rejectedMission } = this.state;

    const countMissionMoreOne = true; // state.mission_id_list.length > 1;

    const MISSIONS = missionsList // удалить отсюда задания, которые были отменены( записаны в кеш отмены)
      .map(
        ({
          id,
          number,
          technical_operation_name,
          municipal_facility_name,
        }) => ({
          value: id,
          label: `№${number} (${technical_operation_name})`,
          clearableValue: countMissionMoreOne,
          title: `${number} - ${technical_operation_name} - ${municipal_facility_name}`,
        }),
      );

    const OUTSIDEMISSIONS = notAvailableMissions.map(
      ({ id, number, technical_operation_name }) => ({
        value: id,
        label: `№${number} (${technical_operation_name})`,
        clearableValue: countMissionMoreOne,
        number,
        className: 'yellow',
      }),
    );
    const missionOptions = [...MISSIONS, ...OUTSIDEMISSIONS].reduce(
      (newArr, item) => {
        if (!newArr.some((innerItem) => innerItem.value === item.value)) {
          newArr.push(item);
        }
        return newArr;
      },
      [],
    );

    return (
      <>
        <h4>Задание</h4>
        <ExtField
          id="mission-id-list"
          type="select"
          label="&nbsp;"
          error={errors.mission_id_list}
          multi
          className="task-container"
          options={missionOptions}
          value={state.mission_id_list}
          disabled={
            isEmpty(state.car_id) || IS_CLOSED || !isPermittedByKey.update
          }
          clearable={false}
          onChange={this.handleMissionsChange}
          multiValueContainerReander={this.multiValueContainerReander}
        />
        {new Date(origFormState.fact_arrival_date).getTime() >
          new Date(state.fact_arrival_date).getTime() &&
          state.status === 'active' && (
            <div style={{ color: 'red' }}>{`Задания: ${OUTSIDEMISSIONS.map(
              (m) => `№${m.number}`,
            ).join(
              ', ',
            )} не входят в интервал путевого листа. После сохранения путевого листа время задания будет уменьшено и приравнено к времени "Возвращение факт." данного путевого листа`}</div>
          )}
        <ButtonCreateMission
          id="create-mission"
          style={{ marginTop: 10 }}
          onClick={this.createMission}
          disabled={
            isEmpty(state.car_id) || IS_CLOSED || !isPermittedByKey.update
          }>
          Создать задание
        </ButtonCreateMission>
        <MissionFormLazy
          onFormHide={this.onMissionFormHide}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
          notChangeCar
        />
        {this.state.showMissionRejectForm && (
          <MissionRejectForm
            show={this.state.showMissionRejectForm}
            onReject={this.onReject}
            mission={rejectedMission}
            // missions={missionsList}
            action_at={this.state.action_at}
            isWaybillForm
          />
        )}
      </>
    );
  }
}

export default compose<any, any>(
  withRequirePermissionsNew({
    permissions: missionPermissions.read,
  }),
  connect<null, { actionSetDependenceWaybillDataForMission: HandleThunkActionCreator<typeof missionsActions.actionSetDependenceWaybillDataForMission>}, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionSetDependenceWaybillDataForMission: (...arg) => (
        dispatch(
          missionsActions.actionSetDependenceWaybillDataForMission(...arg),
        )
      ),
    }),
  ),
)(MissionField);
