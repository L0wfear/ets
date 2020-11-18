import * as React from 'react';

import Title from 'components/new/ui/registry/components/data/header/title/Title';
import Buttons from 'components/new/ui/registry/components/data/header/buttons/Buttons';
import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getHeaderData } from '../../../module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import SelectedOdhDtDisabled from './middle/SelectedOdhDtDisabled';
import SelectedOdhDt from './middle/SelectedOdhDt';
import SelecteDateTimeRange from './middle/SelecteDateTimeRange';
import SelectedDateRangeUserLog from './middle/SelectedDateRangeUserLog';
import SelectForTechnicalOperationRelations from './format/select_for_technical_operation_relations/SelectForTechnicalOperationRelations';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type HeaderProps = {
  registryKey: string;
};

const getMiddleBlockComponent = (format: OneRegistryData['header']['format']) => {
  switch (format) {
    case 'select_odh/dt(disabled)': return SelectedOdhDtDisabled;
    case 'select_odh/dt': return SelectedOdhDt;
    case 'datetime_range_picker': return SelecteDateTimeRange;
    case 'daterange_picker_userlog': return SelectedDateRangeUserLog;
    default: return null;
  }
};

const Header: React.FC<HeaderProps> = React.memo(
  (props) => {
    const format = etsUseSelector(
      (state) => getHeaderData(getRegistryState(state), props.registryKey).format,
    );

    if (format === 'select_for_technical_operation_relations') {
      return (
        <SelectForTechnicalOperationRelations registryKey={props.registryKey} />
      );
    }
    const MiddleBlock = getMiddleBlockComponent(format);

    return (
      <EtsHeaderContainerWrap>
        <EtsBootstrap.Row margin={10}>
          <EtsBootstrap.Col md={format === 'order_to' ? 8 : 12}>
            <EtsHeaderContainer>
              <Title registryKey={props.registryKey} />
              {
                MiddleBlock && (
                  <MiddleBlock registryKey={props.registryKey} />
                )
              }
              <Buttons registryKey={props.registryKey} />
            </EtsHeaderContainer>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </EtsHeaderContainerWrap>
    );
  },
);

export default Header;
