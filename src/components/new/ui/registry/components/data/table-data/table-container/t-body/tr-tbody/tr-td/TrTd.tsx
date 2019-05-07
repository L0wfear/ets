import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { isString } from 'util';

export type PropsTrTd = {
  registryKey: string;
  rowData: any;
  metaKey: string;
  value: any;
};

const TrTd: React.FC<PropsTrTd> = React.memo(
  (props) => {
    const value = React.useMemo(
      () => {
        if (isString(props.value)) {
          return (
            props.value
              .split('\n')
              .map((oneLineComment, i) => <div key={i}>{oneLineComment}</div>)
          );
        }

        return props.value;
      },
      [props.value],
    );
    return (
      <EtsTbodyTrTd>{value}</EtsTbodyTrTd>
    );
  },
);

export default TrTd;
