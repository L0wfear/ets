import styled from 'styled-components';
import { HiddenPageEtsContainer } from 'components/new/pages/inspection/common_components/form_wrap_check/styled';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { TitleContainer } from 'components/new/ui/registry/components/data/header/title/styled/styled';

export const WithformWrapRegistryWrapper = styled(HiddenPageEtsContainer)`
  ${BoxContainer} {
    padding: 20px 10px;
  }
  ${TitleContainer} {
    font-weight: 600;
  }
`;
