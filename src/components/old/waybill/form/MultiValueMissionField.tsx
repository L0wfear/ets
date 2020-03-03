import * as React from 'react';

import * as components from 'components/old/ui/input/ReactSelect/styled/styled';
import styled from 'styled-components';
import { RedOptionsStyle } from 'global-styled/global-styled';
import { get } from 'lodash';

const pathToinvalidStatus = 'data.rowData.invalidMission'; // invalidMission новый флаг, сощдается при формировании опций, true если задание не проходит валидацию

const MultiValueWithCheckInvalidStyled = styled(components.MultiValue)`
  &&& {
    ${(props) => (get(props, pathToinvalidStatus, false) && RedOptionsStyle)}
}
`;

const MultiValueWithCheckInvalid = (props) => (
  <MultiValueWithCheckInvalidStyled {...props}>
    {`${props.children}`}
  </MultiValueWithCheckInvalidStyled>);

export const componentsForMissionSelect = {
  MultiValue: MultiValueWithCheckInvalid,
};

export default React.memo(MultiValueWithCheckInvalid);