import * as React from 'react';
import { TableMeta } from '../TableInput';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';

export type TableInputTheadProps = {
  meta: TableMeta<any>[];
};

const TableInputThead: React.FC<TableInputTheadProps> = React.memo(
  (props) => {
    return (
      <EtsThead>
        <tr>
          {
            props.meta.map((metaData) => (
              <EtsTheadTh
                key={metaData.key}
                canClick={false}
                width={metaData.width}
                children={metaData.title}
              />
            ))
          }
        </tr>
      </EtsThead>
    );
  },
);

export default TableInputThead;
