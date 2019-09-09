import * as React from 'react';
import styled from 'styled-components';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import SelectTechnicalOperation from './select/SelectTechnicalOperation';
import SelectMunicipalFacility from './select/SelectMunicipalFacility';
import SelectRouteTypeAndFuncType from './select/norm/SelectRouteTypeAndFuncType';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type OwnProps = {
  registryKey: string;
};

type Props = (
  OwnProps
  & WithSearchProps
);

const ButtonContainer = styled.div`
  flex-grow: 1;
  margin: 5px;
`;

const SelecteToMfRtFt: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ButtonContainer>
        <EtsBootstrap.Row margin={10}>
          <EtsBootstrap.Col md={3}>
            <SelectTechnicalOperation registryKey={props.registryKey} />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
            <SelectMunicipalFacility registryKey={props.registryKey} />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <SelectRouteTypeAndFuncType registryKey={props.registryKey} />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ButtonContainer>
    );
  },
);

export default withSearch<OwnProps>(SelecteToMfRtFt);
