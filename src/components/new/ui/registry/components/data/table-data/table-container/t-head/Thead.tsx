import * as React from 'react';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import TrHead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/TrHead';

import {
  EtsThead,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  registryKey: string;
};

const Thead: React.FC<Props> = React.memo(
  (props) => {
    const fieldsInDeepArr = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.fieldsInDeepArr);

    return React.useMemo(
      () => (
        <EtsThead>
          {
            fieldsInDeepArr.map(
              (_, index) => (
                <TrHead key={index} indexRow={index} registryKey={props.registryKey} />
              ),
            )
          }
        </EtsThead>
      ),
      [fieldsInDeepArr],
    );
  },
);

export default Thead;
