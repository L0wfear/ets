import * as React from 'react';
import { get } from 'lodash';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { FormErrorType, SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsViewInspectCarsConditionWithForm } from '../../@types/ViewInspectCarsContidion';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type BlockCarsConditionCarsUseProps = {
  onChange: (objChange: Partial<InspectCarsCondition['data']>) => any;
  cars_use: InspectCarsCondition['data']['cars_use'];
  carsConditionCarsList: CarsConditionCars[];
  error_cars_use: FormErrorType<SchemaType<InspectCarsCondition['data']['cars_use'], PropsViewInspectCarsConditionWithForm>>;
  isPermitted: boolean;
  isActiveInspect: boolean;
};

const waybillIssueLogExistsOptions = [
  { value: 'Есть', label: 'Есть' },
  { value: 'Отсутствует', label: 'Отсутствует' },
];
const waybillIssueLogUsedOptions = [
  { value: 'Ведется', label: 'Ведется' },
  { value: 'Не ведется', label: 'Не ведется' },
];

const BlockCarsConditionCarsUse: React.FC<BlockCarsConditionCarsUseProps> = React.memo(
  (props) => {
    const {
      cars_use: state,
      error_cars_use: errors,
      carsConditionCarsList,
      isActiveInspect,
      isPermitted,
    } = props;

    const handleChange = React.useCallback(
      (key, event) => {
        props.onChange({
          cars_use: {
            ...props.cars_use,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [props.onChange, props.cars_use],
    );

    const countData = React.useMemo(
      () => {
        return carsConditionCarsList.reduce(
          (objCount, carData) => {
            if (carData.fact_status) {
              objCount[carData.fact_status] += 1;
            }

            return objCount;
          },
          {
            on_line: 0,
            maintenance: 0,
            storage: 0,
            repair: 0,
            not_used: 0,
          });
      },
      [carsConditionCarsList],
    );

    return (
      <BoxContainer>
        <h4>На момент проверки использования ТС</h4>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h5>Журнал выдачи путевых листов.</h5>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="waybill_issue_log_exists"
              type="select"
              label={false}
              value={state.waybill_issue_log_exists}
              options={waybillIssueLogExistsOptions}
              onChange={handleChange}
              boundKeys="waybill_issue_log_exists"
              error={errors.waybill_issue_log_exists}
              disabled={!isActiveInspect || !isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="waybill_issue_log_used"
              type="select"
              label={false}
              value={state.waybill_issue_log_used}
              options={waybillIssueLogUsedOptions}
              onChange={handleChange}
              boundKeys="waybill_issue_log_used"
              error={errors.waybill_issue_log_used}
              disabled={!isActiveInspect || !isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <ExtField
          type="string"
          label="На линии:"
          value={countData.on_line}
          readOnly
          inline
        />
        <ExtField
          type="string"
          label="На техническом обслуживании:"
          value={countData.maintenance}
          readOnly
          inline
        />
        <ExtField
          type="string"
          label="В текущем ремонте, в ожидании ремонта:"
          value={countData.repair}
          readOnly
          inline
        />
        <ExtField
          type="string"
          label="Находится на консервации (хранении):"
          value={countData.storage}
          readOnly
          inline
        />
        <ExtField
          type="string"
          label="Не используется:"
          value={countData.not_used}
          readOnly
          inline
        />
        <ExtField
          id="comment"
          type="text"
          value={state.comment}
          onChange={handleChange}
          boundKeys="comment"
          error={errors.comment}
          disabled={!isActiveInspect || !isPermitted}
        />
        <ExtField
          id="comment_detected"
          type="text"
          label="Выявлено и установлено"
          value={state.comment_detected}
          onChange={handleChange}
          boundKeys="comment_detected"
          error={errors.comment_detected}
          disabled={!isActiveInspect || !isPermitted}
        />
      </BoxContainer>
    );
  },
);

export default BlockCarsConditionCarsUse;
