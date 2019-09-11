import * as React from 'react';
import { connect } from 'react-redux';
import { Flex } from 'global-styled/global-styled';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldTechnicalOperation,
  StatePropsFieldTechnicalOperation,
  DispatchPropsFieldTechnicalOperation,
  OwnPropsFieldTechnicalOperation,
  StateFieldTechnicalOperation,
} from 'components/new/pages/routes_list/form/inside_fields/technical-operation/FieldTechnicalOperation.d';
import { actionGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';

class FieldTechnicalOperation extends React.PureComponent<PropsFieldTechnicalOperation, StateFieldTechnicalOperation> {
  constructor(props) {
    super(props);
    const TECHNICAL_OPERATION_OPTIONS = [];

    const {
      value,
      name,
    } = props;

    if (value && name) {
      TECHNICAL_OPERATION_OPTIONS.push({
        value,
        label: name,
      });
    }

    this.state = {
      TECHNICAL_OPERATION_OPTIONS,
    };
  }

  componentDidMount() {
    this.getTechnicalOperations();
  }

  getTechnicalOperations() {
    this.props.dispatch(
      actionGetTechnicalOperationRegistry(
        {},
        {
          page: this.props.page,
          path: this.props.path,
        },
      ),
    ).then(({ data: technical_operations_list }) => {
      const {
        props: {
          value,
        },
      } = this;

      const TECHNICAL_OPERATION_OPTIONS = technical_operations_list.map((to) => ({
        value: to.id,
        label: to.name,
        toData: to,
      }));

      if (value) {
        const selectedTo = TECHNICAL_OPERATION_OPTIONS.find((toOption) => toOption.value === value);

        if (selectedTo) {
          this.props.onChange({
            normatives: selectedTo.toData.normatives,
          });
        }
      }

      this.setState({ TECHNICAL_OPERATION_OPTIONS });
    });
  }

  handleChange = (value, option) => {
    const { props } = this;

    if (value && value !== props.value) {
      props.onChange({
        technical_operation_id: value,
        technical_operation_name: value ? option.label : null,
        normatives: option.toData.normatives,
      });
    }
  }

  render() {
    const {
      state,
      props,
    } = this;

    return (
      <Flex grow={1} shrink={1} basis={200}>
        <ExtField
          id="route-technical-operation-id"
          type="select"
          label="Технологическая операция"
          options={state.TECHNICAL_OPERATION_OPTIONS}
          value={props.value}
          onChange={this.handleChange}
          disabled={props.disabled}
          clearable={false}
          error={props.error}
        />
      </Flex>
    );
  }
}

export default connect<StatePropsFieldTechnicalOperation, DispatchPropsFieldTechnicalOperation, OwnPropsFieldTechnicalOperation, ReduxState>(
  null,
  (dispatch: any) => ({
    dispatch,
  }),
)(FieldTechnicalOperation);
