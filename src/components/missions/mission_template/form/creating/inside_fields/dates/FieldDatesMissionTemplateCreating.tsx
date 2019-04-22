import * as React from 'react';
import { connect } from 'react-redux';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldDatesMissionTemplateCreating,
  StatePropsFieldDatesMissionTemplateCreating,
  DispatchPropsFieldDatesMissionTemplateCreating,
  OwnPropsFieldDatesMissionTemplateCreating,
  StateFieldDatesMissionTemplateCreating,
} from 'components/missions/mission_template/form/creating/inside_fields/dates/FieldDatesMissionTemplateCreating.h';

import { addTime } from 'utils/dates';
import { checkMissionsByRouteType } from '../../utils';

class FieldDatesMissionTemplateCreating extends React.PureComponent<PropsFieldDatesMissionTemplateCreating, StateFieldDatesMissionTemplateCreating> {
  componentDidUpdate(prevProps) {
    const {
      missionTemplates,
      date_start,
      date_end,
    } = this.props;

    if (date_start !== prevProps.date_start || missionTemplates !== prevProps.missionTemplates) {
      const checkOnTypeRouteData = checkMissionsByRouteType(
        Object.values(missionTemplates),
        {
          date_start,
          date_end,
        },
      );

      if (checkOnTypeRouteData.error) {
        this.props.onChange(
          'date_end',
          addTime(
            date_start,
            checkOnTypeRouteData.time,
            'hours',
          ),
        );
      }
    }
  }

  render() {
    const {
      isPermitted,

      date_start,
      error_date_start,
      date_end,
      error_date_end,
    } = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col md={12}>
            <h5>Время выполнения</h5>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ExtField
              id="date_start"
              type="date"
              label="c"
              value={date_start}
              error={error_date_start}
              onChange={this.props.onChange}
              disabled={!isPermitted}
              boundKeys="date_start"
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="date_end"
              type="date"
              label="по"
              value={date_end}
              error={error_date_end}
              onChange={this.props.onChange}
              disabled={!isPermitted}
              boundKeys="date_end"
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect<StatePropsFieldDatesMissionTemplateCreating, DispatchPropsFieldDatesMissionTemplateCreating, OwnPropsFieldDatesMissionTemplateCreating, ReduxState>(
  null,
)(FieldDatesMissionTemplateCreating);
