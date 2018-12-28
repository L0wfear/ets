import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import tireModelPermissions from 'components/directories/autobase/tire_model/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { tireModelFormSchema } from 'components/directories/autobase/tire_model/TireModelForm/tire_model_form_schema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultTireModelElement } from 'components/directories/autobase/tire_model/TireModelForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTireModelProps,
  PropsTireModel,
  StateTireModel,
  StatePropsTireModel,
  DispatchPropsTireModel,
  PropsTireModelWithForm,
} from 'components/directories/autobase/tire_model/TireModelForm/@types/TireModelForm.h';
import { TireModel, TireManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { getAutobaseState } from 'redux-main/reducers/selectors';

class TireModelForm extends React.PureComponent<PropsTireModel, StateTireModel> {
  componentDidMount() {
    this.props.tireManufacturerGetAndSetInStore();
  }

  handleChange = (name: keyof TireModel, value: any) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }

  makeOptionFromTireManufacturerList = (
    memoize(
      (tireManufacturerList: TireManufacturer[]) => tireManufacturerList.map(defaultSelectListMapper),
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      tireManufacturerList,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const tireManufacturerOptions = this.makeOptionFromTireManufacturerList(tireManufacturerList);

    return (
      <Modal id="modal-tire-model" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={6}>
              <ExtField
                id="name"
                type="string"
                label="Марка шины"
                value={state.name}
                error={errors.name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="name"
                modalKey={path}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="tire_manufacturer_id"
                type="select"
                label="Производитель шины"
                options={tireManufacturerOptions}
                value={state.tire_manufacturer_id}
                error={errors.tire_manufacturer_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="tire_manufacturer_id"
                clearable={false}
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

export default compose<PropsTireModel, OwnTireModelProps>(
  connect<StatePropsTireModel, DispatchPropsTireModel, OwnTireModelProps, ReduxState>(
    (state) => ({
      tireManufacturerList: getAutobaseState(state).tireManufacturerList,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseActions.autobaseCreateTireModel(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          autobaseActions.autobaseUpdateTireModel(
            formState,
            { page, path },
          ),
        )
      ),
      tireManufacturerGetAndSetInStore: () => (
        dispatch(
          autobaseActions.tireManufacturerGetAndSetInStore(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsTireModelWithForm, TireModel>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultTireModelElement(props.element);
    },
    schema: tireModelFormSchema,
    permissions: tireModelPermissions,
  }),
)(TireModelForm);
