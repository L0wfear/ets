import * as React from 'react';

import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';
import { EtsTableWrap, EtsTable } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import ContainerRegistryTr from './ContainerRegistryTr';
import InspectContainerFormAddActionLazy from './form_add_action';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type InspectContainerRegistryProps = {
  actions: InspectContainer['actions'];
  page: string;
  path?: string;

  addToActionRow: (obj: ValuesOf<InspectContainer['actions']>) => void;
  removeActionByIndex: (index: number) => void;

  isPermitted: boolean;
};

// нерабочий шаблон
export const InspectContainerRegistry: React.FC<InspectContainerRegistryProps> = (props) => {
  const [showForm, setShowForm] = React.useState(null);
  const [selectedRowNumber, setSelectedRowNumber] = React.useState<number>(null);

  React.useEffect(
    () => {
      setSelectedRowNumber(null);
    },
    [props.actions],
  );

  const handleClickRow = React.useCallback(
    (selectedRowNumberNew) => {
      if (props.isPermitted) {
        setSelectedRowNumber(selectedRowNumberNew);
      }
    },
    [props.isPermitted],
  );

  const removeActionByIndex = React.useCallback(
    () => {
      props.removeActionByIndex(selectedRowNumber - 1);
    },
    [selectedRowNumber],
  );

  const setShowFormTrue = React.useCallback(
    () => {
      setShowForm(true);
    },
    [],
  );

  const setShowFormFalse = React.useCallback(
    () => {
      setShowForm(false);
    },
    [],
  );

  const addToActionRow = React.useCallback(
    (action) => {
      props.addToActionRow(action);
      setShowFormFalse();
    },
    [],
  );

  return (
    <>
      <EtsHeaderContainerWrap>
        <EtsHeaderContainer>
          <EtsHeaderTitle>Проведённые мероприятия по подготовке емкости к эксплуатации</EtsHeaderTitle>
          <EtsButtonsContainer>
            {
              props.isPermitted && (
                <React.Fragment>
                  <EtsBootstrap.Button onClick={setShowFormTrue}>Добавить</EtsBootstrap.Button>
                  <EtsBootstrap.Button onClick={removeActionByIndex} disabled={!selectedRowNumber}>Удалить</EtsBootstrap.Button>
                </React.Fragment>
              )
            }
          </EtsButtonsContainer>
        </EtsHeaderContainer>
      </EtsHeaderContainerWrap>
      <EtsTableDataContainer>
        <EtsTableWrap>
          <EtsTable fixedWidth={true}>
            <EtsThead>
              <tr>
                <EtsTheadTh width={30}>№</EtsTheadTh>
                <EtsTheadTh width={150}>Наименование работ</EtsTheadTh>
                <EtsTheadTh width={250}>Дата начала</EtsTheadTh>
                <EtsTheadTh width={250}>Дата окончания</EtsTheadTh>
              </tr>
            </EtsThead>
            <tbody>
              {
                props.actions.map((actionData, index) => (
                  <ContainerRegistryTr
                    key={index + 1}
                    actionData={actionData}
                    rowNumber={index + 1}
                    onClickRow={handleClickRow}
                    isSelected={selectedRowNumber === (index + 1)}
                  />
                ))
              }
            </tbody>
          </EtsTable>
        </EtsTableWrap>
      </EtsTableDataContainer>
      <InspectContainerFormAddActionLazy
        showForm={showForm}
        addAction={addToActionRow}
        hideWithoutChanges={setShowFormFalse}
      />
    </>
  );
};

export default InspectContainerRegistry;
