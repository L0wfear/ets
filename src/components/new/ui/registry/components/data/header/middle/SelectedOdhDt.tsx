import * as React from 'react';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  registryKey: string;
};

type Props = (
  OwnProps
  & {}
  & WithSearchProps
);

const SelectedOdhDt: React.FC<Props> = React.memo(
  (props) => {
    const selected_odh_dt_value = props.match.params.selected_odh_dt_value;
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        if (selected_odh_dt_value !== 'odh' && selected_odh_dt_value !== 'dt') {
          handleSelectOdh();
        }
      },
      [selected_odh_dt_value],
    );

    React.useEffect(
      () => {
        if (selected_odh_dt_value && (selected_odh_dt_value === 'odh' || selected_odh_dt_value === 'dt')) {
          const typeName = props.registryKey === 'cleaningRateRegistry' ? 'type' : 'object_type';
          const payload = {
            getRegistryData: {
              [typeName]: selected_odh_dt_value,
            },
            getBlobData: {
              [typeName]: selected_odh_dt_value,
            },
          };

          dispatch(
            actionChangeGlobalPaylaodInServiceData(props.registryKey, payload),
          );
        }
      },
      [selected_odh_dt_value],
    );

    const handleSelectOdh = React.useCallback(
      () => {
        props.setParams({
          selected_odh_dt_value: 'odh',
        });
      },
      [props.setParams, props.match.params],
    );

    const handleSelectDt = React.useCallback(
      () => {
        props.setParams({
          selected_odh_dt_value: 'dt',
        });
      },
      [props.setParams, props.match.params],
    );

    return (
      <EtsButtonsContainer>
        <EtsBootstrap.Button active={selected_odh_dt_value === 'odh'} onClick={handleSelectOdh}>ОДХ</EtsBootstrap.Button>
        <EtsBootstrap.Button active={selected_odh_dt_value === 'dt'} onClick={handleSelectDt}>ДТ</EtsBootstrap.Button>
      </EtsButtonsContainer>
    );
  },
);

export default withSearch<OwnProps>(SelectedOdhDt);
