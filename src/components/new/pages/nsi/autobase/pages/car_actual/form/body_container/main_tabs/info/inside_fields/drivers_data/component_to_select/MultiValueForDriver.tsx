import * as React from 'react';
import { get } from 'lodash';
import { components } from 'react-select';
import { MultiValueProps } from 'react-select/src/components/MultiValue';
import styled from 'styled-components';
import { RedOptionsStyle } from 'global-styled/global-styled';

const pathToActiveStatus = 'data.rowData.active';

const MultiValueWithCheckActive = styled(components.MultiValue)<MultiValueProps<any>>`
  &&& {
    ${(props) => (
    !get(props, pathToActiveStatus, true) && RedOptionsStyle
  )}
  }
`;

const MultiValueForDriver = (props) => (
  <MultiValueWithCheckActive {...props}>
    {
      `${props.children}${!get(props, pathToActiveStatus, true) ? ` (Не работает)` : ''}`
    }
  </MultiValueWithCheckActive>
);

export default React.memo(MultiValueForDriver);
