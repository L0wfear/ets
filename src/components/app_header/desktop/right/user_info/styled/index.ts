import styled, { css } from 'styled-components';
import { DefaultFirstLvlMenu } from 'components/app_header/styled';

export const UserDataMenu = styled(DefaultFirstLvlMenu)`
  text-decoration: none;
`;

export const UserDataContainer = styled.div`
  padding: 0 10px;
`;
export const UserHeaderData = styled.div`
  opacity: 0.5;
  font-size: 11px;
`;

const shortCss = css`
  max-width: 140px;
  font-size: 12px;
  white-space: initial;
`;

export const UserFio = styled(UserHeaderData)<{ short: boolean }>`
  opacity: 1;
  ${({ short }) => short ? shortCss : ''}
`;
