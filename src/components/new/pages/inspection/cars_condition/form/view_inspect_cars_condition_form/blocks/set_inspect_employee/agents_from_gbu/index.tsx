import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import ViewAgentFromGbuEmployee from './ViewAgentFromGbuEmployee';
import RowAddRowAddAgentFromGbu from './RowAddAgentFromGbu';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ViewInspectAutobaseProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import { ViewInspectPgmBaseProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
import { AgentsFromGbuWrapper, AgentsFromGbuAddBtn } from './styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { CommissionMembersDataContainer } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/commission_members/styled';
import { SlimH4 } from 'global-styled/global-styled';

type AgentsFromGbuProps = {
  isPermittedChangeListParams: boolean;

  agents_from_gbu: InspectCarsCondition['agents_from_gbu'];
  error: string;
  company_short_name: InspectCarsCondition['company_short_name'];
  handleChange: (
    ViewInspectCarsConditionProps['handleChange']
    | ViewInspectAutobaseProps['handleChange']
    | ViewInspectPgmBaseProps['handleChange']
  );
};

const AgentsFromGbu: React.FC<AgentsFromGbuProps> = React.memo(
  (props) => {

    const [showGbu, setShowGbu] = React.useState(false);
    const [showCloseBtn, setShowCloseBtn] = React.useState(false);

    const handleRemoveAgent = React.useCallback(
      (index) => {
        props.handleChange({
          agents_from_gbu: props.agents_from_gbu.filter((_, indexRow) => index !== indexRow),
        });
      },
      [props.agents_from_gbu, props.handleChange],
    );

    const handleAddChangeRowAddAgentFromGbu = React.useCallback(
      (agent_from_gbu: ValuesOf<AgentsFromGbuProps['agents_from_gbu']>) => {
        props.handleChange({
          agents_from_gbu: [
            ...props.agents_from_gbu,
            agent_from_gbu,
          ],
        });
      },
      [props.agents_from_gbu, props.handleChange],
    );

    const handleShowGbu = React.useCallback( () => {
        setShowGbu(true);
      },
      [props.agents_from_gbu],
    );

    const handleCloseGbu = React.useCallback( () => {
        setShowGbu(false);
      },
      [props.agents_from_gbu],
    );

    React.useEffect(() => {
      if (!props.agents_from_gbu.length) { // Если нет сотркдников ГБУ, то отображаем блок
        setShowGbu(true);
        setShowCloseBtn(false);
      } else {
        setShowCloseBtn(true);
      }
    }, [props.agents_from_gbu]);

    return (
      <AgentsFromGbuWrapper>
        <SlimH4>Представители ГБУ</SlimH4>
        {
          Boolean(props.error) && (
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <ErrorsBlock
                  error={props.error}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          )
        }
        { props.agents_from_gbu && (
          <CommissionMembersDataContainer>
            {
              props.agents_from_gbu.map((agent, index) => (
                <ViewAgentFromGbuEmployee
                  key={index + 1}
                  canRemove={props.isPermittedChangeListParams}
                  index={index}
                  handleRemove={handleRemoveAgent}
                  company_short_name={props.company_short_name}

                  fio={agent.fio}
                  position={agent.position}
                />
              ))
            }
          </CommissionMembersDataContainer>
        )}
        {
          props.isPermittedChangeListParams &&
            (
              <AgentsFromGbuAddBtn
                disabled={showGbu}
                onClick={handleShowGbu}
              >
                <EtsBootstrap.Glyphicon glyph='plus' />
                Добавить представителя ГБУ
              </AgentsFromGbuAddBtn>
            )
        }
        {
          showGbu && (
            <RowAddRowAddAgentFromGbu
              isPermitted={props.isPermittedChangeListParams}
              handleAddChangeRowAddAgentFromGbu={handleAddChangeRowAddAgentFromGbu}
              handleCloseGbu={handleCloseGbu}
              showCloseBtn={showCloseBtn}
            />
          )
        }
      </AgentsFromGbuWrapper>
    );
  },
);

export default AgentsFromGbu;
