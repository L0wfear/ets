
import * as React from 'react';
import { connect } from 'react-redux';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import { isNullOrUndefined } from 'util';
import {
  PropsFieldForColumnMissionTemplate,
  StatePropsFieldForColumnMissionTemplate,
  DispatchPropsFieldForColumnMissionTemplate,
  OwnPropsFieldForColumnMissionTemplate,
  StateFieldForColumnMissionTemplate,
} from 'components/missions/mission_template/form/template/inside_fields/for_column/FieldForColumnMissionTemplate.d';
import memoize from 'memoize-one';
import { getSomeUniqState } from 'redux-main/reducers/selectors/index';
import { getAvailableRouteTypes } from 'components/missions/mission_template/form/template/utils';

const getAvailableRouteTypesMemo = (
  memoize(getAvailableRouteTypes)
);

class FieldForColumnMissionTemplate extends React.PureComponent<PropsFieldForColumnMissionTemplate, StateFieldForColumnMissionTemplate> {
  componentDidUpdate(prevProps) {
    const {
      municipal_facility_id,
    } = this.props;

    if (municipal_facility_id !== prevProps.municipal_facility_id) {
      this.props.onChange({
        for_column: false,
      });
    }
  }

  handleChange = () => {
    this.props.onChange({
      for_column: !this.props.value,
    });
  }

  render() {
    const {
      props,
    } = this;

    const {
      municipalFacilityForMissionList,
      municipal_facility_id,
      value,
    } = this.props;

    const available_route_types = getAvailableRouteTypesMemo(
      municipalFacilityForMissionList,
      municipal_facility_id,
      value,
    );

    const columnFlagDisability = (
      isNullOrUndefined(municipal_facility_id)
      || !available_route_types.find((routeType) => routeType === 'mixed')
      || props.disabled
    );

    return (
      <ExtField
        id="for_column"
        modalKey={props.page}
        type="boolean"
        className="checkbox-input flex-reverse column_checkbox"
        label="Создать шаблон задания на колонну"
        disabled={columnFlagDisability}
        value={props.value}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldForColumnMissionTemplate, DispatchPropsFieldForColumnMissionTemplate, OwnPropsFieldForColumnMissionTemplate, ReduxState>(
  (state) => ({
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
  }),
)(FieldForColumnMissionTemplate);
