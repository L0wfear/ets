import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const ButtonRemoveFile = styled(EtsBootstrap.Button)`
  &&& {
    float: initial;
    margin-right: 10px;
  }
`;

export const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .close-default {
    display: contents;
  }
  a {
    padding-left: 10px;
    text-overflow: ellipsis;
    max-width: 300px;
    overflow: hidden;
  }
`;
