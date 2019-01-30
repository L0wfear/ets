import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import techInspectionPermissions from 'components/directories/autobase/tech_inspection/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { techInspectionFormSchema } from 'components/directories/autobase/tech_inspection/TechInspectionForm/tech_inspection_shema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { getDefaultTechInspectionElement } from 'components/directories/autobase/tech_inspection/TechInspectionForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTechInspectionProps,
  PropsTechInspection,
  StateTechInspection,
  StatePropsTechInspection,
  DispatchPropsTechInspection,
  PropsTechInspectionWithForm,
} from 'components/directories/autobase/tech_inspection/TechInspectionForm/@types/TechInspectionForm.h';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { isNullOrUndefined } from 'util';
import { getSessionState } from 'redux-main/reducers/selectors';

class TechInspectionForm extends React.PureComponent<PropsTechInspection, StateTechInspection> {
  state = {
    carListOptions: [],
  };

  componentDidMount() {
    const IS_CREATING = !this.props.formState.id;

    if (IS_CREATING && !this.props.car_id) {
      this.loadCars();
    }
  }
  async loadCars() {
    const { payload: { data } } = await this.props.autobaseGetSetCar();

    this.setState({
      carListOptions: data.map(({ asuods_id, gov_number, ...other }) => ({
        value: asuods_id,
        label: gov_number,
        rowData: {
          asuods_id,
          gov_number,
          ...other,
        },
      })),
    });
  }
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleChangeIsActiveToTrue = () => {
    if (!this.props.formState.is_allowed) {
      this.props.handleChange({
        is_allowed: true,
      });
    }
  }
  handleChangeIsActiveToFalse = () => {
    if (this.props.formState.is_allowed) {
      this.props.handleChange({
        is_allowed: false,
      });
    }
  }
  handleChangeBoolean = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'checked']),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }
  render() {
    const {
      formState: state,
      formErrors: errors,
      car_id,
      page,
      path,
    } = this.props;
    const {
      carListOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const ownIsPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const isPermitted = (
      ownIsPermitted
      && (
        isNullOrUndefined(state.company_id)
        || state.company_id === this.props.userCompanyId
      )
    );

    return (
      <Modal id="modal-tech-inspection" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              {IS_CREATING && !car_id &&
                <ExtField
                  id="car_id"
                  type="select"
                  label="Номер транспортного средства"
                  value={state.car_id}
                  error={errors.car_id}
                  options={carListOptions}
                  emptyValue={null}
                  onChange={this.handleChange}
                  boundKeys="car_id"
                  clearable={false}
                  disabled={!isPermitted}
                  modalKey={path}
                />
              }
              <ExtField
                id="reg_number"
                type="string"
                label="Номер диагностической карты/Талона ГТО"
                value={state.reg_number}
                error={errors.reg_number}
                onChange={this.handleChange}
                boundKeys="reg_number"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="date_end"
                type="date"
                label="Срок действия до"
                date={state.date_end}
                time={false}
                error={errors.date_end}
                onChange={this.handleChange}
                boundKeys="date_end"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="tech_operator"
                type="string"
                label="Место выдачи"
                value={state.tech_operator}
                error={errors.tech_operator}
                onChange={this.handleChange}
                boundKeys="tech_operator"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="date_start"
                type="date"
                label="Дата прохождения"
                date={state.date_start}
                time={false}
                error={errors.date_start}
                onChange={this.handleChange}
                boundKeys="date_start"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="true_is_allowed"
                type="boolean"
                label="Заключение о возможности эксплуатации ТС"
                value={state.is_allowed}
                error={errors.is_allowed}
                emptyValue={null}
                onChange={this.handleChangeIsActiveToTrue}
                boundKeys="is_allowed"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="false_is_allowed"
                type="boolean"
                label="Заключение о невозможности эксплуатации ТС"
                value={!state.is_allowed}
                error={errors.is_allowed}
                emptyValue={null}
                onChange={this.handleChangeIsActiveToFalse}
                boundKeys="is_allowed"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="note"
                type="string"
                label="Примечание"
                value={state.note}
                error={errors.note}
                onChange={this.handleChange}
                boundKeys="note"
                disabled={!isPermitted}
                modalKey={path}
              />
              <FileField
                id="file"
                label="Файл"
                multiple
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys="files"
                disabled={!isPermitted}
                modalKey={path}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsTechInspection, OwnTechInspectionProps>(
  connect<StatePropsTechInspection, DispatchPropsTechInspection, OwnTechInspectionProps, ReduxState>(
    (state) => ({
      userCompanyId: getSessionState(state).userData.company_id,
    }),
    (dispatch, { page, path }) => ({
      autobaseGetSetCar: () => (
        dispatch(
          autobaseActions.autobaseGetSetCar(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsTechInspectionWithForm, TechInspection>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateTechInspection,
    updateAction: autobaseActions.autobaseUpdateTechInspection,
    mergeElement: (props) => {
      return getDefaultTechInspectionElement(props.element);
    },
    schema: techInspectionFormSchema,
    permissions: techInspectionPermissions,
  }),
)(TechInspectionForm);
