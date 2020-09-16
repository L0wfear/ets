import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import {
  OwnPenaltyProps,
  PropsPenalty,
  StatePropsPenalty,
  PropsPenaltyWithForm
} from 'components/new/pages/nsi/autobase/pages/penalties/form/@types/PenaltyForm';
import {connect} from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';
import { getDefaultPenaltyElement } from './utils';
import { penaltyFormSchema } from './schema';
import penaltyPermissions from '../_config-data/permissions';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import { FileField } from 'components/old/ui/input/fields';

class PenaltyForm extends React.PureComponent<PropsPenalty, {}> {

  render() {
    const {
      formState: state,
      page,
      path,
    } = this.props;

    const isPermitted = this.props.isPermittedToCreate;

    return (
      <EtsBootstrap.ModalContainer id="modal-penalty" show onHide={this.props.hideWithoutChanges} bsSize="small">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Изменение записи</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Округ"
                readOnly
                value={state.okrug_name}
                boundKeys="okrug_name"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Организация"
                readOnly
                value={state.company_name}
                boundKeys="company_name"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="number"
                label="Номер постановления"
                readOnly
                value={state.ruling_number}
                boundKeys="ruling_number"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Дата постановления"
                readOnly
                value={state.ruling_date}
                boundKeys="ruling_date"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Подразделение"
                readOnly
                value={state.odps_name}
                boundKeys="odps_name"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Номер подразделения"
                readOnly
                value={state.odps_code}
                boundKeys="odps_code"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Тип документа нарушителя"
                readOnly
                value={state.violation_document_type}
                boundKeys="violation_document_type"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Номер документа нарушителя"
                readOnly
                value={state.violation_document_number}
                boundKeys="violation_document_number"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Водитель"
                readOnly
                value={state.driver_fio}
                boundKeys="driver_fio"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Номер путевого листа"
                readOnly
                value={state.waybills_text}
                boundKeys="waybills_text"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Номер задания"
                readOnly
                value={state.missions_text}
                boundKeys="missions_text"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Дата и время правонарушения"
                readOnly
                value={state.violation_datetime}
                boundKeys="violation_datetime"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Место правонарушения"
                readOnly
                value={state.violation_place}
                boundKeys="violation_place"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Размер штрафа"
                readOnly
                value={state.sum_to_pay}
                boundKeys="sum_to_pay"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Оплачен/не оплачен"
                readOnly
                value={state.is_paid ? 'Оплачен' : 'Не оплачен'}
                boundKeys="is_paid"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Статья КОАП или закона субъекта РФ, состав правонарушения"
                readOnly
                value={state.article_koap}
                boundKeys="article_koap"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="select"
                label="Обжалованный штраф"
                options={YES_NO_SELECT_OPTIONS_BOOL}
                value={state.is_appealed}
                onChange={this.props.handleChange}
                boundKeys="is_appealed"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FileField
                multiple
                label="Файл"
                type="file"
                boundKeys="files"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted
              ? (
                <EtsBootstrap.Button onClick={this.props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsPenalty, OwnPenaltyProps>(
  connect<StatePropsPenalty, {}, OwnPenaltyProps, ReduxState>(
    (state) => ({
      penaltyList: getAutobaseState(state).penaltyList,
    }),
  ),
  withSearch,
  withForm<PropsPenaltyWithForm, Penalty>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultPenaltyElement(props.element);
    },
    schema: penaltyFormSchema,
    permissions: penaltyPermissions,
  }),
)(PenaltyForm);
