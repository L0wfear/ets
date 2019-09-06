import * as React from 'react';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import ButtonReadCompanyStructure from './inside_button/ButtonReadCompanyStructure';
import ButtonRemoveCompanyStructure from './inside_button/ButtonRemoveCompanyStructure';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = CommontTdTiteProps;

const CompanyStructureActionsTdTitle: React.FC<Props> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>
        <ButtonReadCompanyStructure
          rowData={props.rowData}
          registryKey={props.registryKey}
        />
        &nbsp;
        <ButtonRemoveCompanyStructure
          rowData={props.rowData}
          registryKey={props.registryKey}
        />
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default CompanyStructureActionsTdTitle;
