import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';
import { getRootRegistry } from '../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';

import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  registryKey: string;
};

type Props = OwnProps & {};

const Registry: React.FC<Props> =  React.memo(
  (props) => {
    const hasData = etsUseSelector((state) => Boolean(getRootRegistry(getRegistryState(state), props.registryKey, true)));

    return (
      hasData
        ? (
          <Data registryKey={props.registryKey} />
        )
        : (
          <TemplateRegistry/>
        )
    );
  },
);

export default Registry;
