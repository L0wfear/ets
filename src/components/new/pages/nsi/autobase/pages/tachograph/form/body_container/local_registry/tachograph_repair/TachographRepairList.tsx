import * as React from 'react';
import { get } from 'lodash';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from './_config-data/registry-config';

type OwnProps = {
  formState?: TachographListWithOuterProps;
};

const TachographRepair: React.FC<OwnProps> = React.memo(
  (props) => {
    const {
      formState: state
    } = props;

    const tachograph_id = get(state, 'id', null);
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(registryAddInitialData(getToConfig(tachograph_id)));
        return () => {
          dispatch(registryRemoveData(registryKey));
        };
      },
      [tachograph_id],
    );
    return (
      <Registry registryKey={registryKey} />
    );
  },
);

export default TachographRepair;
