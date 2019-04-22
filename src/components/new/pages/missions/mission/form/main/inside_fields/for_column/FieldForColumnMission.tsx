
import * as React from 'react';
import { connect } from 'react-redux';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldForColumnMission,
  StatePropsFieldForColumnMission,
  DispatchPropsFieldForColumnMission,
  OwnPropsFieldForColumnMission,
  StateFieldForColumnMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/for_column/FieldForColumnMission.h';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

class FieldForColumnMission extends React.PureComponent<PropsFieldForColumnMission, StateFieldForColumnMission> {
  handleChange = () => {
    this.props.onChange({
      for_column: !this.props.value,
    });
  }

  render() {
    const {
      props,
    } = this;

    return (
      <ExtField
        id="for_column"
        modalKey={props.page}
        type="select"
        label="Колонна"
        disabled={props.disabled}
        value={+props.value}
        options={YES_NO_SELECT_OPTIONS_INT}
        onChange={this.handleChange}
        clearable={false}
      />
    );
  }
}

export default connect<StatePropsFieldForColumnMission, DispatchPropsFieldForColumnMission, OwnPropsFieldForColumnMission, ReduxState>(
  null,
)(FieldForColumnMission);
