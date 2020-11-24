import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../@types/ViewInspectCarsContidion';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import CommissionMembers from './commission_members';
import AgentsFromGbu from './agents_from_gbu';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { ViewInspectAutobaseProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import { ViewInspectPgmBaseProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import BlockInspectAutobaseDataFiles from './block_data_files/BlockInspectAutobaseDataFiles';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { createValidDate } from 'components/@next/@utils/dates/dates';

type BlockCarsConditionSetInspectEmployeeProps = {
  type: keyof typeof INSPECT_TYPE_FORM;
  isPermittedChangeListParams: boolean;
  isPermittedListPhotosOfSupportingDocuments: boolean;
  isPermittedListPhotosDefect: boolean;

  commission_members: InspectCarsCondition['commission_members'];
  company_id: InspectCarsCondition['company_id'];

  agents_from_gbu: InspectCarsCondition['agents_from_gbu'];
  error_agents_from_gbu: string;
  error_commission_members: string;
  company_short_name: InspectCarsCondition['company_short_name'];

  files: InspectCarsCondition['files'];

  handleChange: ViewInspectCarsConditionProps['handleChange'] | ViewInspectAutobaseProps['handleChange'] | ViewInspectPgmBaseProps['handleChange'];

  resolve_to: InspectCarsCondition['resolve_to'];
  error_resolve_to: string;

  page: string;
  path?: string;
  dataForValidation?: {
    current_date: Date | string;
    props_resolve_to: Date | string;
  };
};

const BlockCarsConditionSetInspectEmployee: React.FC<BlockCarsConditionSetInspectEmployeeProps> = React.memo(
  (props) => {
    const { isPermittedChangeListParams } = props;
    const dispatch = etsUseDispatch();
    React.useEffect(() => {
      (async () => {
        const current_date = await dispatch(
          actionLoadTimeMoscow({}, { page: '' })
        );
        const props_resolve_to = props.resolve_to;
        props.handleChange('dataForValidation', {
          current_date: createValidDate(current_date.date),
          props_resolve_to: createValidDate(props_resolve_to),
        });
      })();
    }, []);

    return (
      <BoxContainer>
        <EtsBootstrap.Row>
          <BlockInspectAutobaseDataFiles
            files={props.files}

            isPermittedListPhotosOfSupportingDocuments={props.isPermittedListPhotosOfSupportingDocuments}
            isPermittedListPhotosDefect={props.isPermittedListPhotosDefect}
            onChange={props.handleChange}
          />
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              label="Срок, до которого необходимо представить отчет об устранении выявленных недостатков"
              value={props.resolve_to}
              time={false}
              error={props.error_resolve_to}
              disabled={!isPermittedChangeListParams}
              onChange={props.handleChange}
              boundKeys="resolve_to"
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <CommissionMembers
          isPermittedChangeListParams={isPermittedChangeListParams}

          commission_members={props.commission_members}
          error={props.error_commission_members}

          company_id={props.company_id}
          handleChange={props.handleChange}
          page={props.page}
          path={props.path}
        />
        <AgentsFromGbu
          isPermittedChangeListParams={isPermittedChangeListParams}
          agents_from_gbu={props.agents_from_gbu}
          error={props.error_agents_from_gbu}
          company_short_name={props.company_short_name}
          handleChange={props.handleChange}
        />
      </BoxContainer>
    );
  },
);

export default BlockCarsConditionSetInspectEmployee;
