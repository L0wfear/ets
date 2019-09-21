import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const LineData = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

export const LineDataButtonLine = styled(LineData)`
  align-items: flex-end;

  &>* {
    margin-right: 15px;
    margin-top: 10px;
    margin-left: 0;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const StatusLabel = styled.b`
  text-decoration-skip-ink: none;
  padding: 0 15px;
`;

export const BigPaddingButton = styled(EtsBootstrap.Button)`
  &&& {
    white-space: pre-wrap;
  }
`;

export const InspectInfo = styled.div`
  padding: 0;
`;
