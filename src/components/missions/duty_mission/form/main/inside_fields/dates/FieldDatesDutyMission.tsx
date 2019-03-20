
import * as React from 'react';
import { connect } from 'react-redux';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldDatesDutyMission,
  StatePropsFieldDatesDutyMission,
  DispatchPropsFieldDatesDutyMission,
  OwnPropsFieldDatesDutyMission,
  StateFieldDatesDutyMission,
} from 'components/missions/duty_mission/form/main/inside_fields/dates/FieldDatesDutyMission.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';

import {
  ColStartDatePicker,
  ColDividerDatePicker,
  ColEndDatePicker,
} from './styled';

class FieldDatesDutyMission extends React.PureComponent<PropsFieldDatesDutyMission, StateFieldDatesDutyMission> {
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
        <Row>
          <Col md={12}>
            <label>Время выполнения, планируемое:</label>
          </Col>
        </Row>
        <Row>
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
            <div>—</div>
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
        </Row>
        {
          (DUTY_MISSION_IS_ASSIGNED || DUTY_MISSION_IS_COMPLETED)
            ? (
              <>
                <Row>
                  <Col md={12}>
                    <label>Время выполнения, фактическое:</label>
                  </Col>
                </Row>
                <Row>
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
                </Row>
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
