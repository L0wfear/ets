import * as React from 'react';

import { getPaginator } from 'components/new/ui/registry/module/selectors-registry';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = CommontTdTiteProps;

const EnumeratedTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const paginator = etsUseSelector((state) => getPaginator(state, props.registryKey));

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td id={props.id}>
        {props.indexRow + 1 + paginator.currentPage * paginator.perPage}
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default EnumeratedTdTitle;
