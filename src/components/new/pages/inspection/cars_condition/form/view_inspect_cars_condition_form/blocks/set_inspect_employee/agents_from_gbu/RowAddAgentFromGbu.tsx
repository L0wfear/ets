import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { Row, Col, Button } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone, FooterEnd } from 'global-styled/global-styled';

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
      <div>
        <Row>
          <Col md={12}>
            {
              props.isPermitted
                ? (
                  <FooterEnd>
                    <Button disabled={Boolean(newAgent)} onClick={handleClickAddTemplateAgent}>Добавить проверяющего</Button>
                  </FooterEnd>
                )
                : (
                  <DivNone />
                )
            }
          </Col>
        </Row>
        {
          newAgent && props.isPermitted
            ? (
              <div>
                <Row>
                  <Col md={12}>
                    <ExtField
                      type="string"
                      label="Должность"
                      error={!newAgent.position ? 'Поле "Должность" должно быть заполнено' : ''}
                      value={newAgent.position}
                      onChange={handleChangeNewAgent}
                      boundKeys="position"
                    />
                    <ExtField
                      type="string"
                      label="ФИО"
                      error={!newAgent.fio ? 'Поле "ФИО" должно быть заполнено' : ''}
                      value={newAgent.fio}
                      onChange={handleChangeNewAgent}
                      boundKeys="fio"
                    />
                    <br />
                    <FooterEnd>
                      <Button
                        disabled={!newAgent.fio || !newAgent.position}
                        onClick={handleClickAddAgentFromGbu}
                      >Сохранить</Button>
                    </FooterEnd>
                  </Col>
                </Row>
              </div>
            )
            : (
              <DivNone />
            )
        }
      </div>
    );
  },
);

export default RowAddRowAddAgentFromGbu;
