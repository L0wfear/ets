import * as React from 'react';

import Title from 'components/new/ui/registry/components/data/header/title/Title';
import Buttons from 'components/new/ui/registry/components/data/header/buttons/Buttons';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getHeaderData } from '../../../module/selectors-registry';
import { DivNone } from 'global-styled/global-styled';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import SelectedOdhDtDisabled from './middle/SelectedOdhDtDisabled';
import SelectedOdhDt from './middle/SelectedOdhDt';
import SelecteDateTimeRange from './middle/SelecteDateTimeRange';
import SelectForTechnicalOperationRelations from './format/select_for_technical_operation_relations/SelectForTechnicalOperationRelations';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type HeaderProps = {
  registryKey: string;
};

const getMiddleBlockComponent = (format: OneRegistryData['header']['format']) => {
  switch (format) {
    case 'select_odh/dt(disabled)': return SelectedOdhDtDisabled;
    case 'select_odh/dt': return SelectedOdhDt;
    case 'datetime_range_picker': return SelecteDateTimeRange;
    default: return null;
  }
};

const Header: React.FC<HeaderProps> = React.memo(
  (props) => {
    const format = etsUseSelector(
      (state) => getHeaderData(getRegistryState(state), props.registryKey).format,
    );

    if (format === 'select_for_technical_operation_relations') {
      return React.useMemo(
        () => (
          <SelectForTechnicalOperationRelations registryKey={props.registryKey} />
        ),
        [props.registryKey],
      );
    }

    return React.useMemo(
      () => {
        const MiddleBlock = getMiddleBlockComponent(format);

        return (
          <EtsHeaderContainer>
            <Title registryKey={props.registryKey} />
            {
              MiddleBlock
                ? (
                  <MiddleBlock registryKey={props.registryKey} />
                )
                : (
                  <DivNone />
                )
            }
            <Buttons registryKey={props.registryKey} />
          </EtsHeaderContainer>
        );
      },
      [
        format,
        props.registryKey,
      ],
    );
  },
);

export default Header;
