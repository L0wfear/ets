import * as React from 'react';
import { get } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { components } from 'react-select';

import { isEmpty } from 'utils/functions';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import ExtField from 'components/@next/@ui/renderFields/Field';

import { getWarningNotification } from 'utils/notifications';

import { ReduxState } from 'redux-main/@types/state';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import MissionRejectForm from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/mission/form/MissionRejectForm';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import styled from 'styled-components';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { componentsForMissionSelect } from './MultiValueMissionField';
import { diffDates } from 'components/@next/@utils/dates/dates';

const MissionFieldStyled = styled.div`
  margin-bottom: 15px;
  ${FieldLabel} {
    display: none;
  }
`;

type Props = {
  dispatch: EtsDispatch;
  page: string;
  path: string;
  moscowTimeServer: IStateSomeUniq['moscowTimeServer'];
  [k: string]: any;
};

class MissionField extends React.Component<Props, any> {
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
  };

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
      carList = [],
      state,
      state: { car_id },
    } = this.props;

    const carData: Car = carList.find(
      ({ asuods_id }) => asuods_id === car_id,
    );

    this.props.dispatch(missionsActions.actionSetDependenceWaybillDataForMission(this.props.state));

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
    this.props.dispatch(
      actionLoadTimeMoscow({}, this.props),
    ).then((time) => {
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
  };

  getInvalidMissionFlag = (missionElem) => {
    // про ПЛ в разных статусах уточнить!!!
    const {
      moscowTimeServer,
      IS_ACTIVE,
    } = this.props;
    if (moscowTimeServer?.date) {
      const minutesDiff = diffDates(moscowTimeServer?.date, missionElem.plan_date_start, 'minutes', false);

      const isInvalidMission = (
        IS_ACTIVE
        && missionElem.status === 'not_assigned'
        && missionElem.plan_date_start
        && minutesDiff > 15
      );

      return missionElem.plan_date_start
        ? isInvalidMission
        : false;
    }
    return false;
  };

  render() {
    const {
      state,
      errors,
      missionsList,
      notAvailableMissions,
      IS_CLOSED,
      IS_DELETE,
      isPermittedByKey,
      origFormState,
    } = this.props;

    const { rejectedMission } = this.state;

    const countMissionMoreOne = true; // state.mission_id_list.length > 1;

    const MISSIONS = missionsList // удалить отсюда задания, которые были отменены( записаны в кеш отмены)
      .map(
        (elem) => ({
          value: elem.id,
          label: `№${elem.number} (${elem.technical_operation_name})`,
          clearableValue: countMissionMoreOne,
          title: `${elem.number} - ${elem.technical_operation_name} - ${elem.municipal_facility_name}`,
          rowData: {
            // date_start
            invalidMission: this.getInvalidMissionFlag(elem),
            ...elem
          },
        }),
      );

    const OUTSIDEMISSIONS = notAvailableMissions.map(
      (elem) => ({
        value: elem.id,
        label: `№${elem.number} (${elem.technical_operation_name})`,
        clearableValue: countMissionMoreOne,
        number: elem.number,
        className: 'yellow',        // <<< не работает Сделать "в выпадающем списке и выбранном"
        rowData: {...elem},
      }),
    );

    const missionOptions = [...MISSIONS, ...OUTSIDEMISSIONS].reduce(
      (newArr, item) => {
        if (!newArr.some((innerItem) => innerItem.value === item.value)) {
          newArr.push({
            ...item,
            isNotVisible: item.rowData.invalidMission,
          });
        }
        return newArr;
      },
      [],
    );

    const errorIntervalShow = new Date(origFormState?.fact_arrival_date)?.getTime()
      > new Date(state?.fact_arrival_date)?.getTime()
      && state.status === 'active';

    const errorIntervalText = `Задания:
      ${OUTSIDEMISSIONS.map((m) => `№${m.number}`,).join(', ',)}
      не входят в интервал путевого листа. После сохранения путевого листа время задания будет уменьшено и приравнено к времени "Возвращение факт." данного путевого листа`;

    const errorInvalidTimeShow = state.mission_id_list.some((mission_id) => {
      return missionOptions.some((elem) => mission_id === elem.value && elem.rowData.invalidMission);
    });
    const errorInvalidTimeText = 'Выдавать задания можно с временем начала выполнения не раньше 15 минут от текущего. Измените время начала работ в выделенном задании или удалите его из путевого листа';

    return (
      <MissionFieldStyled>
        <h4>Задание</h4>
        <ExtField
          id="mission-id-list"
          type="select"
          label={false}
          error={errors.mission_id_list}
          multi
          className="task-container"
          options={missionOptions}
          value={state.mission_id_list}
          disabled={
            IS_DELETE || isEmpty(state.car_id) || IS_CLOSED || !isPermittedByKey.update
          }
          clearable={false}
          onChange={this.handleMissionsChange}
          multiValueContainerReander={this.multiValueContainerReander}
          components={componentsForMissionSelect}
        />
        <ErrorsBlock
          hidden={!errorIntervalShow}
          error={errorIntervalText}
        />
        <ErrorsBlock
          hidden={!errorInvalidTimeShow}
          error={errorInvalidTimeText}
        />

        <EtsBootstrap.Button
          id="create-mission"
          style={{ marginTop: 10 }}
          onClick={this.createMission}
          permissions={missionPermissions.create}
          disabled={
            IS_DELETE || isEmpty(state.car_id) || IS_CLOSED || !isPermittedByKey.update
          }>
          Создать задание
        </EtsBootstrap.Button>
        <MissionFormLazy
          handleHide={this.onMissionFormHide}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
          notChangeCar
          type={null}

          registryKey={this.props.registryKey}
          page={this.props.page}
          path={this.props.path}
        />
        {this.state.showMissionRejectForm && (
          <MissionRejectForm
            show={this.state.showMissionRejectForm}
            onRejectForWaybill={this.onReject}
            mission={rejectedMission}
            // missions={missionsList}
            action_at={this.state.action_at}
            isWaybillForm
          />
        )}
      </MissionFieldStyled>
    );
  }
}

export default compose<any, any>(
  withRequirePermission({
    permissions: missionPermissions.read,
  }),
  connect<null, { dispatch: EtsDispatch; }, any, ReduxState>(
    null,
  ),
)(MissionField);
