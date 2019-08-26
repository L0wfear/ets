import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SimpleLinkA from 'components/new/ui/simple_a/link';
import { mobiSize } from 'global-styled/global-constants';

export const AppHeaderNav = styled.nav`
  display: flex;
  justify-content: space-between;
  z-index: 100; /* шапка выше загрузки */
  background-color: #292929;
  flex-shrink: 0;
`;

export const PartHeaderContainer = styled.div`
  display: flex;
`;

export const DefaultFirstDt = styled.div<{ active?: boolean }>`
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  color: ${({ active }) => (active ? 'back' : 'white')};
  position: relative;
  background-color: ${({ active }) => (active ? '#e7e7e7' : 'initial')};
  text-decoration: none;

  transition: background-color 0.3s;

  :hover {
    background-color: ${({ active }) => (active ? '#e7e7e7' : '#4c4c4c')};
  }
`;

export const DefaultFirstLvlMenu = styled.div`
  height: 60px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  font-size: 14px;

  text-decoration: underline;
`;

export const DefaultFirstLvlMenuLogout = styled(DefaultFirstLvlMenu)`
  padding: 0 15px;

  @media screen and (max-width: ${mobiSize}px) {
    padding: inherit;
  }
`;

export const LinkFirstLvl = styled(Link)`
  &&& {
    color: inherit;
  }
`;

export const LinkNoHashFirstLvl = styled(SimpleLinkA)`
  &&& {
    color: inherit;
    :hover {
      text-decoration: none;
    }
  }
`;

export const LinkSecontLvl = styled(LinkFirstLvl)`
  &&& {
    color: inherit;
    :hover {
      text-decoration: none;
    }
  }
`;

export const LinkNoHashSecontLvl = styled(SimpleLinkA)`
  &&& {
    color: inherit;
    :hover {
      text-decoration: none;
    }
  }
`;

export const DefaultSecondLvlMenu = styled(DefaultFirstLvlMenu)`
  height: inherit;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 14px;

  text-decoration: none;
  padding: 3px 20px;
`;

export const DivDivider = styled.div`
  height: 1px;
  margin: 9px 0;
  overflow: hidden;
  background-color: #e5e5e5;
  cursor: default;
`;

export const MenuTitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;
