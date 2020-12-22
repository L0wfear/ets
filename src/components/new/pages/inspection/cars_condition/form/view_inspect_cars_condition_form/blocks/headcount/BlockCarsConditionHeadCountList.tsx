import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { get } from 'lodash';
import { FormErrorType, SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsViewInspectCarsConditionWithForm } from '../../@types/ViewInspectCarsContidion';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type BlockCarsConditionHeadCountListProps = {
  onChange: (objChange: Partial<InspectCarsCondition['data']>) => any;
  headcount: InspectCarsCondition['data']['headcount'];
  error_headcount: FormErrorType<SchemaType<InspectCarsCondition['data']['headcount'], PropsViewInspectCarsConditionWithForm>>;
  isPermitted: boolean;
  isActiveInspect: boolean;
};

const BlockCarsConditionHeadCountList: React.FC<BlockCarsConditionHeadCountListProps> = React.memo(
  (props) => {
    const {
      headcount: state,
      error_headcount: errors,
      isPermitted,
      isActiveInspect,
    } = props;

    const [staffing_drivers, setStaffing_drivers] = React.useState<number>(null);
    const [staffing_mechanics, setStaffing_mechanics] = React.useState<number>(null);

    const handleChange = React.useCallback(
      (key, event) => {
        const defaultValue = get(event, 'target.value', event);
        const type = get(event, 'target.type', null);
        const value = (type === 'number' && !isNaN(Number(defaultValue))) ? Number(defaultValue) : defaultValue;
        props.onChange({
          headcount: {
            ...props.headcount,
            [key]: value,
          },
        });
      },
      [props.onChange, props.headcount],
    );

    React.useEffect( () => {
      setStaffing_drivers(
        state.staff_drivers
          ? Number((state.list_drivers / state.staff_drivers * 100).toFixed())
          : staffing_drivers,
      );
      setStaffing_mechanics(
        state.staff_mechanics
          ? Number((state.list_mechanics / state.staff_mechanics * 100).toFixed())
          : staffing_mechanics,
      );
    }, [state.staff_drivers, state.list_drivers, state.staff_mechanics, state.list_mechanics ]);

    return (
      <BoxContainer>
        <h4>Штатная и списочная численность</h4>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h5>По штатному расписанию</h5>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="staff_drivers"
              type="number"
              label="Водителей, чел."
              value={state.staff_drivers}
              onChange={handleChange}
              boundKeys="staff_drivers"
              error={errors.staff_drivers}
              disabled={!isActiveInspect || !isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="staff_mechanics"
              type="number"
              label="Механизаторов, чел."
              value={state.staff_mechanics}
              onChange={handleChange}
              boundKeys="staff_mechanics"
              error={errors.staff_mechanics}
              disabled={!isActiveInspect || !isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h5>Списочное количество</h5>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="list_drivers"
              type="number"
              label="Водителей, чел."
              value={state.list_drivers}
              onChange={handleChange}
              boundKeys="list_drivers"
              error={errors.list_drivers}
              disabled={!isActiveInspect || !isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="list_mechanics"
              type="number"
              label="Механизаторов, чел."
              value={state.list_mechanics}
              onChange={handleChange}
              boundKeys="list_mechanics"
              error={errors.list_mechanics}
              disabled={!isActiveInspect || !isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h5>Укомплектованность.</h5>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="staffing_drivers"
              type="number"
              label="Водителей, %"
              value={staffing_drivers}
              boundKeys="staffing_drivers"
              disabled
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="staffing_mechanics"
              type="number"
              label="Механизаторов, %"
              value={staffing_mechanics}
              boundKeys="staffing_mechanics"
              disabled
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </BoxContainer>
    );
  },
);

export default BlockCarsConditionHeadCountList;
