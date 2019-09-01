import * as React from 'react';
import { connect } from 'react-redux';

import { Flex, DivNone } from 'global-styled/global-styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldStructure,
  StateFieldStructure,
  StatePropsFieldStructure,
  DispatchPropsFieldStructure,
  OwnPropsFieldStructure,
} from 'components/new/pages/routes_list/form/inside_fields/structure/FieldStructure.d';
import { getAndSetInStoreCompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/actions';

class FieldStructure extends React.PureComponent<PropsFieldStructure, StateFieldStructure> {
  constructor(props) {
    super(props);

    const {
      sessionStructures,
      value,
      name,
    } = props;
    const STRUCTURE_OPTIONS = [];

    if (Array.isArray(sessionStructures)) {
      STRUCTURE_OPTIONS.push(
        ...sessionStructures.map((structure) => ({
          value: structure.id,
          label: structure.name,
        })),
      );
    }

    if (value && name) {
      if (!STRUCTURE_OPTIONS.some((structureOption) => structureOption.value === value)) {
        STRUCTURE_OPTIONS.push({
          value,
          label: name,
        });
      }
    }

    this.state = {
      STRUCTURE_OPTIONS,
    };
  }

  componentDidMount() {
    this.getCompanyStructure();
  }

  async getCompanyStructure() {
    const result = await this.props.dispatch(
      getAndSetInStoreCompanyStructureLinear(
        {},
        this.props,
      ),
    );

    const STRUCTURE_OPTIONS = result.data.map((structure) => ({
      value: structure.id,
      label: structure.name,
    }));

    this.setState({ STRUCTURE_OPTIONS });
  }

  handleChange = (value, options) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        structure_id: value,
        structure_name: value ? options.label : null,
      });
    }
  }

  render() {
    const {
      state,
      props,
    } = this;

    const {
      userStructureId,
    } = props;
    const {
      STRUCTURE_OPTIONS,
    } = state;

    const STRUCTURE_OPTIONS_length = STRUCTURE_OPTIONS.length;

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;

    if (userStructureId !== null && STRUCTURE_OPTIONS_length === 1 && userStructureId === STRUCTURE_OPTIONS[0].value) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (userStructureId !== null && STRUCTURE_OPTIONS_length > 1 && STRUCTURE_OPTIONS.some((structureOption) => structureOption.value === userStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (userStructureId === null && STRUCTURE_OPTIONS_length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    return STRUCTURE_FIELD_VIEW
    ? (
      <Flex grow={1} shrink={1} basis={100}>
        <ExtField
          id="structure-id"
          type="select"
          label="Подразделение"
          options={state.STRUCTURE_OPTIONS}
          value={props.value}
          onChange={this.handleChange}
          disabled={STRUCTURE_FIELD_READONLY || props.disabled}
          clearable={STRUCTURE_FIELD_DELETABLE}
          error={props.error}
        />
      </Flex>
    )
    : (
      <DivNone />
    );
  }
}

export default connect<StatePropsFieldStructure, DispatchPropsFieldStructure, OwnPropsFieldStructure, ReduxState>(
  (state) => ({
    sessionStructures: state.session.userData.structures,
    userStructureId: state.session.userData.structure_id,
  }),
)(FieldStructure);
