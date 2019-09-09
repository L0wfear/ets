import * as React from 'react';
import { get } from 'lodash';

import { actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import { getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  registryKey: string;
};

type Props = OwnProps & {};

const SelectedOdhDtDisabled: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const Service = etsUseSelector((state) => getServiceData(state, props.registryKey));
    const selectedType = get(Service, 'getRegistryData.payload.type', null);

    const handleSelectOdh = React.useCallback(
      () => {
        const payload = {
          getRegistryData: {
            type: 'odh',
          },
          getBlobData: {
            format: 'xls',
            type: 'odh',
          },
        };

        dispatch(
          actionChangeGlobalPaylaodInServiceData(props.registryKey, payload),
        );
      },
      [Service],
    );

    const handleSelectDt = React.useCallback(
      () => {
        const payload = {
          getRegistryData: {
            type: 'dt',
          },
          getBlobData: {
            type: 'dt',
          },
        };

        dispatch(
          actionChangeGlobalPaylaodInServiceData(props.registryKey, payload),
        );
      },
      [Service],
    );

    return (
      <EtsButtonsContainer>
        <EtsBootstrap.Button active={selectedType === 'odh'} onClick={handleSelectOdh}>ОДХ</EtsBootstrap.Button>
        <EtsBootstrap.Button disabled active={selectedType === 'dt'} onClick={handleSelectDt}>ДТ</EtsBootstrap.Button>
      </EtsButtonsContainer>
    );
  },
);

export default SelectedOdhDtDisabled;
