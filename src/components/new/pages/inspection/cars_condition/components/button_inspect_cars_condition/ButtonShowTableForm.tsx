import * as React from 'react';

import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import styled from 'styled-components';

export const ButtonShowTableFormStyled = styled(EtsBootstrap.Button)`
  margin-bottom: 10px;
`;

type OwnProps = {
  loadingPage: string;
};

type Props = (
  OwnProps
  & WithSearchProps
);

const ButtonShowTableForm: React.FC<Props> = (props) => {
  const inspectId = getNumberValueFromSerch(props.match.params.id);
  const disableBtn = Boolean(props.match.params.selectedCarsConditionsCar);

  const permissions = etsUseSelector((state) => getListData(getRegistryState(state), props.loadingPage).permissions.update); //  прокидывается в следующий компонент
  const isPermitted = etsUseIsPermitted(permissions);

  const handleClickShowTableForm = React.useCallback(
    async () => {
      if (inspectId) {
        props.setDataInSearch({
          inspectId,
        });
      }
    },
    [inspectId, props.match.params, props.match.url, props.location.search, props.setParams],
  );

  return isPermitted && (
    <ButtonShowTableFormStyled onClick={handleClickShowTableForm} disabled={disableBtn}>
      <EtsBootstrap.Glyphicon glyph="list-alt"/>
      Открыть форму заполнения
    </ButtonShowTableFormStyled>
  );
};

export default withSearch<OwnProps>(ButtonShowTableForm);
