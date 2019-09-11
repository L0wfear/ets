import * as React from 'react';

import Header from 'components/new/ui/registry/components/data/header/Header';
import FiltersWrap from 'components/new/ui/registry/components/data/filters/FiltersWrap';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';

import { EtsDataContainer } from 'components/new/ui/registry/components/data/styled/styled';

import { getHeaderData } from '../../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import SelectForTechnicalOperationRelationsRegistryWrap from './SelectForTechnicalOperationRelationsRegistryWrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  registryKey: string;
};

const Data: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
    } = props;
    const format = etsUseSelector((state) => getHeaderData(getRegistryState(state), registryKey).format);
    const title = etsUseSelector((state) => getHeaderData(getRegistryState(state), props.registryKey).title);

    React.useLayoutEffect(
      () => {
        const meta = document.querySelector('meta[property="og:title"]');
        const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
        const new_title = `${etsName} ${title}`;

        if (document) {
          document.title = new_title;
        }
        if (meta) {
          meta.setAttribute('content', new_title);
        }

        return () => {
          const metaNew = document.querySelector('meta[property="og:title"]');
          if (document) {
            document.title = etsName;
          }
          if (metaNew) {
            metaNew.setAttribute('content', etsName);
          }
        };
      },
    );

    return (
      <EtsDataContainer>
        {
          format === 'select_for_technical_operation_relations'
            ? (
              <React.Fragment>
                <Header registryKey={registryKey} />
                <SelectForTechnicalOperationRelationsRegistryWrap registryKey={registryKey} />
              </React.Fragment>
            )
            : (
              <React.Fragment>
                <Header registryKey={registryKey} />
                <FiltersWrap registryKey={registryKey} />
                <TableData registryKey={registryKey} />
                <Paginator registryKey={registryKey} />
              </React.Fragment>
            )
        }
      </EtsDataContainer>
    );
  },
);

export default Data;
