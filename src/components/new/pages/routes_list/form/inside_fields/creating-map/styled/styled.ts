import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Flex } from 'global-styled/global-styled';

export const ButtonOdhContainer = styled.div`
  position: absolute;
  top: 0;
  transform: translate(10px, 10px);
`;

export const CreatingMapContainer = styled.div`
  position: relative;
`;

export const ButtonCheckRoute = styled(EtsBootstrap.Button)`
  &&& {
    width: 100%;
    margin-bottom: 15px;
  }
`;

export const ButtonCheckTypeSelect = styled(EtsBootstrap.Button)`
  width: 120px;
`;

export const PointInputContainer = styled.div`
  &&& {
    width: 100%;

    div, .form-group {
      width: 100%;
      margin: 0;
    }
  }
`;

export const RouteFormGeoList = styled(Flex)`
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
