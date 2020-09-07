
import * as React from 'react';
import { connect } from 'react-redux';
import { get, keyBy } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldDatesDutyMission,
  StatePropsFieldDatesDutyMission,
  DispatchPropsFieldDatesDutyMission,
  OwnPropsFieldDatesDutyMission,
  StateFieldDatesDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/dates/FieldDatesDutyMission.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';

import {
  ColStartDatePicker,
  ColDividerDatePicker,
  ColEndDatePicker,
} from './styled';
import { routeTypesByTitle } from 'constants/route';
import {
  addTime,
  createValidDateTime,
  addSecond,
  diffDates, getTomorrow9amMoscowServerTime
} from 'components/@next/@utils/dates/dates';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { actionLoadConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/actions';
import {actionLoadTimeMoscow} from '../../../../../../../../../redux-main/reducers/modules/some_uniq/time_moscow/actions';

/**
 * Поля дат наряд-задания (плановые и фактические)
 */
class FieldDatesDutyMission extends React.PureComponent<PropsFieldDatesDutyMission, StateFieldDatesDutyMission> {
  componentDidMount() {
    const {
      plan_date_start,
      plan_date_end,
      IS_CREATING,
    } = this.props;

    if (IS_CREATING && plan_date_start && plan_date_end) {
      this.updateDateStartByCurrentTime();
    }
  }
  componentDidUpdate(prevProps) {
    const {
      is_cleaning_norm,
      plan_date_start,
      object_type_name,
      norm_id,
    } = this.props;

    if (prevProps.norm_id !== norm_id && is_cleaning_norm && plan_date_start && object_type_name) {
      if (is_cleaning_norm && plan_date_start && object_type_name) {
        const time = get(routeTypesByTitle, `${object_type_name}.time`, null);
        if (time) {
          this.props.onChange({
            plan_date_end: addTime(
              plan_date_start,
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

    const currentTime = createValidDateTime(date);

    const { plan_date_start, plan_date_end } = this.props;
    if (diffDates(currentTime, plan_date_start) !== 0 || diffDates(getTomorrow9amMoscowServerTime(currentTime), plan_date_end) !== 0) {
      this.props.onChange({
        plan_date_start: currentTime,
        plan_date_end: createValidDateTime(getTomorrow9amMoscowServerTime(currentTime)),
      });
    }
  }

  handleChangeDateStart = async (field: keyof Pick<PropsFieldDatesDutyMission, 'fact_date_start' | 'plan_date_start'>, date) => {
    if (this.props.formDataKey === 'duty_mission') {
      const {
        fact_date_start,
        plan_date_start,
        norm_id,
        municipal_facility_id,
        route_id,
        id,
        consumable_materials,
        order_operation_id,
      } = this.props;

      const date_start = date || fact_date_start || plan_date_start;

      if (!date_start && consumable_materials[0]) {
        try {
          await global.confirmDialog({
            title: 'Внимание!',
            body: ' При удалении даты начала задания будет очищена таблица расходных материалов. Продолжить?',
          });
        } catch {
          // реакт виджет хранит своё состояние
          // если не менять пропсов, то он показывает старое время
          const { [field]: old } = this.props;
          await this.props.onChange({ [field]: createValidDateTime(addSecond(old, 60)) });

          setImmediate(() => this.props.onChange({ [field]: old }));
          return;
        }
      }

      if (norm_id && municipal_facility_id && date_start && route_id && consumable_materials[0]) {
        const payload: Parameters<typeof actionLoadConsumableMaterialCountMission>[0] = {
          type: 'duty_mission',
          norm_id,
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

        const { data: consumableMaterialCountMissionList } = await this.props.dispatch(actionLoadConsumableMaterialCountMission(payload, { ...this.props, noTimeout: true, }));
        const consumableMaterialCountMissionListIndex = keyBy(consumableMaterialCountMissionList, 'consumable_material_id');

        const triggerOnAsk = (
          consumable_materials.some((rowData) => (
            !consumableMaterialCountMissionListIndex[rowData.consumable_material_id]
            || consumableMaterialCountMissionListIndex[rowData.consumable_material_id].consumable_material_norm_id !== rowData.consumable_material_norm_id
          ))
        );

        if (triggerOnAsk) {
          try {
            await global.confirmDialog({
              title: 'Внимание!',
              body: 'При изменении начала выполнения наряд-задания будут изменены нормы на расход расходных материалов. Продолжить?',
            });
          } catch {
            // реакт виджет хранит своё состояние
            // если не менять пропсов, то он показывает старое время
            const { plan_date_start: old } = this.props;
            this.props.onChange({ plan_date_start: createValidDateTime(addSecond(old, 60)) });

            await setImmediate(() => this.props.onChange({ plan_date_start: old }));
            return;
          }
        }
      }
    }
    this.props.onChange({ [field]: date });
  };

  render() {
    const {
      isPermitted,

      plan_date_start,
      error_plan_date_start,
      plan_date_end,
      error_plan_date_end,
      fact_date_start,
      error_fact_date_start,
      fact_date_end,
      error_fact_date_end,

      DUTY_MISSION_IS_DISPLAY,
      DUTY_MISSION_IS_CLOSED,
      DUTY_MISSION_IS_ASSIGNED,
      DUTY_MISSION_IS_COMPLETED,
    } = this.props;

    return (
      <>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <label>Время выполнения, планируемое, c:</label>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <label>Время выполнения, планируемое, по:</label>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <ColStartDatePicker md={5}>
            <ExtField
              id="plan-date-start"
              type="date"
              label={false}
              error={error_plan_date_start}
              date={plan_date_start}
              disabled={DUTY_MISSION_IS_DISPLAY || !isPermitted}
              onChange={this.handleChangeDateStart}
              boundKeys="plan_date_start"
            />
          </ColStartDatePicker>
          <ColDividerDatePicker md={2}>
            —
          </ColDividerDatePicker>
          <ColEndDatePicker md={5}>
            <ExtField
              id="plan-date-end"
              type="date"
              label={false}
              error={error_plan_date_end}
              date={plan_date_end}
              disabled={DUTY_MISSION_IS_DISPLAY || !isPermitted}
              onChange={this.props.onChange}
              boundKeys="plan_date_end"
            />
          </ColEndDatePicker>
        </EtsBootstrap.Row>
        {
          (DUTY_MISSION_IS_ASSIGNED || DUTY_MISSION_IS_COMPLETED)
            ? (
              <>
                <EtsBootstrap.Row>
                  <EtsBootstrap.Col md={12}>
                    <label>Время выполнения, фактическое:</label>
                  </EtsBootstrap.Col>
                </EtsBootstrap.Row>
                <EtsBootstrap.Row>
                  <ColStartDatePicker md={5}>
                    <ExtField
                      id="fact-date-start"
                      type="date"
                      label={false}
                      error={error_fact_date_start}
                      date={fact_date_start}
                      disabled={DUTY_MISSION_IS_CLOSED || !isPermitted}
                      onChange={this.handleChangeDateStart}
                      boundKeys="fact_date_start"
                    />
                  </ColStartDatePicker>
                  <ColDividerDatePicker md={2}>
                    <div>—</div>
                  </ColDividerDatePicker>
                  <ColEndDatePicker md={5}>
                    <ExtField
                      id="fact-date-end"
                      type="date"
                      label={false}
                      error={error_fact_date_end}
                      date={fact_date_end}
                      disabled={DUTY_MISSION_IS_CLOSED || !isPermitted}
                      onChange={this.props.onChange}
                      boundKeys="fact_date_end"
                    />
                  </ColEndDatePicker>
                </EtsBootstrap.Row>
              </>
            )
            : (
              <DivNone />
            )
        }
      </>
    );
  }
}

export default connect<StatePropsFieldDatesDutyMission, DispatchPropsFieldDatesDutyMission, OwnPropsFieldDatesDutyMission, ReduxState>(
  (state) => ({
    technicalOperationRegistryForDutyMissionList: getSomeUniqState(state).technicalOperationRegistryForDutyMissionList,
  }),
)(FieldDatesDutyMission);
