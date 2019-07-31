import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { DivNone, FooterEnd } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { AgentsFromGbuDataContainerAddMember, RowAddRowAddAgentFromGbuWrapper } from './styled';

type RowAddRowAddAgentFromGbuMergedProps = {
  isPermitted: boolean;
  handleAddChangeRowAddAgentFromGbu: (agents_from_gbu: ValuesOf<InspectCarsCondition['agents_from_gbu']>) => any;
};

type RowAddRowAddAgentFromGbuProps = RowAddRowAddAgentFromGbuMergedProps;

const RowAddRowAddAgentFromGbu: React.FC<RowAddRowAddAgentFromGbuProps> = React.memo(
  (props) => {
    const [newAgent, setNewAgent] = React.useState<ValuesOf<InspectCarsCondition['agents_from_gbu']>>(null);

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

    const handleClickClose = React.useCallback(
      () => {
        setNewAgent(null);
      },
      [setNewAgent],
    );

    const handleClickAddTemplateAgent = React.useCallback(
      () => {
        setNewAgent({
          fio: '',
          position: '',
        });
      },
      [setNewAgent],
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
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            {
              props.isPermitted
                ? (
                  <EtsBootstrap.Row>
                    <EtsBootstrap.Col mdOffset={6} md={6}>
                      <EtsBootstrap.Button block disabled={Boolean(newAgent)} onClick={handleClickAddTemplateAgent}>
                        <EtsBootstrap.Glyphicon glyph="plus" /> {'Добавить представителей ГБУ'}
                      </EtsBootstrap.Button>
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>
                )
                : (
                  <DivNone />
                )
            }
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
          {
            Boolean(newAgent && props.isPermitted) && (
              <AgentsFromGbuDataContainerAddMember md={12}>
                <EtsBootstrap.Row>
                  <EtsBootstrap.Col md={12}>
                    <FooterEnd>
                      <EtsBootstrap.Glyphicon glyph="remove" onClick={handleClickClose} />
                    </FooterEnd>
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={6}>
                    <ExtField
                      type="string"
                      label="Должность"
                      error={!newAgent.position ? 'Поле "Должность" должно быть заполнено' : ''}
                      value={newAgent.position}
                      onChange={handleChangeNewAgent}
                      boundKeys="position"
                    />
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={6}>
                    <ExtField
                      type="string"
                      label="ФИО"
                      error={!newAgent.fio ? 'Поле "ФИО" должно быть заполнено' : ''}
                      value={newAgent.fio}
                      onChange={handleChangeNewAgent}
                      boundKeys="fio"
                    />
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={12}>
                    <EtsBootstrap.Button
                      disabled={!newAgent.fio || !newAgent.position}
                      onClick={handleClickAddAgentFromGbu}
                    >Сохранить</EtsBootstrap.Button>
                  </EtsBootstrap.Col>
                </EtsBootstrap.Row>
              </AgentsFromGbuDataContainerAddMember>
            )
          }
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </RowAddRowAddAgentFromGbuWrapper>
    );
  },
);

export default RowAddRowAddAgentFromGbu;
