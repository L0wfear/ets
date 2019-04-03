import * as React from 'react';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';

type ContainerRegistryTrProps = {
  actionData: ValuesOf<InspectContainer['actions']>;
  rowNumber: number;
  onClickRow: (rowNumber: number) => void;
  isSelected?: boolean;
};

export const ContainerRegistryTr: React.FC<ContainerRegistryTrProps> = (props) => {
  const {
    actionData,
    rowNumber,
  } = props;

  const handleClickRow = React.useCallback(
    () => {
      props.onClickRow(rowNumber);
    },
    [rowNumber],
  );

  return (
    <EtsTrTbody onClick={handleClickRow} enable selected={props.isSelected}>
      <EtsTbodyTrTd>{rowNumber}</EtsTbodyTrTd>
      <EtsTbodyTrTd>{actionData.name}</EtsTbodyTrTd>
      <EtsTbodyTrTd>{actionData.date_start}</EtsTbodyTrTd>
      <EtsTbodyTrTd>{actionData.date_end}</EtsTbodyTrTd>
    </EtsTrTbody>
  );
};

export default ContainerRegistryTr;
