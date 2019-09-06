import * as React from 'react';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
    <EtsBootstrap.Grid.GridBootstrapTbody.Tr onClick={handleClickRow} enable isSelected={props.isSelected} rowData={actionData} registryKey="">
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>{rowNumber}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>{actionData.name}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>{actionData.date_start}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>{actionData.date_end}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
    </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
  );
};

export default ContainerRegistryTr;
