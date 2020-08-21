import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { RowAddRowAddAgentFromGbuWrapper, AgentsFromGbuMemberDataContainer, AgentsFromGbuCloseBtn } from './styled';
import { get } from 'lodash';
import { FooterEnd } from 'global-styled/global-styled';
import { getNoTrimSpaceMessage, getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';

type RowAddRowAddAgentFromGbuMergedProps = {
  isPermitted: boolean;
  handleAddChangeRowAddAgentFromGbu: (agents_from_gbu: ValuesOf<InspectCarsCondition['agents_from_gbu']>) => any;
  handleCloseGbu: any;
  showCloseBtn: boolean;
};

type RowAddRowAddAgentFromGbuProps = RowAddRowAddAgentFromGbuMergedProps;

const RowAddRowAddAgentFromGbu: React.FC<RowAddRowAddAgentFromGbuProps> = React.memo(
  (props) => {
    const [newAgent, setNewAgent] = React.useState<ValuesOf<InspectCarsCondition['agents_from_gbu']>>({ fio: null, position: null });

    const newAgentPosition = get(newAgent, 'position');
    const newAgentFio = get(newAgent, 'fio');

    const handleClickAddAgentFromGbu = React.useCallback(
      () => {
        props.handleAddChangeRowAddAgentFromGbu({
          fio: newAgent.fio,
          position: newAgent.position,
        });
        setNewAgent(null);
        props.handleCloseGbu();
      },
      [newAgent],
    );

    const handleChangeNewAgent = React.useCallback(
      (key, value) => {
        setNewAgent({
          ...newAgent,
          [key]: value,
        });
      },
      [setNewAgent, newAgent],
    );

    const newAgentPositionError = React.useMemo(() => {
      if (!newAgentPosition) {
        return getRequiredFieldMessage('Должность');
      }

      if (newAgentPosition?.trim() !== newAgentPosition) {
        return getNoTrimSpaceMessage('Должность');
      }

      return '';
    }, [newAgentPosition]);

    const newAgentFioError = React.useMemo(() => {
      if (!newAgentFio) {
        return getRequiredFieldMessage('ФИО');
      }

      if (newAgentFio?.trim() !== newAgentFio) {
        return getNoTrimSpaceMessage('ФИО');
      }

      return '';
    }, [newAgentFio]);

    return (
      <RowAddRowAddAgentFromGbuWrapper>
        {
          Boolean(props.isPermitted) && (
            <AgentsFromGbuMemberDataContainer>
              {
                props.showCloseBtn && (
                  <FooterEnd>
                    <AgentsFromGbuCloseBtn onClick={props.handleCloseGbu}>
                      <EtsBootstrap.Glyphicon glyph="remove"/>
                    </AgentsFromGbuCloseBtn>
                  </FooterEnd>
                )
              }
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    type="string"
                    label="Должность"
                    error={newAgentPositionError}
                    value={newAgentPosition}
                    onChange={handleChangeNewAgent}
                    boundKeys="position"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    type="string"
                    label="ФИО"
                    error={newAgentFioError}
                    value={newAgentFio}
                    onChange={handleChangeNewAgent}
                    boundKeys="fio"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={12}>
                  <EtsBootstrap.Button
                    disabled={Boolean(newAgentPositionError) || Boolean(newAgentFioError)}
                    onClick={handleClickAddAgentFromGbu}
                  >
                    Сохранить
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
