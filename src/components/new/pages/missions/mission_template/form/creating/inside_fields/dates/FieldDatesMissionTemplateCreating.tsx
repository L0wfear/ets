import * as React from 'react';
import { connect } from 'react-redux';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldDatesMissionTemplateCreating,
  StatePropsFieldDatesMissionTemplateCreating,
  DispatchPropsFieldDatesMissionTemplateCreating,
  OwnPropsFieldDatesMissionTemplateCreating,
  StateFieldDatesMissionTemplateCreating,
} from 'components/new/pages/missions/mission_template/form/creating/inside_fields/dates/FieldDatesMissionTemplateCreating.h';

import { addTime } from 'components/@next/@utils/dates/dates';
import { checkMissionsByRouteType } from '../../utils';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h5>Время выполнения</h5>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
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
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
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
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </React.Fragment>
    );
  }
}

export default connect<StatePropsFieldDatesMissionTemplateCreating, DispatchPropsFieldDatesMissionTemplateCreating, OwnPropsFieldDatesMissionTemplateCreating, ReduxState>(
  null,
)(FieldDatesMissionTemplateCreating);
