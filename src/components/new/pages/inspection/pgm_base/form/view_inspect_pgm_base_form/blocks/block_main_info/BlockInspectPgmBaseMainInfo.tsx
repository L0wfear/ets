import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { ViewInspectPgmBaseProps } from '../../@types/ViewInspectPgmBase';
import { FormErrorType, SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { makeDate } from 'components/@next/@utils/dates/dates';

type BlockInspectPgmBaseMainInfoProps = {
  base_address: InspectPgmBase['base_address'];
  base_type: InspectPgmBase['base_type'];

  head_balance_holder_base: InspectPgmBase['head_balance_holder_base'];
  errors_head_balance_holder_base: FormErrorType<SchemaType<InspectPgmBase['head_balance_holder_base'], ViewInspectPgmBaseProps>>;
  head_operating_base: InspectPgmBase['head_operating_base'];
  errors_head_operating_base: FormErrorType<SchemaType<InspectPgmBase['head_operating_base'], ViewInspectPgmBaseProps>>;

  onChange: ViewInspectPgmBaseProps['handleChange'];
  isPermitted: boolean;
  inspectionState: InspectPgmBase;
};

const BlockInspectPgmBaseMainInfo: React.FC<BlockInspectPgmBaseMainInfoProps> = React.memo(
  (props) => {
    const {
      base_address,
      base_type,
      head_balance_holder_base,
      errors_head_balance_holder_base,
      head_operating_base,
      errors_head_operating_base,
      inspectionState,
    } = props;

    const handleChangeHeadBalanceHolderBase = React.useCallback(
      (key, value) => {
        props.onChange({
          head_balance_holder_base: {
            ...head_balance_holder_base,
            [key]: get(value, 'target.value', value),
          },
        });
      },
      [head_balance_holder_base, props.onChange],
    );

    const handleChangeHeadOperatingBase = React.useCallback(
      (key, value) => {
        props.onChange({
          head_operating_base: {
            ...head_operating_base,
            [key]: get(value, 'target.value', value),
          },
        });
      },
      [head_operating_base, props.onChange],
    );

    return (
      <BoxContainer>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Адрес базы:"
              value={base_address}
              readOnly
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Тип базы:"
              value={base_type}
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
          <EtsBootstrap.Col md={12}>
            <h4>Балансодержатель базы:</h4>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Руководитель балансодержателя:"
              value={head_balance_holder_base.fio}
              error={errors_head_balance_holder_base.fio}
              onChange={handleChangeHeadBalanceHolderBase}
              boundKeys="fio"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Телефон руководителя балансодержателя:"
              value={head_balance_holder_base.tel}
              error={errors_head_balance_holder_base.tel}
              onChange={handleChangeHeadBalanceHolderBase}
              boundKeys="tel"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h4>Организация, эксплуатирующая базу:</h4>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Руководитель организации, эксплуатирующей базу:"
              value={head_operating_base.fio}
              error={errors_head_operating_base.fio}
              onChange={handleChangeHeadOperatingBase}
              boundKeys="fio"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md ={6}>
            <ExtField
              type="string"
              label="Телефон руководителя организации, эксплуатирующей базу:"
              value={head_operating_base.tel}
              error={errors_head_operating_base.tel}
              onChange={handleChangeHeadOperatingBase}
              boundKeys="tel"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </BoxContainer>
    );
  },
);

export default BlockInspectPgmBaseMainInfo;
