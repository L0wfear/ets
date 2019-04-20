
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionStructuresParams, getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { DivNone } from 'global-styled/global-styled';
import {
  PropsFieldStructureDutyMission,
  StatePropsFieldStructureDutyMission,
  DispatchPropsFieldStructureDutyMission,
  OwnPropsFieldStructureDutyMission,
  StateFieldStructureDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/structure/FieldStructureDutyMission.d';

/**
 * Поле "Подразделение" для формы наряд-задания
 * зависит от доступных для пользователя подразделений (session store)
 */
class FieldStructureDutyMission extends React.PureComponent<PropsFieldStructureDutyMission, StateFieldStructureDutyMission> {
  handleChange = (value, option) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        structure_id: value,
        structure_name: get(option, 'label', null),
      });
    }
  }

  render() {
    const {
      props,
    } = this;

    const {
      STRUCTURES,
      STRUCTURE_FIELD_VIEW,
      STRUCTURE_FIELD_READONLY,
      STRUCTURE_FIELD_DELETABLE,
    } = props;

    return (
      STRUCTURE_FIELD_VIEW
        ? (
            <ExtField
              type="select"
              id="structure_id"
              modalKey={props.page}
              label="Подразделение"
              disabled={STRUCTURE_FIELD_READONLY || this.props.disabled}
              clearable={STRUCTURE_FIELD_DELETABLE}
              options={STRUCTURES}
              emptyValue={null}
              value={props.value}
              error={props.error}
              onChange={this.handleChange}
            />
        )
        : (
            <DivNone />
        )
    );
  }
}

export default connect<StatePropsFieldStructureDutyMission, DispatchPropsFieldStructureDutyMission, OwnPropsFieldStructureDutyMission, ReduxState>(
  (state) => ({
    STRUCTURES: getSessionStructuresOptions(state),
    ...getSessionStructuresParams(state),
  }),
)(FieldStructureDutyMission);
