import * as React from 'react';
import memoize from 'memoize-one';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

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
} from 'components/new/pages/nsi/autobase/pages/tire/form/@types/TireForm';
import { Tire, TireSize, TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import TireToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/tire/form/vehicle-block/TireToVehicleBlock';
import { onChangeWithKeys } from 'components/compositions/hoc';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { InlineSpanValue } from './styled';
import { getDefaultTireElement } from './utils';
import { tireFormSchema } from './schema';
import tirePermissions from '../_config-data/permissions';

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
      <EtsBootstrap.ModalContainer id="modal-tire" show onHide={this.props.hideWithoutChanges} bsSize="large" backdrop="static">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
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
                onChange={this.props.handleChange}
                boundKeys="tire_size_id"
                clearable={false}
              />
              {
                !IS_CREATING
                  ? (
                    <>
                      <EtsBootstrap.Col sm={6} md={6}>
                        <label htmlFor=" ">Пробег, км:</label>
                        <InlineSpanValue>{state.odometr_diff}</InlineSpanValue>
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col sm={6} md={6}>
                        <label htmlFor=" ">Наработка, мч:</label>
                        <InlineSpanValue>{state.motohours_diff}</InlineSpanValue>
                      </EtsBootstrap.Col>
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
                onChange={this.props.handleChange}
                boundKeys="comment"
              />
              {
                !IS_CREATING
                  ? (
                    <>
                      <h4>Транспортное средство, на котором установлена шина</h4>
                      <TireToVehicleBlock
                        onChange={this.props.handleChange}
                        boundKeys="tire_to_car"
                        inputList={state.tire_to_car}
                        onValidation={this.handleTireToCarValidity}
                        outerValidate
                        errors={errors.tire_to_car}
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
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted // либо обновление, либо создание
            ? (
              <EtsBootstrap.Button disabled={!canSave} onClick={this.props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
            )
            : (
              <DivNone />
            )
          }
          <EtsBootstrap.Button onClick={this.props.hideWithoutChanges}>Отмена</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
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
    createAction: autobaseActions.autobaseCreateTire,
    updateAction: autobaseActions.autobaseUpdateTire,
    mergeElement: (props) => {
      return getDefaultTireElement(props.element);
    },
    schema: tireFormSchema,
    permissions: tirePermissions,
  }),
)(TireForm);
