import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { DivNone } from 'global-styled/global-styled';
import { get } from 'lodash';
import { FormErrorType, SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsViewInspectCarsConditionWithForm } from '../../@types/ViewInspectCarsContidion';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { makeDate } from 'components/@next/@utils/dates/dates';

type BlockCarSConditionInfoProps = {
  head_balance_holder_base: InspectCarsCondition['head_balance_holder_base'];
  head_operating_base: InspectCarsCondition['head_operating_base'];
  company_short_name: InspectCarsCondition['company_short_name'];
  monitoring_kind_text: InspectCarsCondition['monitoring_kind_text'];
  checks_period_text: InspectCarsCondition['checks_period_text'];
  checks_type_text: InspectCarsCondition['checks_type_text'];

  error_head_balance_holder_base: FormErrorType<SchemaType<InspectCarsCondition['head_balance_holder_base'], PropsViewInspectCarsConditionWithForm>>;
  error_head_operating_base: FormErrorType<SchemaType<InspectCarsCondition['head_operating_base'], PropsViewInspectCarsConditionWithForm>>;

  isPermitted: boolean;
  isActiveInspect: boolean;
  inspectionState: InspectCarsCondition;

  onChange: any;
};

const BlockCarSConditionInfo: React.FC<BlockCarSConditionInfoProps> = React.memo(
  (props) => {
    const {
      isPermitted,
      isActiveInspect,
      error_head_balance_holder_base,
      error_head_operating_base,
      inspectionState,
    } = props;
    const handleChangeHeadOperatingBase = React.useCallback(
      (key, event) => {
        props.onChange({
          head_operating_base: {
            ...props.head_operating_base,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [props.onChange, props.head_operating_base],
    );
    const handleChangeHeadBalanceHolderBase = React.useCallback(
      (key, event) => {
        props.onChange({
          head_balance_holder_base: {
            ...props.head_balance_holder_base,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [props.onChange, props.head_balance_holder_base],
    );

    return (
      <BoxContainer>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Организация:"
              value={props.company_short_name}
              readOnly
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Вид мониторинга:"
              value={props.monitoring_kind_text}
              readOnly
              inline
            />
          </EtsBootstrap.Col>
          {
            props.checks_period_text
              ? (
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    type="string"
                    label="Период проверки:"
                    value={props.checks_period_text}
                    readOnly
                    inline
                  />
                </EtsBootstrap.Col>
              )
              : (
                <DivNone />
              )
          }
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Тип проверки:"
              value={props.checks_type_text}
              readOnly
              inline
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6} sm={6}>
            <ExtField
              type="string"
              label="Статус проверки:"
              value={inspectionState.status_text}
              readOnly
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6} sm={6}>
            <ExtField
              type="string"
              label="Проверка открыта:"
              value={makeDate(inspectionState.date_start)}
              readOnly
              inline
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {
          inspectionState.date_end && (
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6} sm={6}>
                <ExtField
                  type="string"
                  label="Проверка завершена:"
                  value={makeDate(inspectionState.date_end)}
                  readOnly
                  inline
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          )
        }
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="head_balance_holder_base_fio"
              type="string"
              label="Руководитель предприятия:"
              value={props.head_balance_holder_base.fio}
              error={error_head_balance_holder_base.fio}
              onChange={handleChangeHeadBalanceHolderBase}
              boundKeys="fio"
              disabled={!isPermitted}
              readOnly={!isActiveInspect}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="head_balance_holder_base_tel"
              type="string"
              label="Телефон:"
              value={props.head_balance_holder_base.tel}
              error={error_head_balance_holder_base.tel}
              onChange={handleChangeHeadBalanceHolderBase}
              boundKeys="tel"
              disabled={!isPermitted}
              readOnly={!isActiveInspect}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="head_operating_base_fio"
              type="string"
              label="Лицо, ответственное за автотранспортную деятельность:"
              value={props.head_operating_base.fio}
              error={error_head_operating_base.fio}
              onChange={handleChangeHeadOperatingBase}
              boundKeys="fio"
              disabled={!isPermitted}
              readOnly={!isActiveInspect}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="head_operating_base_tel"
              type="string"
              label="Телефон:"
              value={props.head_operating_base.tel}
              error={error_head_operating_base.tel}
              onChange={handleChangeHeadOperatingBase}
              boundKeys="tel"
              disabled={!isPermitted}
              readOnly={!isActiveInspect}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </BoxContainer>
    );
  },
);

export default BlockCarSConditionInfo;
