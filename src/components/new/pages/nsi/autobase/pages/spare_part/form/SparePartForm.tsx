import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnSparePartProps,
  PropsSparePart,
  StateSparePart,
  StatePropsSparePart,
  DispatchPropsSparePart,
  PropsSparePartWithForm,
} from 'components/new/pages/nsi/autobase/pages/spare_part/form/@types/SparePartForm';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import sparePartPermissions from '../_config-data/permissions';
import { sparePartFormSchema } from './schema';
import { getDefaultSparePartElement } from './utils';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import SpareToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/spare_part/form/vehicle-block/SpareToVehicleBlock';

const SpareToVehicleBlock: any = onChangeWithKeys(SpareToVehicleBlockComponent);

class SparePartForm extends React.PureComponent<PropsSparePart, StateSparePart> {
  state = {
    measureUnitOptions: [],
    sparePartGroupOptions: [],
    canSave: true,
  };

  componentDidMount() {
    this.loadMeasureUnit();
    this.loadSparePartGroup();
  }
  handleSpareToCarValidity = ({ isValidInput }) => {
    this.setState({
      canSave: isValidInput,
    });
  }
  async loadMeasureUnit() {
    const { payload: { data } } = await this.props.autobaseGetSetMeasureUnit();

    this.setState({ measureUnitOptions: data.map(defaultSelectListMapper) });
  }
  async loadSparePartGroup() {
    const { payload: { data } } = await this.props.autobaseGetSetSparePartGroup();

    this.setState({ sparePartGroupOptions: data.map(defaultSelectListMapper) });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;
    const {
      measureUnitOptions,
      sparePartGroupOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;
    const canSave = (
      this.state.canSave
      && this.props.canSave
    );

    return (
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={this.props.hideWithoutChanges} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="select"
                label="Группа"
                error={errors.spare_part_group_id}
                options={sparePartGroupOptions}
                value={state.spare_part_group_id}
                onChange={this.props.handleChange}
                boundKeys="spare_part_group_id"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Подгруппа"
                value={state.name}
                error={errors.name}
                onChange={this.props.handleChange}
                boundKeys="name"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Номер поставки"
                value={state.number}
                error={errors.number}
                onChange={this.props.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="select"
                label="Единица измерения"
                error={errors.measure_unit_id}
                options={measureUnitOptions}
                value={state.measure_unit_id}
                onChange={this.props.handleChange}
                boundKeys="measure_unit_id"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Количество"
                value={state.quantity}
                error={errors.quantity}
                onChange={this.props.handleChange}
                boundKeys="quantity"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
            <ExtField
              type="date"
              label="Дата поставки"
              date={state.supplied_at}
              time={false}
              error={errors.supplied_at}
              onChange={this.props.handleChange}
              boundKeys="supplied_at"
              disabled={!isPermitted}
            />
          </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <SpareToVehicleBlock
                onChange={this.props.handleChange}
                boundKeys="spare_part_to_car"
                inputList={state.spare_part_to_car}
                onValidation={this.handleSpareToCarValidity}
                outerValidate
                errors={errors.spare_part_to_car}
                disabled={!isPermitted}
                tireId={state.id}
                selectField="customId"
                isPermitted={isPermitted}
                tableTitle="Транспортные средства, на которые устанавливали запчасть"
              />
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
          <EtsBootstrap.Button onClick={this.props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsSparePart, OwnSparePartProps>(
  connect<StatePropsSparePart, DispatchPropsSparePart, OwnSparePartProps, ReduxState>(
    null,
    (dispatch, { page, path }) => ({
      autobaseGetSetMeasureUnit: () => (
        dispatch(
          autobaseActions.autobaseGetMeasureUnit(
            {},
            { page, path },
          ),
        )
      ),
      autobaseGetSetSparePartGroup: () => (
        dispatch(
          autobaseActions.autobaseGetSparePartGroup(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsSparePartWithForm, SparePart>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateSparePart,
    updateAction: autobaseActions.autobaseUpdateSparePart,
    mergeElement: (props) => {
      return getDefaultSparePartElement(props.element);
    },
    schema: sparePartFormSchema,
    permissions: sparePartPermissions,
  }),
)(SparePartForm);
