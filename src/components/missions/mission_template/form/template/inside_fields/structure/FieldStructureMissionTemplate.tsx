
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldStructureMissionTemplate,
  StatePropsFieldStructureMissionTemplate,
  DispatchPropsFieldStructureMissionTemplate,
  OwnPropsFieldStructureMissionTemplate,
  StateFieldStructureMissionTemplate,
} from 'components/missions/mission_template/form/template/inside_fields/structure/FieldStructureMissionTemplate.d';
import {
  getSessionStructuresOptions,
  getSessionStructuresParams,
} from 'redux-main/reducers/modules/session/selectors';

class FieldStructureMissionTemplate extends React.PureComponent<PropsFieldStructureMissionTemplate, StateFieldStructureMissionTemplate> {
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

    return (
      <ExtField
        type="select"
        id="structure_id"
        modalKey={props.page}
        label="Подразделение"
        disabled={props.STRUCTURE_FIELD_READONLY || props.disabled}
        clearable={props.STRUCTURE_FIELD_DELETABLE}
        options={props.STRUCTURES}
        emptyValue={null}
        value={props.value}
        error={props.error}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldStructureMissionTemplate, DispatchPropsFieldStructureMissionTemplate, OwnPropsFieldStructureMissionTemplate, ReduxState>(
  (state) => ({
    STRUCTURES: getSessionStructuresOptions(state),
    ...getSessionStructuresParams(state),
  }),
)(FieldStructureMissionTemplate);
