
import * as React from 'react';
import { connect } from 'react-redux';
import { ExtField } from 'components/old/ui/new/field/ExtField';
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
import { get } from 'lodash';

import {
  ColStartDatePicker,
  ColDividerDatePicker,
  ColEndDatePicker,
} from './styled';
import { routeTypesByTitle } from 'constants/route';
import { addTime } from 'utils/dates';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
              onChange={this.props.onChange}
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
                      onChange={this.props.onChange}
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
