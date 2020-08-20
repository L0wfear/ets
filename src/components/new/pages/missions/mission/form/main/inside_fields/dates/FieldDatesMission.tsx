import * as React from 'react';
import { connect } from 'react-redux';
import { get, keyBy } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ReduxState } from 'redux-main/@types/state';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

import {
  ColStartDatePickerWithDropdown,
  ColDividerDatePicker,
  ColEndDatePicker,
  ExtFieldDateStartWrap,
  FieldDatesMissionContainer,
} from './styled';
import { getTomorrow9amMoscowServerTime, addTime, getDateWithMoscowTzByTimestamp, createValidDateTime, diffDates, addSecond } from 'components/@next/@utils/dates/dates';
import { routeTypesByTitle } from 'constants/route';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/actions';

type StateProps = {};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type OwnProps = {
  isPermitted: boolean;
  date_start: Mission['date_start'];
  error_date_start: string;
  date_end: Mission['date_end'];
  error_date_end: string;

  onChange: (obj: Partial<Mission>) => void;

  norm_ids: Mission['norm_ids'];
  is_cleaning_norm: Mission['is_cleaning_norm'];
  consumable_materials: Mission['consumable_materials'];
  order_operation_id: Mission['order_operation_id'];
  municipal_facility_id: Mission['municipal_facility_id'];

  route_id: Mission['route_id'];
  id: Mission['id'];
  object_type_name: Mission['object_type_name'];

  IS_CREATING?: boolean;
  MISSION_IS_ORDER_SOURCE?: boolean;

  disabled: boolean;
  page: string;
  path: string;
};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

class FieldDatesMission extends React.PureComponent<Props, {}> {
  componentDidMount() {
    const {
      IS_CREATING,
      date_start,
      date_end,
    } = this.props;

    if (IS_CREATING && date_start && date_end) {
      this.updateDateStartByCurrentTime();
    }
  }
  componentDidUpdate(prevProps) {
    const {
      is_cleaning_norm,
      date_start,
      object_type_name,
      norm_ids,
    } = this.props;
    if (prevProps.norm_ids !== norm_ids && is_cleaning_norm && date_start && object_type_name) {
      if (is_cleaning_norm && date_start && object_type_name) {
        const time = get(routeTypesByTitle, `${object_type_name}.time`, null);
        if (time) {
          this.props.onChange({
            date_end: addTime(
              date_start,
              time,
              'hours',
            ),
          });
        }
      }
    }
  }

  async updateDateStartByCurrentTime() {
    const {
      date,
    } = await this.props.dispatch(
      actionLoadTimeMoscow(
        {},
        {
          page: this.props.page,
          path: this.props.path,
        },
      ),
    );

    const currentTime = createValidDateTime(getDateWithMoscowTzByTimestamp(date));

    const { date_start, date_end } = this.props;

    if (diffDates(currentTime, date_start) > 0 && diffDates(getTomorrow9amMoscowServerTime(currentTime), date_end) > 0) {
      this.props.onChange({
        date_start: currentTime,
        date_end: getTomorrow9amMoscowServerTime(currentTime),
      });
    }
  }

  handleChangeDateStart = async (date_start) => {
    const {
      is_cleaning_norm,
      object_type_name,
      norm_ids,
      municipal_facility_id,
      route_id,
      id,
      consumable_materials,
      order_operation_id,
    } = this.props;

    if (!date_start && consumable_materials[0]) {
      try {
        await global.confirmDialog({
          title: 'Внимание!',
          body: ' При удалении даты начала задания будет очищена таблица расходных материалов. Продолжить?',
        });
      } catch {
        // реакт виджет хранит своё состояние
        // если не менять пропсов, то он показывает старое время
        const { date_start: old } = this.props;
        await this.props.onChange({ date_start: createValidDateTime(addSecond(old, 60), true) });
        setImmediate(() => this.props.onChange({ date_start: old }));
        return;
      }
    }

    if (norm_ids.length && municipal_facility_id && date_start && route_id && consumable_materials[0]) {
      const payload: Parameters<typeof actionLoadConsumableMaterialCountMission>[0] = {
        type: 'mission',
        norm_id: norm_ids[0],
        municipal_facility_id,
        date: date_start,
        route_id,
      };

      if (id) {
        payload.mission_id = id;
      }
      if (order_operation_id) {
        payload.order_operation_id = order_operation_id;
      }

      const { data: ConsumableMaterialCountMissionList } = await this.props.dispatch(actionLoadConsumableMaterialCountMission(payload, this.props));
      const ConsumableMaterialCountMissionListIndex = keyBy(ConsumableMaterialCountMissionList, 'consumable_material_id');

      const triggerOnAsk = (
        ConsumableMaterialCountMissionList.length !== consumable_materials.length
        || consumable_materials.some((rowData) => (
          !ConsumableMaterialCountMissionListIndex[rowData.consumable_material_id]
          || ConsumableMaterialCountMissionListIndex[rowData.consumable_material_id].consumable_material_norm_id !== rowData.consumable_material_norm_id
        ))
      );

      if (triggerOnAsk) {
        try {
          await global.confirmDialog({
            title: 'Внимание!',
            body: 'При изменении начала выполнения задания будут изменены нормы на расход расходных материалов. Продолжить?',
          });
        } catch {
          // реакт виджет хранит своё состояние
          // если не менять пропсов, то он показывает старое время
          const { date_start: old } = this.props;
          await this.props.onChange({ date_start: createValidDateTime(addSecond(old, 60), true)});
          setImmediate(() => this.props.onChange({ date_start: old }));
          return;
        }
      }
    }

    if (norm_ids && is_cleaning_norm && date_start && object_type_name) {
      if (is_cleaning_norm && date_start && object_type_name) {
        const time = get(routeTypesByTitle, `${object_type_name}.time`, null);
        if (time) {
          this.props.onChange({
            date_start,
            date_end: addTime(
              date_start,
              time,
              'hours',
            ),
          });
        }
      }
    } else {
      this.props.onChange({ date_start });
    }
  };

  handleChangeHoursDateEnd = (countHours) => {
    const { date_start } = this.props;

    if (date_start) {
      this.props.onChange({
        date_end: addTime(date_start, Number(countHours), 'hours'),
      });
    }
  };

  render() {
    const {
      isPermitted,

      date_start,
      error_date_start,
      date_end,
      error_date_end,
    } = this.props;

    return (
      <FieldDatesMissionContainer>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <FieldLabel>Время выполнения:</FieldLabel>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <ColStartDatePickerWithDropdown md={5}>
            <ExtFieldDateStartWrap
              id="date-start"
              type="date"
              label={false}
              error={error_date_start}
              value={date_start}
              disabled={!isPermitted || this.props.disabled}
              onChange={this.handleChangeDateStart}
            />
            <EtsBootstrap.Dropdown
              id="date-end-dropdown"
              disabled={
                !isPermitted
                || !date_start
                || this.props.disabled
              }
              title="Продолжительность задания, ч"
              toggleElement={<EtsBootstrap.Glyphicon id="select-date_end" glyph="time" />}
              toggleElementSize="input"
            >
              <EtsBootstrap.DropdownMenu>
                <EtsBootstrap.MenuItem eventKey={1} onSelect={this.handleChangeHoursDateEnd}>1</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={2} onSelect={this.handleChangeHoursDateEnd}>2</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={3} onSelect={this.handleChangeHoursDateEnd}>3</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={4} onSelect={this.handleChangeHoursDateEnd}>4</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={5} onSelect={this.handleChangeHoursDateEnd}>5</EtsBootstrap.MenuItem>
              </EtsBootstrap.DropdownMenu>
            </EtsBootstrap.Dropdown>
          </ColStartDatePickerWithDropdown>
          <ColDividerDatePicker md={2}>
            <div>—</div>
          </ColDividerDatePicker>
          <ColEndDatePicker md={5}>
            <ExtField
              id="date-end"
              type="date"
              label={false}
              error={error_date_end}
              date={date_end}
              disabled={
                !isPermitted
                || this.props.disabled
              }
              onChange={this.props.onChange}
              boundKeys="date_end"
            />
          </ColEndDatePicker>
        </EtsBootstrap.Row>
      </FieldDatesMissionContainer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
  }),
)(FieldDatesMission);
