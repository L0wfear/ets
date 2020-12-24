import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { compose } from 'recompose';
import {
  OwnRefillProps,
  PropsRefill,
  PropsRefillWithForm,
  StatePropsRefill
} from 'components/new/pages/nsi/autobase/pages/refill_registry/form/@types/RefillForm';
import {connect} from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultRefillElement } from './utils';
import { refillFormSchema } from './schema';
import refillPermissions from 'components/new/pages/nsi/autobase/pages/refill_registry/_config-data/permissions';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';

class RefillForm extends React.PureComponent<PropsRefill, {}> {

  render() {
    const {
      formState: state,
      page,
      path,
    } = this.props;

    return (
      <EtsBootstrap.ModalContainer id="modal-refill" show onHide={this.props.hideWithoutChanges} bsSize="small">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Заправка</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Округ"
                readOnly
                value={state.okrug_name}
                boundKeys="okrug_name"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Организация"
                readOnly
                value={state.company_name}
                boundKeys="company_name"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Дата и время транзакции"
                readOnly
                value={state.refill_at_text}
                boundKeys="refill_at_text"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Номер топливной карты ГПН"
                readOnly
                value={state.fuel_card_number}
                boundKeys="fuel_card_number"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Тип топлива"
                readOnly
                value={state.fuel_type}
                boundKeys="fuel_type"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Выдано, л"
                readOnly
                value={state.fuel_given}
                boundKeys="fuel_given"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Рег. номер ТС"
                readOnly
                value={state.car_gov_number_text}
                boundKeys="car_gov_number_text"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Путевой лист"
                readOnly
                value={state.waybill_number}
                boundKeys="waybill_number"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Номер топливной карты, указанной в ПЛ"
                readOnly
                value={state.wb_fuel_card_numbers}
                boundKeys="wb_fuel_card_numbers"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Тип топлива, указанный в ПЛ"
                readOnly
                value={state.wb_fuel_types_text}
                boundKeys="wb_fuel_types_text"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Наименование АЗС"
                readOnly
                value={state.gas_station_name}
                boundKeys="gas_station_name"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Адрес АЗС"
                readOnly
                value={state.gas_station_address}
                boundKeys="gas_station_address"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Подразделение"
                readOnly
                value={state.structure_name}
                boundKeys="structure_name"
                dashIfEmpty
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsRefill, OwnRefillProps>(
  connect<StatePropsRefill, {}, OwnRefillProps, ReduxState>(
    (state) => ({
      refillList: getAutobaseState(state).refillList,
    }),
  ),
  withSearch,
  withForm<PropsRefillWithForm, Refill>({
    uniqField: 'rrn_code',
    mergeElement: (props) => {
      return getDefaultRefillElement(props.element);
    },
    schema: refillFormSchema,
    permissions: refillPermissions,
  }),
)(RefillForm);
