import * as React from 'react';
import { diffDates } from 'utils/dates';
import { getDefaultMission } from 'stores/MissionsStore';
import { isEmpty } from 'utils/functions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import permissionsMission from 'components/missions/mission/config-data/permissions';
import * as Button from 'react-bootstrap/lib/Button';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { components } from 'react-select';
import MissionRejectForm from 'components/missions/mission/MissionRejectForm';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';
import { getWarningNotification } from 'utils/notifications';

const ButtonCreateMission = withRequirePermissionsNew({
  permissions: permissionsMission.create,
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
        state: {
          mission_id_list,
          gov_number: car_gov_number,
        },
      } = this.props;

      const deletedElementId = mission_id_list.find((mission: any) =>
        !newFormData.includes(mission),
      );

      const deletedElement = missionsList.find((mission) =>
        mission.id === deletedElementId,
      );

      const rejectedMission = {
        ...deletedElement,
        car_gov_number,
      };

      if (rejectedMission.can_be_closed) {
        this.rejectMission(rejectedMission);
        return;
      }
    }
    this.props.handleChange('mission_id_list', newFormData);
  }

  onMissionFormHide = (result) => {
    const id = result && result.result ? result.result.id : null;
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

    this.setState({ showMissionForm: false, selectedMission: null });
  };

  createMission = () => {
    const {
      carsList = [],
      state,
      state: { car_id, plan_departure_date, fact_departure_date, status },
    } = this.props;

    const { type_id } = carsList.find(
      ({ asuods_id }) => asuods_id === car_id,
    ) || { type_id: null };

    const IS_ACTIVE = status === 'active';
    const IS_DRAFT = status === 'draft';
    let date_start;

    if (IS_DRAFT && diffDates(plan_departure_date, new Date()) > 0) {
      date_start = plan_departure_date;
    } else if (IS_ACTIVE && diffDates(fact_departure_date, new Date()) > 0) {
      date_start = fact_departure_date;
    }

    this.setState({
      showMissionForm: true,
      selectedMission: {
        ...getDefaultMission(date_start, state.plan_arrival_date),
        car_id,
        type_id,
        structure_id: state.structure_id,
      },
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
        mission_id_list.filter((id) =>
          id !== waybillPayload.payload.mission_id,
        ),
      );

      this.props.setRejectMissionList(
        [
          ...rejectMissionList,
          waybillPayload,
        ],
      );
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
        <MissionFormWrap
          onFormHide={this.onMissionFormHide}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
          fromWaybill
          withDefineCarId
          waybillStartDate={state.plan_departure_date}
          waybillEndDate={state.plan_arrival_date}
          {...this.props}
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

export default withRequirePermissionsNew({
  permissions: permissionsMission.read,
})(MissionField);
