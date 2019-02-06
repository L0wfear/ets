import * as React from 'react';
import { diffDates } from 'utils/dates';
import { getDefaultMission } from 'stores/MissionsStore';
import {
  isEmpty,
} from 'utils/functions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import permissionsMission from 'components/missions/mission/config-data/permissions';
import * as Button from 'react-bootstrap/lib/Button';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { components } from 'react-select';

const ButtonCreateMission = withRequirePermissionsNew({
  permissions: permissionsMission.create,
})(Button);

class MissionField extends React.Component<any, any> {
  state = {
    showMissionForm: false,
    selectedMission: null,
  };

  multiValueContainerReander({ innerProps, data, ...props }) {
    const newInnerProps = {
      ...innerProps,
      title: data.title ? data.title : '',
    };
    return <components.MultiValueContainer innerProps={newInnerProps} {...props} />;
  }

  handleMissionsChange = (newFormData) => {
    this.props.handleChange('mission_id_list', newFormData);
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

    const countMissionMoreOne = true; // state.mission_id_list.length > 1;

    const MISSIONS = missionsList
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
      </>
    );
  }
}

export default withRequirePermissionsNew({
  permissions: permissionsMission.read,
})(MissionField);
