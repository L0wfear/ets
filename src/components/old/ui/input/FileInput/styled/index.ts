import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const ButtonRemoveFile = styled(EtsBootstrap.Button)`
  &&& {
    float: initial;
    margin-left: 10px;
    background-color: transparent;
    color: #4c4c4c;
    font-size: 20px;
    font-weight: 900;
    transition: all .3s ease;
    &:hover {
      background: transparent;
      color: ${UiConstants.colorError};
      +a {
        color: ${UiConstants.colorError};
      }
    }
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
    padding-right: 10px;
    text-overflow: ellipsis;
    max-width: 300px;
    overflow: hidden;
    transition: all .3s ease;
  }
`;

export const SingleInputFileItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`;
