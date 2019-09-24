import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { RowAddRowAddAgentFromGbuWrapper, AgentsFromGbuMemberDataContainer } from './styled';
import { get } from 'lodash';

type RowAddRowAddAgentFromGbuMergedProps = {
  isPermitted: boolean;
  handleAddChangeRowAddAgentFromGbu: (agents_from_gbu: ValuesOf<InspectCarsCondition['agents_from_gbu']>) => any;
};

type RowAddRowAddAgentFromGbuProps = RowAddRowAddAgentFromGbuMergedProps;

const RowAddRowAddAgentFromGbu: React.FC<RowAddRowAddAgentFromGbuProps> = React.memo(
  (props) => {
    const [newAgent, setNewAgent] = React.useState<ValuesOf<InspectCarsCondition['agents_from_gbu']>>({fio: null, position: null});

    const newAgentPosition = get(newAgent, 'position');
    const newAgentFio = get(newAgent, 'fio');

    const handleClickAddAgentFromGbu = React.useCallback(
      () => {
        props.handleAddChangeRowAddAgentFromGbu({
          fio: newAgent.fio,
          position: newAgent.position,
        });
        setNewAgent(null);
      },
      [newAgent],
    );

    const handleChangeNewAgent = React.useCallback(
      (key, event) => {
        setNewAgent({
          ...newAgent,
          [key]: event.target.value,
        });
      },
      [setNewAgent, newAgent],
    );

    return (
      <RowAddRowAddAgentFromGbuWrapper>
        {
          Boolean(props.isPermitted) && (
            <AgentsFromGbuMemberDataContainer>
              <EtsBootstrap.Row>
                  <EtsBootstrap.Col md={6}>
                    <ExtField
                      type="string"
                      label="Должность"
                      error={!newAgentPosition ? 'Поле "Должность" должно быть заполнено' : ''}
                      value={newAgentPosition}
                      onChange={handleChangeNewAgent}
                      boundKeys="position"
                    />
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={6}>
                    <ExtField
                      type="string"
                      label="ФИО"
                      error={!newAgentFio ? 'Поле "ФИО" должно быть заполнено' : ''}
                      value={newAgentFio}
                      onChange={handleChangeNewAgent}
                      boundKeys="fio"
                    />
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={12}>
                  <EtsBootstrap.Button
                    disabled={!newAgentFio || !newAgentPosition}
                    onClick={handleClickAddAgentFromGbu}
                  >
                    <EtsBootstrap.Glyphicon glyph='plus' />
                    Добавить представителей ГБУ
                  </EtsBootstrap.Button>
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </AgentsFromGbuMemberDataContainer>
          )
        }
      </RowAddRowAddAgentFromGbuWrapper>
    );
  },
);

export default RowAddRowAddAgentFromGbu;
