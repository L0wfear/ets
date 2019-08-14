import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const ErrorField = styled.div`
  color: ${UiConstants.colorError};
  background: #ffffff;
  font-size: 12px;
  padding: 2px 5px;
  margin-top: 0px;
  transition: background-color .3s ease, color .3s ease;
  border-radius: 0 0 3px 3px;
`;
