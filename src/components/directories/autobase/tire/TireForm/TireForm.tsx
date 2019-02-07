import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import tirePermissions from 'components/directories/autobase/tire/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { tireFormSchema } from 'components/directories/autobase/tire/TireForm/tire_from_schema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { getDefaultTireElement } from 'components/directories/autobase/tire/TireForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTireProps,
  PropsTire,
  StateTire,
  StatePropsTire,
  DispatchPropsTire,
  PropsTireWithForm,
} from 'components/directories/autobase/tire/TireForm/@types/Tire.h';
import { Tire, TireSize, TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import TireToVehicleBlockComponent from 'components/directories/autobase/tire/TireForm/vehicle-block/TireToVehicleBlock';
import { onChangeWithKeys } from 'components/compositions/hoc';
import { getAutobaseState } from 'redux-main/reducers/selectors/index';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { InlineSpanValue } from './styled';

const TireToVehicleBlock: any = onChangeWithKeys(TireToVehicleBlockComponent);

class TireForm extends React.PureComponent<PropsTire, StateTire> {
  state = {
    canSave: true,
  };
  componentDidMount() {
    this.props.tireModelGetAndSetInStore();
    this.props.tireSizeGetAndSetInStore();
  }
  handleTireToCarValidity = ({ isValidInput }) => {
    this.setState({
      canSave: isValidInput,
    });
  }
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleChangeTireModel = (name, value, allOptionData) => {
    const {
      formState: { tire_model_id },
    } = this.props;

    if (value !== tire_model_id) {
      if (value) {
        this.props.handleChange({
          tire_model_id: value,
          tire_model_name: allOptionData.label,
          tire_manufacturer_id: allOptionData.rowData.tire_manufacturer_id,
          tire_manufacturer_name: allOptionData.rowData.tire_manufacturer_name,
        });
      } else {
        this.props.handleChange({
          tire_model_id: null,
          tire_model_name: null,
          tire_manufacturer_id: null,
          tire_manufacturer_name: null,
        });
      }
    }
  }
  handleHide = () => {
    this.props.handleHide(false);
  }

  makeOptionFromTireSizeList = (
    memoize(
      (tireSizeList: TireSize[]) => tireSizeList.map(defaultSelectListMapper),
    )
  );
  makeOptionFromTireModelList = (
    memoize(
      (tireModelList: TireModel[]) => tireModelList.map(defaultSelectListMapper),
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      tireSizeList,
      tireModelList,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;
    const canSave = (
      this.state.canSave
      && this.props.canSave
    );

    const tireSizeOptions = this.makeOptionFromTireSizeList(
      tireSizeList,
    );
    const tireModelOptions = this.makeOptionFromTireModelList(
      tireModelList,
    );

    return (
      <Modal id="modal-tire" show onHide={this.handleHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Модель шины"
                options={tireModelOptions}
                value={state.tire_model_id}
                error={errors.tire_model_id}
                disabled={!isPermitted}
                onChange={this.handleChangeTireModel}
                boundKeys="tire_model_id"
                clearable={false}
              />
              <ExtField
                type={'string'}
                label={'Производитель'}
                value={state.tire_manufacturer_name}
                disabled
              />
              <ExtField
                type="select"
                label="Размер"
                options={tireSizeOptions}
                value={state.tire_size_id}
                error={errors.tire_size_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="tire_size_id"
                clearable={false}
              />
              {
                !IS_CREATING
                  ? (
                    <>
                      <Col sm={6} md={6}>
                        <label htmlFor=" ">Пробег, км:</label>
                        <InlineSpanValue>{state.odometr_diff}</InlineSpanValue>
                      </Col>
                      <Col sm={6} md={6}>
                        <label htmlFor=" ">Наработка, мч:</label>
                        <InlineSpanValue>{state.motohours_diff}</InlineSpanValue>
                      </Col>
                    </>
                  )
                  : (
                    <DivNone />
                  )
              }
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="comment"
              />
              {
                !IS_CREATING
                  ? (
                    <>
                      <h4>Транспортное средство, на котором установлена шина</h4>
                      <TireToVehicleBlock
                        onChange={this.handleChange}
                        boundKeys="tire_to_car"
                        inputList={state.tire_to_car}
                        onValidation={this.handleTireToCarValidity}
                        disabled={!isPermitted}
                        tireId={state.id}
                        selectField="customId"
                        isPermitted={isPermitted}
                      />
                    </>
                  )
                  : (
                    <DivNone />
                  )
              }
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button disabled={!canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
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

export default compose<PropsTire, OwnTireProps>(
  connect<StatePropsTire, DispatchPropsTire, OwnTireProps, ReduxState>(
    (state) => ({
      tireModelList: getAutobaseState(state).tireModelList,
      tireSizeList: getAutobaseState(state).tireSizeList,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseActions.autobaseCreateTire(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          autobaseActions.autobaseUpdateTire(
            formState,
            { page, path },
          ),
        )
      ),
      tireSizeGetAndSetInStore: () => (
        dispatch(
          autobaseActions.tireSizeGetAndSetInStore(
            {},
            { page, path },
          ),
        )
      ),
      tireModelGetAndSetInStore: () => (
        dispatch(
          autobaseActions.tireModelGetAndSetInStore(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsTireWithForm, Tire>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultTireElement(props.element);
    },
    schema: tireFormSchema,
    permissions: tirePermissions,
  }),
)(TireForm);
