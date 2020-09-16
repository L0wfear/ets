import * as React from 'react';
import styled from 'styled-components';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { registryChangeDataPaginatorPerPage } from 'components/new/ui/registry/module/actions-registy';
import { SingleUiElementWrapperStyled } from 'components/@next/@ui/renderFields/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const EtsPaginatorCountPages = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 5px;
  ${SingleUiElementWrapperStyled} {
    min-width: 100px;
    margin-bottom: 0px;
  }
`;
export const TextPage = styled.span`
  margin-right: 10px;
  font-weight: 700;
`;

export const RoundButtonStyled = styled(EtsBootstrap.Button)`
  &&& {
    border-radius: 200px;
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
    background: ${({active}) => active ? UiConstants.colorDark : 'transparent'};
    color: ${({active}) => active ? '#ffffff' : UiConstants.colorDark};
    &:hover, &:focus {
      background: #4c4c4c21;
      color: ${UiConstants.colorDark};
    }
  }
`;

export type PaginatorPageCountOptionType = {
  value: number;
  label: string | number;
};

type Props = {
  registryKey?: string;
  setPerPage?: (value: number) => void;
};

const PerPageSelector: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
      setPerPage,
    } = props;

    const perPageData = localStorage.getItem(`perPage`);
    const [perPageLocal, setPerPageLocal] = React.useState(15);

    const countPagesList: Array<Number> = [15, 25, 50, 100];

    const dispatch = etsUseDispatch();
    React.useEffect(() => { // Не делать dispatch при первой загрузке страницы?
      if(registryKey) {
        handleChangeCountPages(
          perPageData
            ? Number(perPageData)
            : 15,
          true
        );
      }
    }, []);

    const handleChangeCountPages = React.useCallback((value, isDidMount = false) => { // isDidMount -- что бы при загрузке реестра небыло доп. запроса
      setPerPageLocal(value);
      localStorage.setItem('perPage', value);
      if(registryKey && !isDidMount) {
        dispatch(
          registryChangeDataPaginatorPerPage(
            registryKey,
            value,
          ),
        );
      }
      if(setPerPage) {
        setPerPage(value);
      }
    }, [registryKey, dispatch, perPageLocal]);

    return (
      <EtsPaginatorCountPages>
        <TextPage>
          Отображать по
        </TextPage>
        {
          countPagesList.map((elem) => {
            return (
              <RoundButtonStyled boundKeys={elem} id={`perPage_${elem}`} key={`perPage_${elem}`} active={perPageLocal === elem} onClick={handleChangeCountPages}>
                {elem}
              </RoundButtonStyled>
            );
          })
        }
      </EtsPaginatorCountPages>
    );
  },
);

export default PerPageSelector;
