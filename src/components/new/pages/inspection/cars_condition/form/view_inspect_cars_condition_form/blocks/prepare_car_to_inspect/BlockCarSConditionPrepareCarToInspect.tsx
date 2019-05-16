import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Button } from 'react-bootstrap';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { FormErrorType, SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsViewInspectCarsConditionWithForm } from '../../@types/ViewInspectCarsContidion';

type BlockCarSConditionPrepareCarToInspectOwnProps = {
  onChange: any;
  preparing_cars_check: InspectCarsCondition['data']['preparing_cars_check'];
  error_preparing_cars_check: FormErrorType<SchemaType<InspectCarsCondition['data']['preparing_cars_check'], PropsViewInspectCarsConditionWithForm>>;
  isPermitted: boolean;
  isActiveInspect: boolean;
};

type BlockCarSConditionPrepareCarToInspectProps = (
  BlockCarSConditionPrepareCarToInspectOwnProps
  & WithSearchProps
);

const plannedTargetOptions = [
  { value: 'Соответствуют', label: 'Соответствуют' },
  { value: 'Не соответствуют', label: 'Не соответствуют' },
];
const statementsDefectsIssuedOptions = [
  { value: 'Оформлены', label: 'Оформлены' },
  { value: 'Не оформлены', label: 'Не оформлены' },
];

const BlockCarSConditionPrepareCarToInspect: React.FC<BlockCarSConditionPrepareCarToInspectProps> = React.memo(
  (props) => {
    const {
      preparing_cars_check: state,
      error_preparing_cars_check: errors,
      isPermitted,
      isActiveInspect,
    } = props;

    const handleChange = React.useCallback(
      (key, event) => {
        props.onChange({
          preparing_cars_check: {
            ...props.preparing_cars_check,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [props.onChange, props.preparing_cars_check],
    );

    const onClickMakePlan = React.useCallback(
      () => {
        props.setParams({
          typeRightView: 'prepare_plan',
          selectedCarsConditionsCar: null,
        });
      },
      [props.setParams, props.match.params],
    );

    return (
      <BoxContainer>
        <h4>Подготовка ТС к проверке</h4>
        <Button id="inspect_cars_conditions-prepare_plan" onClick={onClickMakePlan} >Внести план подготовки ТС</Button>
        <ExtField
          id="order_issued_at"
          type="date"
          time={false}
          label="Приказ о подготовке техники к сезону издан от:"
          value={state.order_issued_at}
          error={errors.order_issued_at}
          onChange={handleChange}
          boundKeys="order_issued_at"
          disabled={!isPermitted || !isActiveInspect}
          makeGoodFormat
          preventDateTime
        />
        <ExtField
          id="order_number"
          type="string"
          label="№ приказа:"
          value={state.order_number}
          error={errors.order_number}
          onChange={handleChange}
          boundKeys="order_number"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="master_plan_approved"
          type="string"
          label="Сводный план подготовки техники утвержден:"
          value={state.master_plan_approved}
          error={errors.master_plan_approved}
          onChange={handleChange}
          boundKeys="master_plan_approved"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="named_plan_approved"
          type="string"
          label="Поименный план подготовки техники утвержден:"
          value={state.named_plan_approved}
          error={errors.named_plan_approved}
          onChange={handleChange}
          boundKeys="named_plan_approved"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="planned_target"
          type="select"
          label="Плановые показатели:"
          options={plannedTargetOptions}
          clearable={false}
          value={state.planned_target}
          error={errors.planned_target}
          onChange={handleChange}
          boundKeys="planned_target"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="statements_defects_issued"
          type="select"
          label="Ведомости дефектов на каждую единицу техники, перечисленную в поименном плане:"
          options={statementsDefectsIssuedOptions}
          clearable={false}
          value={state.statements_defects_issued}
          error={errors.statements_defects_issued}
          onChange={handleChange}
          boundKeys="statements_defects_issued"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="statements_defects_not_issued_cnt"
          type="number"
          label="Не оформлено ведомостей дефектов на <кол-во> единиц техники:"
          value={state.statements_defects_not_issued_cnt}
          error={errors.statements_defects_not_issued_cnt}
          onChange={handleChange}
          boundKeys="statements_defects_not_issued_cnt"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="drawbacks_eliminated"
          type="string"
          label="Устранены ранее выявленные недостатки:"
          value={state.drawbacks_eliminated}
          error={errors.drawbacks_eliminated}
          onChange={handleChange}
          boundKeys="drawbacks_eliminated"
          disabled={!isPermitted || !isActiveInspect}
        />
        <ExtField
          id="drawbacks_new"
          type="string"
          label="Новые замечания:"
          value={state.drawbacks_new}
          error={errors.drawbacks_new}
          onChange={handleChange}
          boundKeys="drawbacks_new"
          disabled={!isPermitted || !isActiveInspect}
        />
      </BoxContainer>
    );
  },
);

export default withSearch<BlockCarSConditionPrepareCarToInspectOwnProps>(BlockCarSConditionPrepareCarToInspect);
