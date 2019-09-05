import * as React from 'react';

import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';
import { EtsTableWrap } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
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
          <EtsBootstrap.Grid.GridTable fixedWidth={true}>
            <EtsBootstrap.Grid.GridBootstrapThead.Thead>
              <EtsBootstrap.Grid.GridBootstrapThead.Tr>
                <EtsBootstrap.Grid.GridBootstrapThead.Th width={30}>№</EtsBootstrap.Grid.GridBootstrapThead.Th>
                <EtsBootstrap.Grid.GridBootstrapThead.Th width={150}>Наименование работ</EtsBootstrap.Grid.GridBootstrapThead.Th>
                <EtsBootstrap.Grid.GridBootstrapThead.Th width={250}>Дата начала</EtsBootstrap.Grid.GridBootstrapThead.Th>
                <EtsBootstrap.Grid.GridBootstrapThead.Th width={250}>Дата окончания</EtsBootstrap.Grid.GridBootstrapThead.Th>
              </EtsBootstrap.Grid.GridBootstrapThead.Tr>
            </EtsBootstrap.Grid.GridBootstrapThead.Thead>
            <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
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
            </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
          </EtsBootstrap.Grid.GridTable>
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
