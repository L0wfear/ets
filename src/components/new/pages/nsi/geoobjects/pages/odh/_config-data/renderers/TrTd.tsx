import * as React from 'react';
import StandartTrTd from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTd';

const TrTd: React.FunctionComponent<any> = (props) => {
  const {
    metaKey,
    rowData,
    registryKey,
    value,
  } = props;

  return (
    <StandartTrTd
      metaKey={metaKey}
      value={value}
      rowData={rowData}
      registryKey={registryKey}
    />
  );
};

export default React.memo(TrTd);
