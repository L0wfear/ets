import * as React from 'react';

import { Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { routeTypesBySlug, routeTypesByKey } from 'constants/route';
import {
  PropsFieldType,
  StateFieldType,
} from 'components/new/pages/routes_list/form/inside_fields/type/FieldType.d';

class FieldType extends React.PureComponent<PropsFieldType, StateFieldType> {
  constructor(props) {
    super(props);

    const TYPES_OPTIONS = Object.values(routeTypesBySlug).map((routeType) => ({
      value: routeType.key,
      label: routeType.title,
    }));

    this.state = {
      TYPES_OPTIONS,
      available_route_types: props.available_route_types,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { available_route_types } = nextProps;

    if (available_route_types !== prevState.available_route_types) {
      return {
        TYPES_OPTIONS: available_route_types.map((value) => ({
          value,
          label: routeTypesByKey[value].title,
        })),
        available_route_types,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { TYPES_OPTIONS } = this.state;

    if (TYPES_OPTIONS !== prevState.TYPES_OPTIONS) {
      if (TYPES_OPTIONS.length) {
        const findType = TYPES_OPTIONS.find(({ value }) => value === this.props.value);

        this.props.onChange({
          type: (findType ? findType : TYPES_OPTIONS[0]).value,
        });
      } else {
        this.props.onChange({
          type: null,
        });
      }
    }
  }

  handleChange = (value) => {
    if (value) {
      this.props.onChange({
        type: value,
      });
    }
  }

  render() {
    const {
      state,
      props,
    } = this;

    return (
      <Flex grow={1} shrink={1} basis={100}>
        <ExtField
          id="type"
          type="select"
          label="Тип объекта"
          options={state.TYPES_OPTIONS}
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

export default FieldType;
