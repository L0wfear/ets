
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
import { addTime, createValidDateTime, addSecond } from 'components/@next/@utils/dates/dates';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { actionLoadConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/actions';

/**
 * Поля дат наряд-задания (плановые и фактические)
 */
class FieldDatesDutyMission extends React.PureComponent<PropsFieldDatesDutyMission, StateFieldDatesDutyMission> {
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

  handleChangeDateStart = async (field: string, date) => {
    if (this.props.formDataKey === 'duty_mission') {
      const {
        plan_date_start,
        norm_id,
        municipal_facility_id,
        route_id,
        id,
        consumable_materials,
        order_operation_id,
      } = this.props;

      const date_start = date || (field === 'fact_date_start' ? plan_date_start : null);

      if (!date_start && consumable_materials[0]) {
        try {
          await global.confirmDialog({
            title: 'Внимание!',
            body: ' При удалении даты начала задания будет очищена таблица расходных материалов. Продолжить?',
          });
        } catch {
            // реакт виджет хранит своё состояние
            // если не менять пропсов, то он показывает старое время
            const { fact_date_start: old } = this.props;
            const { plan_date_start: old_2 } = this.props;
            if (old) {
              await this.props.onChange({ fact_date_start: createValidDateTime(addSecond(old, 60)) });

              setImmediate(() => this.props.onChange({ fact_date_start: old }));
              return;
            }
            await this.props.onChange({ plan_date_start: createValidDateTime(addSecond(old_2, 60)) });

            setImmediate(() => this.props.onChange({ plan_date_start: old_2 }));
            return;
        }
      }

      if (norm_id && municipal_facility_id && (date_start) && route_id && consumable_materials[0]) {
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
              body: 'В наряд задании: "При изменении начала выполнения наряд-задания будут изменены нормы на расход расходных материалов. Продолжить?',
            });
          } catch {
            // реакт виджет хранит своё состояние
            // если не менять пропсов, то он показывает старое время
            const { fact_date_start: old } = this.props;
            const { plan_date_start: old_2 } = this.props;
            if (old) {
              await this.props.onChange({ fact_date_start: createValidDateTime(addSecond(old, 60)) });

              setImmediate(() => this.props.onChange({ fact_date_start: old }));
              return;
            }
            this.props.onChange({ plan_date_start: createValidDateTime(addSecond(old_2, 60)) });

            await setImmediate(() => this.props.onChange({ plan_date_start: old_2 }));
            return;
          }
        }
      }
    }
    this.props.onChange({ [field]: date });
  }

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
          <EtsBootstrap.Col md={12}>
            <label>Время выполнения, планируемое:</label>
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
