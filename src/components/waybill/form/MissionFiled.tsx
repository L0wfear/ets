import * as React from 'react';
import { diffDates } from 'utils/dates';
import { getDefaultMission } from 'stores/MissionsStore';
import {
  isEmpty,
} from 'utils/functions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import permissionsMission from 'components/missions/mission/config-data/permissions';
import * as Button from 'react-bootstrap/lib/Button';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { components } from 'react-select';
import MissionRejectForm from 'components/missions/mission/MissionRejectForm';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';
import { getWarningNotification } from 'utils/notifications';

const ButtonCreateMission = enhanceWithPermissions({
  permission: permissionsMission.create,
})(Button);

class MissionField extends React.Component<any, any> {
  state = {
    showMissionForm: false,
    selectedMission: null,
    showMissionRejectForm: false,
    status: '',
    action_at: '',
    mission_id_list: [],
    tempMissionIdList: [], // Временный массив, пока открыта rejectForm
    rejectMissionList: [], // Массив с заданиями, которые надо будет отменить
    rejectedMission: {},
  };

  multiValueContainerReander({ innerProps, data, ...props }) {
    const newInnerProps = {
      ...innerProps,
      title: data.title ? data.title : '',
    };
    return <components.MultiValueContainer innerProps={newInnerProps} {...props} />;
  }

  handleMissionsChange = (newFormData) => {
    // Если удаляем миссию и статус ПЛ Активен
    if ( newFormData.length < this.props.state.mission_id_list.length && this.props.state.status === 'active' ) {
      const deletedElement = this.props.missionsList.filter((mission: any) => {
        return newFormData.indexOf(mission.id) === -1;
      });
      const car_gov_number = this.props.state.gov_number;
      const rejectedMission = {
        ...deletedElement.length ? deletedElement[0] : null,
        car_gov_number,
      };
      if (rejectedMission.can_be_closed) {
        this.rejectMission(rejectedMission);
        this.setState({
          tempMissionIdList: newFormData,
          rejectedMission,
        });
      } else {
        this.props.handleChange('mission_id_list', newFormData);
      }
    } else {
      this.props.handleChange('mission_id_list', newFormData);
    }
  }

  onMissionFormHide = (result) => {
    const id = result && result.result ? result.result.id : null;
    if (id) {
      const { mission_id_list: [...mission_id_list] } = this.props.state;
      mission_id_list.push(id);
      this.props.handleChange('mission_id_list', mission_id_list);
      this.props.getMissionsByCarAndDates({ ...this.props.state, mission_id_list }, false);
    }

    this.setState({ showMissionForm: false, selectedMission: null });
  }

  createMission = () => {
    const {
      carsList = [],
      state,
      state: {
        car_id,
        plan_departure_date,
        fact_departure_date,
        status,
      },
    } = this.props;

    const { type_id } = carsList.find(({ asuods_id }) => asuods_id === car_id) || { type_id: null };

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
  }

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
        !errorIsShow && global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Произошла непредвиденная ошибка!'));
      });
  }

  onReject = (waybillPayload) => {
    const {
      tempMissionIdList,
      rejectMissionList,
    } = this.state;
    const newPropsState = {
      showMissionRejectForm: false,
      rejectMissionList,
    };
    // если НЕ!!! нажали на отмену или крестик в rejectForm
    if (waybillPayload) {
      this.props.handleChange('mission_id_list', tempMissionIdList);
      const inList = rejectMissionList.find(
        (mission) => mission.payload.mission_id === waybillPayload.payload.mission_id,
      );
      if (!inList) {
        newPropsState.rejectMissionList = [ ...rejectMissionList, waybillPayload ];
        this.props.setRejectMissionList(newPropsState.rejectMissionList);
      }
    }
    this.setState({ ...newPropsState });
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

    const {
      rejectedMission,
    } = this.state;

    const countMissionMoreOne = true; // state.mission_id_list.length > 1;

    const MISSIONS = missionsList // удалить отсюда задания, которые были отменены( записаны в кеш отмены)
      .map(({ id, number, technical_operation_name, municipal_facility_name }) => ({
        value: id,
        label: `№${number} (${technical_operation_name})`,
        clearableValue: countMissionMoreOne,
        title: `${number} - ${technical_operation_name} - ${municipal_facility_name}`,
      }));

    const OUTSIDEMISSIONS = notAvailableMissions
      .map(({ id, number, technical_operation_name }) => ({
        value: id,
        label: `№${number} (${technical_operation_name})`,
        clearableValue: countMissionMoreOne,
        number,
        className: 'yellow',
      }));
    const missionOptions = [ ...MISSIONS, ...OUTSIDEMISSIONS ].reduce( (newArr, item) => {
      if (!newArr.some( (innerItem) => innerItem.value === item.value )) {
        newArr.push(item);
      }
      return newArr;
    }, []);

    return (
      <>
        <h4>Задание</h4>
        <ExtField
          id="mission-id-list"
          type="select"
          error={errors.mission_id_list}
          multi
          className="task-container"
          options={missionOptions}
          value={state.mission_id_list}
          disabled={isEmpty(state.car_id) || IS_CLOSED || !isPermittedByKey.update}
          clearable={false}
          onChange={this.handleMissionsChange}
          multiValueContainerReander={this.multiValueContainerReander}
        />
        {(new Date(origFormState.fact_arrival_date).getTime() > new Date(state.fact_arrival_date).getTime()) && (state.status === 'active') && (
          <div style={{ color: 'red' }}>{`Задания: ${OUTSIDEMISSIONS.map((m) => `№${m.number}`).join(', ')} не входят в интервал путевого листа. После сохранения путевого листа время задания будет уменьшено и приравнено к времени "Возвращение факт." данного путевого листа`}</div>
        )}
        <ButtonCreateMission
          id="create-mission"
          style={{ marginTop: 10 }}
          onClick={this.createMission}
          disabled={isEmpty(state.car_id) || IS_CLOSED || !isPermittedByKey.update}
        >
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
        {
          this.state.showMissionRejectForm
          && (
            <MissionRejectForm
              show={this.state.showMissionRejectForm}
              onReject={this.onReject}
              mission={rejectedMission}
              // missions={missionsList}
              action_at={this.state.action_at}
              isWaybillForm
            />
          )
        }
      </>
    );
  }
}

export default enhanceWithPermissions({
  permission: permissionsMission.read,
})(MissionField);
