import * as React from 'react';
import { get } from 'lodash';
import { components } from 'react-select';
import { MultiValueProps } from 'react-select/lib/components/MultiValue';
import { DivNone } from 'global-styled/global-styled';

class MultiValueForDriver extends React.PureComponent<MultiValueProps<any>, {}> {
  render() {
    const { innerProps, ...props } = this.props;

    const { data } = props;

    const isActive = get(data, 'rowData.active', true);

    return isActive
      ? (
        <components.MultiValue innerProps={innerProps} {...props} />
      )
      : (
        <DivNone />
      );
  }
}

export default MultiValueForDriver;
