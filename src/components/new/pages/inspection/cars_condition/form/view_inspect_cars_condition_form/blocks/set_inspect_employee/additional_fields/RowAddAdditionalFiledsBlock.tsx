import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { RowAddAdditionalFiledsWrapper } from './styled';
import { AgentsFromGbuMemberDataContainer } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/agents_from_gbu/styled';
import AdditionalFiledsBlock from './fields_block/AdditionalFiledsBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import { ViewInspectAutobaseProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import { ViewInspectPgmBaseProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
import { CommonDataInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';

const AdditionalFiledsBlockWithKeys = onChangeWithKeys(AdditionalFiledsBlock);

type RowAddCommissionMembersProps = {
  handleChange: (
    ViewInspectCarsConditionProps['handleChange']
    | ViewInspectAutobaseProps['handleChange']
    | ViewInspectPgmBaseProps['handleChange']
  );
  additional_fields: CommonDataInspect['additional_fields'];
  isPermitted: boolean;
  selectField: string;
  page: string;
  path?: string;
}; 

const RowAddAdditionalFiledsBlock: React.FC<RowAddCommissionMembersProps> = React.memo(
  (props) => {
    const disabledAddButton = React.useMemo(() => props.additional_fields.length >=10, [props.additional_fields]);
    const onChange = React.useCallback((key, value) => {
      props.handleChange({[key]: value});
    }, [props.additional_fields, props.handleChange, props.selectField]);
    return (
      <RowAddAdditionalFiledsWrapper>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={10}>
            <AgentsFromGbuMemberDataContainer>
              <AdditionalFiledsBlockWithKeys
                onChange={onChange}
                isPermitted={props.isPermitted}
                inputList={props.additional_fields}
                page={props.page}
                path={props.path}
                tableTitle="Добавление полей"
                selectField={props.selectField}
                boundKeys="additional_fields"
                disabledAddButton={disabledAddButton}

              />
            </AgentsFromGbuMemberDataContainer>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </RowAddAdditionalFiledsWrapper>
    );
  },
);

export default RowAddAdditionalFiledsBlock;
