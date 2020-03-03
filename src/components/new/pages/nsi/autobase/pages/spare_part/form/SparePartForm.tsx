import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsSparePart,
  StateSparePart,
  PropsSparePartWithForm,
} from 'components/new/pages/nsi/autobase/pages/spare_part/form/@types/SparePartForm';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import sparePartPermissions from '../_config-data/permissions';
import { sparePartFormSchema } from './schema';
import { getDefaultSparePartElement } from './utils';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import SpareToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/spare_part/form/vehicle-block/SpareToVehicleBlock';
import { autobaseGetMeasureUnit } from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/actions';
import { autobaseGetSparePartGroup } from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/actions';
import { autobaseCreateSparePart, autobaseUpdateSparePart } from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/actions';

const SpareToVehicleBlock: any = onChangeWithKeys(SpareToVehicleBlockComponent);

class SparePartForm extends React.PureComponent<PropsSparePart, StateSparePart> {
  state = {
    measureUnitOptions: [],
    sparePartGroupOptions: [],
  };

  componentDidMount() {
    this.loadMeasureUnit();
    this.loadSparePartGroup();
  }
  async loadMeasureUnit() {
    const { data } = await this.props.dispatch(
      autobaseGetMeasureUnit(
        {},
        this.props,
      ),
    );

    this.setState({ measureUnitOptions: data.map(defaultSelectListMapper) });
  }
  async loadSparePartGroup() {
    const { data } = await this.props.dispatch(
      autobaseGetSparePartGroup(
        {},
        this.props,
      ),
    );

    this.setState({ sparePartGroupOptions: data.map(defaultSelectListMapper) });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      canSave,
    } = this.props;
    const {
      measureUnitOptions,
      sparePartGroupOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

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

export default compose<PropsSparePart, PropsSparePartWithForm>(
  withForm<PropsSparePartWithForm, SparePart>({
    uniqField: 'id',
    createAction: autobaseCreateSparePart,
    updateAction: autobaseUpdateSparePart,
    mergeElement: (props) => {
      return getDefaultSparePartElement(props.element);
    },
    schema: sparePartFormSchema,
    permissions: sparePartPermissions,
  }),
)(SparePartForm);
