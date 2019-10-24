import * as React from 'react';
import memoize from 'memoize-one';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTireProps,
  PropsTire,
  StatePropsTire,
  PropsTireWithForm,
} from 'components/new/pages/nsi/autobase/pages/tire/form/@types/TireForm';
import { Tire, TireSize, TireModel, TireOnCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import TireToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/tire/form/vehicle-block/TireToVehicleBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { InlineSpanValue, DiffValueWrapper, DiffValueElem } from './styled';
import { getDefaultTireElement } from './utils';
import { tireFormSchema } from './schema';
import tirePermissions from '../_config-data/permissions';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { uniqKeyForParams } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/_config-data/registry-config';
import { tireSizeGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_size/actions';
import { tireModelGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/actions';
import { autobaseCreateTire, autobaseUpdateTire } from 'redux-main/reducers/modules/autobase/actions_by_type/tire/actions';
import { metresToKilometeres } from 'utils/functions';

const TireToVehicleBlock: any = onChangeWithKeys(TireToVehicleBlockComponent);

const defaultTireOnCarItem: TireOnCar = {
  car_id: null,
  gov_number: null,
  id: null,
  installed_at: null,
  motohours_diff: null,
  odometr_diff: null,
  uninstalled_at: null,
  sum_track_length: null,
  // для таблички
  customId: null,
  isChecked: false,
  isHighlighted: false,
  isSelected: false,
};
class TireForm extends React.PureComponent<PropsTire, {}> {
  componentDidMount() {
    this.props.dispatch(
      tireModelGetAndSetInStore(
        {},
        this.props,
      ),
    );
    this.props.dispatch(
      tireSizeGetAndSetInStore(
        {},
        this.props,
      ),
    );
    this.addNewTireOnCar();
  }

  addNewTireOnCar = () => {
    const newCarId = getNumberValueFromSerch(this.props.match.params[config.list.data.uniqKeyForParams]);
    const actualBatteriesOnCarId = this.props.match.params[uniqKeyForParams];
    if ( newCarId && actualBatteriesOnCarId === 'create') {
      const customId = this.props.formState.tire_to_car.length + 1;
      this.props.handleChange(
        'tire_to_car',
        [
          {
            ...defaultTireOnCarItem,
            car_id: newCarId,
            customId,
          },
          ...this.props.formState.tire_to_car,
        ],
      );
    }
  };

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
      canSave,
    } = this.props;

    const IS_CREATING = !state.id;

    const isGivenAway = state.status === 'given_away' ? false : true;
    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';

    const isPermitterToUpdateInitialMileage = !IS_CREATING
    ? (this.props.isPermitterToUpdateInitialMileage && isGivenAway)
    : this.props.isPermitterToUpdateInitialMileage;

    const isPermitted = !IS_CREATING
      ? (this.props.isPermittedToUpdate && isGivenAway)
      : this.props.isPermittedToCreate;

    const tireSizeOptions = this.makeOptionFromTireSizeList(
      tireSizeList,
    );
    const tireModelOptions = this.makeOptionFromTireModelList(
      tireModelList,
    );

    const sumTrackLength = metresToKilometeres(state.sum_track_length);

    return (
      <EtsBootstrap.ModalContainer id="modal-tire" show onHide={this.props.hideWithoutChanges} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
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
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type={'string'}
                label={'Производитель'}
                value={state.tire_manufacturer_name}
                disabled
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
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
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Первоначальный пробег, км"
                value={state.initial_mileage}
                error={errors.initial_mileage}
                disabled={IS_CREATING ? !isPermitted : !isPermitterToUpdateInitialMileage}
                onChange={this.props.handleChange}
                boundKeys="initial_mileage"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="comment"
              />
            </EtsBootstrap.Col>
            {
              !IS_CREATING
                && (
                  <React.Fragment>
                    <EtsBootstrap.Col sm={6} md={4}>
                      <DiffValueWrapper>
                        <DiffValueElem>
                          <label htmlFor=" ">Общий пробег, км:</label>
                          <InlineSpanValue>{state.odometr_diff}</InlineSpanValue>
                        </DiffValueElem>
                        <DiffValueElem>
                          <label htmlFor=" ">Наработка, мч:</label>
                          <InlineSpanValue>{state.motohours_diff}</InlineSpanValue>
                        </DiffValueElem>
                        <DiffValueElem>
                          <label htmlFor=" ">Общий пробег по ГЛОНАСС, км:</label>
                          <InlineSpanValue>{sumTrackLength}</InlineSpanValue>
                        </DiffValueElem>
                      </DiffValueWrapper>
                    </EtsBootstrap.Col>
                  </React.Fragment>
                )
              }
            <EtsBootstrap.Col md={12}>
              <TireToVehicleBlock
                onChange={this.props.handleChange}
                boundKeys="tire_to_car"
                inputList={state.tire_to_car}
                outerValidate
                errors={errors.tire_to_car}
                disabled={!isPermitted}
                tireId={state.id}
                selectField="customId"
                isPermitted={isPermitted}
                tableTitle="Транспортное средство, на котором установлена шина"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted || isPermitterToUpdateInitialMileage // либо обновление, либо создание
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
  connect<StatePropsTire, {}, OwnTireProps, ReduxState>(
    (state) => ({
      tireModelList: getAutobaseState(state).tireModelList,
      tireSizeList: getAutobaseState(state).tireSizeList,
      isPermitterToUpdateInitialMileage: getSessionState(state).userData.permissionsSet.has(tirePermissions.update_mileage),
    }),
  ),
  withSearch,
  withForm<PropsTireWithForm, Tire>({
    uniqField: 'id',
    createAction: autobaseCreateTire,
    updateAction: autobaseUpdateTire,
    mergeElement: (props) => {
      return getDefaultTireElement(props.element);
    },
    schema: tireFormSchema,
    permissions: tirePermissions,
  }),
)(TireForm);
