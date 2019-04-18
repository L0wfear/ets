import * as React from 'react';

import Buttons from 'components/new/ui/registry/components/data/header/buttons/Buttons';
import styled from 'styled-components';
import { EtsButtonsContainer } from '../../../buttons/styled/styled';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';

type ButtonsToMfRtFtWrapStateProps = {
};
type ButtonsToMfRtFtWrapDispatchProps = {};
type ButtonsToMfRtFtWrapOwnProps = {
  registryKey: string;
};
type ButtonsToMfRtFtWrapMergedProps = (
  ButtonsToMfRtFtWrapStateProps
  & ButtonsToMfRtFtWrapDispatchProps
  & ButtonsToMfRtFtWrapOwnProps
);
type ButtonsToMfRtFtWrapProps = ButtonsToMfRtFtWrapMergedProps & WithSearchProps;

const ButtonWrap = styled.div`
  ${EtsButtonsContainer} {
    justify-content: flex-end;
  }
`;

const ButtonsToMfRtFtWrap: React.FC<ButtonsToMfRtFtWrapProps> = React.memo(
  (props) => {
    const technical_operation_id = props.searchState.technical_operation_id || null;
    const municipal_facility_id = props.searchState.municipal_facility_id || null;
    const route_types = props.searchState.route_types || null;
    const func_type_id = props.searchState.func_type_id || null;

    const hasAllData = (
      technical_operation_id
      && municipal_facility_id
      && route_types
      && func_type_id
    );

    return (
      <ButtonWrap>
        {
          hasAllData
            ? (
              <Buttons registryKey={props.registryKey} />
            )
            : (
              <DivNone />
            )
        }
      </ButtonWrap>
    );
  },
);

export default withSearch(ButtonsToMfRtFtWrap);
