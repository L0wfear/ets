import styled from 'styled-components';
import { mobiSize } from 'global-styled/global-constants';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';

export const EtsHeaderContainer = styled.div<{ padding?: string, alignItems?: string; }>`
  display: flex;
  justify-content: space-between;
  align-items: ${ ({ alignItems }) => (alignItems ? alignItems : 'self-end') };
  padding: ${ ({ padding }) => (padding ? padding : '5px 10px 0px 10px') };
  flex-wrap: wrap;

  @media screen and (max-width: ${mobiSize}px) {
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    ${EtsHeaderTitle} {
      text-align: center;
      white-space: normal;
    }
  }
`;
