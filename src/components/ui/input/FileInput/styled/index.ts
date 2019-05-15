import styled from 'styled-components';
import { Button } from 'react-bootstrap';

export const ButtonRemoveFile = styled(Button)`
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
  }
`;
