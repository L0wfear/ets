import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const EtsFiltersButtonsLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EtsFiltersCloseContainer = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: #444;
  transition: color 0.2s;

  padding: 5px;
  :hover {
    color: ${UiConstants.colorError};
  }
`;

export const EtsFilterActionButtonConteiner = styled.div`
  display: flex;
`;

export const EtsFilterActionButton = styled(EtsBootstrap.Button)`
  margin: 0 5px;
`;
