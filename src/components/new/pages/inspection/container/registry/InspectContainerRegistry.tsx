import * as React from 'react';
import { Button } from 'react-bootstrap';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';
import { EtsTableWrap, EtsTable } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';

type InspectContainerRegistryProps = {
  actions: InspectContainer['actions'];
  page: string;
  path?: string;

  addToActionRow: () => void;
};

// нерабочий шаблон
export const InspectContainerRegistry: React.FC<InspectContainerRegistryProps> = (props) => {
  return (
    <>
      <EtsHeaderContainer>
        <EtsHeaderTitle>Проведённые мероприятия по подготовке емкости к эксплуатации</EtsHeaderTitle>
        <EtsButtonsContainer>
          <Button onClick={props.addToActionRow}>Добавить</Button>
          <Button disabled>Удалить</Button>
        </EtsButtonsContainer>
      </EtsHeaderContainer>
      <EtsTableDataContainer>
        <EtsTableWrap>
          <EtsTable fixedWidth={true}>
            <EtsThead>
              <tr>
                <EtsTheadTh width={30}>№</EtsTheadTh>
                <EtsTheadTh width={150}>Наименование работ</EtsTheadTh>
                <EtsTheadTh width={250}>Дата начала</EtsTheadTh>
                <EtsTheadTh width={250}>Дата окончая</EtsTheadTh>
              </tr>
            </EtsThead>
            <tbody>
              {
                props.actions.map((actionData, index) => (
                  <EtsTrTbody key={index} enable>
                    <EtsTbodyTrTd>{index + 1}</EtsTbodyTrTd>
                    <EtsTbodyTrTd>{actionData.name}</EtsTbodyTrTd>
                    <EtsTbodyTrTd>{actionData.date_start}</EtsTbodyTrTd>
                    <EtsTbodyTrTd>{actionData.date_end}</EtsTbodyTrTd>
                  </EtsTrTbody>
                ))
              }
            </tbody>
          </EtsTable>
        </EtsTableWrap>
      </EtsTableDataContainer>
    </>
  );
};

export default InspectContainerRegistry;
