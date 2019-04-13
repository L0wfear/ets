import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import { InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { get } from 'lodash';
import { Row, Col } from 'react-bootstrap';

type BlockCarsConditionCarsUseProps = {
  onChange: any;
  headcount_list: InspectCarsCondition['headcount_list'];
  carsConditionCarsList: CarsConditionCars[];
  disabled?: boolean;
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
      headcount_list: {
        cars_use: state,
      },
      carsConditionCarsList,
    } = props;

    const handleChange = React.useCallback(
      (key, event) => {
        props.onChange({
          headcount_list: {
            ...props.headcount_list,
            cars_use: {
              ...props.headcount_list.cars_use,
              [key]: get(event, 'target.value', event),
            },
          },
        });
      },
      [props.onChange, props.headcount_list],
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
        <Row>
          <Col md={12}>
            <h5>Журнал выдачи путевых листов.</h5>
          </Col>
          <Col md={6}>
            <ExtField
              id="waybill_issue_log_exists"
              type="select"
              label={false}
              value={state.waybill_issue_log_exists}
              options={waybillIssueLogExistsOptions}
              onChange={handleChange}
              boundKeys="waybill_issue_log_exists"
              disabled={props.disabled}
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="waybill_issue_log_used"
              type="select"
              label={false}
              value={state.waybill_issue_log_used}
              options={waybillIssueLogUsedOptions}
              onChange={handleChange}
              boundKeys="waybill_issue_log_used"
              disabled={props.disabled}
            />
          </Col>
        </Row>
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
          disabled={props.disabled}
        />
        <ExtField
          id="comment_detected"
          type="text"
          label="Выявлено и установлено"
          value={state.comment_detected}
          onChange={handleChange}
          boundKeys="comment_detected"
          disabled={props.disabled}
        />
      </BoxContainer>
    );
  },
);

export default BlockCarsConditionCarsUse;
