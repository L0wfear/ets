import styled from 'styled-components';
import { DefaultSecondLvlMenu, DefaultFirstDt, DefaultFirstLvlMenu } from 'components/new/ui/app_header/styled/index';
import { SecondMenuItemContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled/index';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const MobiContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: white;
`;

export const FirstLvlMobi = styled.div`
  display: flex;
  justify-content: space-between;
`;

// SecondMenuContainer
export const SecondMenuContainerMobi = styled.div`
  position: relative;
  display: flex;
  margin: 0;
  white-space: nowrap;
  color: black;

  display: flex;
  flex-direction: column;
  cursor: default;

  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);

  padding: 8px 0px;
`;

export const SecondMenuContainerMobiFirst = styled(SecondMenuContainerMobi)`
  overflow: scroll;
  max-height: 500px;
`;

export const DefaultSecondLvlMenuMobi = styled(DefaultSecondLvlMenu)`
  font-size: 17px;
`;

export const ChangeRoleContainerWithButton = styled(DefaultSecondLvlMenuMobi)`
  display: flex;
  width: 100%;
  &&& {
    color: black;
    >div {
      color: black;

      :hover {
        background-color: #f5f5f5;
      }
    }
  }
`;

export const SecondMenuItemContainerMobi = styled(SecondMenuItemContainer)`
  ${DefaultFirstDt} {
    color: black;
    padding: 3px 10px;

    :hover {
      background-color: #f5f5f5;
    }

    ${DefaultFirstLvlMenu} {
      height: initial;
      font-size: 17px;
      text-decoration: none;
      :hover {
        text-decoration: none;
      }
    }
  }
`;

export const MenuButton = styled(EtsBootstrap.Button)`
  &&& {
    padding: 0 15px;
  }
`;
