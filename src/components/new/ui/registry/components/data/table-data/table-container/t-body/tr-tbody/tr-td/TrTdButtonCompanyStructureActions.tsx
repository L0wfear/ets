import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import ButtonReadCompanyStructure from './inside_button/ButtonReadCompanyStructure';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import ButtonRemoveCompanyStructure from './inside_button/ButtonRemoveCompanyStructure';

type TrTdButtonCompanyStructureActionsStateProps = {
};
type TrTdButtonCompanyStructureActionsDispatchProps = {
};
type TrTdButtonCompanyStructureActionsOwnProps = {
  registryKey: string;
  rowData: CompanyStructure;
};
type TrTdButtonCompanyStructureActionsMergedProps = (
  TrTdButtonCompanyStructureActionsStateProps
  & TrTdButtonCompanyStructureActionsDispatchProps
  & TrTdButtonCompanyStructureActionsOwnProps
);

type TrTdButtonCompanyStructureActionsProps = TrTdButtonCompanyStructureActionsMergedProps;

const TrTdButtonCompanyStructureActions: React.FC<TrTdButtonCompanyStructureActionsProps> = React.memo(
  (props) => {
    return (
      <EtsTbodyTrTd>
        <ButtonReadCompanyStructure
          rowData={props.rowData}
          registryKey={props.registryKey}
        />
        &nbsp;
        <ButtonRemoveCompanyStructure
          rowData={props.rowData}
          registryKey={props.registryKey}
        />
      </EtsTbodyTrTd>
    );
  },
);

export default TrTdButtonCompanyStructureActions;
