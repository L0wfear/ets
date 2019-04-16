import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnOdhNormDataSummerProps,
  PropsOdhNormDataSummer,
  StatePropsOdhNormDataSummer,
  DispatchPropsOdhNormDataSummer,
  PropsOdhNormDataSummerWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/form/@types/OdhNormDataSummerForm';
import { DivNone } from 'global-styled/global-styled';
import odhNormDataSummerPermissions from '../_config-data/permissions';
import { odhNormDataSummerFormSchema } from './schema';
import { OdhNormDataSummer } from 'redux-main/reducers/modules/odh_norm_data_summer/@types/odhNormDataSummer';
import { getDefaultOdhNormDataSummerElement } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionCreateOdhNormDataSummer, actionUpdateOdhNormDataSummer } from 'redux-main/reducers/modules/odh_norm_data_summer/actions_odh_norm_data_summer';
import { Row, Col } from 'react-bootstrap';

const OdhNormDataSummerForm: React.FC<PropsOdhNormDataSummer> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    IS_CREATING,
    isPermitted: isPermittedOwn,
  } = props;

  const isPermitted = isPermittedOwn && false;

  const title = (
    !IS_CREATING
      ? 'Добавление показателя нормы по содержанию ОДХ (лето)'
      : 'Изменение показателя нормы по содержанию ОДХ (лето)'
  );

  return (
    <Modal id="modal-odh_norm_data_summer" show onHide={props.hideWithoutChanges} backdrop="static" bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
            <ExtField
              type="string"
              label="Технологическая операция"
              error={errors.technical_operation_id}
              disabled={!isPermitted}
              value={state.technical_operation_name}
              boundKeys="technical_operation_name"
            />
            <ExtField
              type="select"
              label="Норматив по содержанию ОДХ"
              error={errors.standard_name}
              disabled={!isPermitted}
              value={state.standard_name}
              boundKeys="standard_name"
            />
            <ExtField
              type="string"
              label="Единица измерения"
              value={state.unit}
              error={errors.unit}
              onChange={props.handleChange}
              disabled={!isPermitted}
              boundKeys="unit"
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <label>Категории:</label>
            <Row>
              <Col md={2}>
                <ExtField
                  type="string"
                  label="1"
                  value={state.categorized_1}
                  error={errors.categorized_1}
                  onChange={props.handleChange}
                  disabled={!isPermitted}
                  boundKeys="categorized_1"
                />
              </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="2"
                value={state.categorized_2}
                error={errors.categorized_2}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_2"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="3"
                value={state.categorized_3}
                error={errors.categorized_3}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_3"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="4"
                value={state.categorized_4}
                error={errors.categorized_4}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_4"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="5"
                value={state.categorized_5}
                error={errors.categorized_5}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_5"
              />
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Row>
            <Col md={2}>
              <ExtField
                type="string"
                label="6а"
                value={state.categorized_6a}
                error={errors.categorized_6a}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_6a"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="6б"
                value={state.categorized_6b}
                error={errors.categorized_6b}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_6b"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="6в"
                value={state.categorized_6c}
                error={errors.categorized_6c}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_6c"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="7а"
                value={state.categorized_7a}
                error={errors.categorized_7a}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_7a"
              />
            </Col>
            <Col md={2}>
              <ExtField
                type="string"
                label="7б"
                value={state.categorized_7b}
                error={errors.categorized_7b}
                onChange={props.handleChange}
                disabled={!isPermitted}
                boundKeys="categorized_7b"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <ExtField
            type="string"
            label='Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")'
            value={state.uncategorized_highway}
            error={errors.uncategorized_highway}
            onChange={props.handleChange}
            disabled={!isPermitted}
            boundKeys="uncategorized_highway"
          />
        </Col>
        <Col md={4}>
          <ExtField
            type="string"
            label="ОДХ внутри Садового кольца"
            value={state.uncategorized_odhs_center}
            error={errors.uncategorized_odhs_center}
            onChange={props.handleChange}
            disabled={!isPermitted}
            boundKeys="uncategorized_odhs_center"
          />
        </Col>
        <Col md={4}>
          <ExtField
            type="string"
            label="ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы"
            value={state.uncategorized_odhs_other}
            error={errors.uncategorized_odhs_other}
            onChange={props.handleChange}
            disabled={!isPermitted}
            boundKeys="uncategorized_odhs_other"
          />
        </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        <div>
          {
            isPermitted // либо обновление, либо создание
            ? (
              <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
            )
            : (
              <DivNone />
            )
          }
          <Button onClick={props.hideWithoutChanges}>Отменить</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default compose<PropsOdhNormDataSummer, OwnOdhNormDataSummerProps>(
  connect<StatePropsOdhNormDataSummer, DispatchPropsOdhNormDataSummer, OwnOdhNormDataSummerProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadMeasureUnit: (...arg) => (
        dispatch(
          actionLoadMeasureUnit(...arg),
        )
      ),
    }),
  ),
  withForm<PropsOdhNormDataSummerWithForm, OdhNormDataSummer>({
    uniqField: 'id',
    createAction: actionCreateOdhNormDataSummer,
    updateAction: actionUpdateOdhNormDataSummer,
    mergeElement: (props) => {
      return getDefaultOdhNormDataSummerElement(props.element);
    },
    schema: odhNormDataSummerFormSchema,
    permissions: odhNormDataSummerPermissions,
  }),
)(OdhNormDataSummerForm);
