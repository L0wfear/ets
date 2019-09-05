import * as React from 'react';
import ComponentButton from 'components/new/ui/registry/components/data/header/buttons/component-button/ComponentButton';

import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type ButtonsProps = {
  registryKey: string;
};

const Buttons: React.FC<ButtonsProps> = React.memo(
  (props) => {
    const buttons = etsUseSelector(
      (state) => getHeaderData(state.registry, props.registryKey).buttons,
    );
    return (
      <EtsButtonsContainer>
        {
          buttons.map(
            (data, index) => (
              <ComponentButton key={`${data.type}_${index}`} data={data} registryKey={props.registryKey} />
            ),
          )
        }
      </EtsButtonsContainer>
    );
  },
);

export default Buttons;
