import * as React from 'react';
import styled from 'styled-components';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import SelectTechnicalOperation from './select/SelectTechnicalOperation';
import SelectMunicipalFacility from './select/SelectMunicipalFacility';
import SelectRouteTypeAndFuncType from './select/norm/SelectRouteTypeAndFuncType';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type SelecteToMfRtFtStateProps = {
};
type SelecteToMfRtFtDispatchProps = DispatchProp;
type SelecteToMfRtFtOwnProps = {
  registryKey: string;
};
type SelecteToMfRtFtMergedProps = (
  SelecteToMfRtFtStateProps
  & SelecteToMfRtFtDispatchProps
  & SelecteToMfRtFtOwnProps
);

type SelecteToMfRtFtProps = (
  SelecteToMfRtFtMergedProps
  & WithSearchProps
);

const ButtonContainer = styled.div`
  flex-grow: 1;
  margin: 5px;
`;

const SelecteToMfRtFt: React.FC<SelecteToMfRtFtProps> = React.memo(
  (props) => {
    return (
      <ButtonContainer>
        <EtsBootstrap.Row>
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

export default compose<SelecteToMfRtFtProps, SelecteToMfRtFtOwnProps>(
  connect<SelecteToMfRtFtStateProps, SelecteToMfRtFtDispatchProps, SelecteToMfRtFtOwnProps, ReduxState>(
    null,
  ),
  withSearch,
)(SelecteToMfRtFt);
