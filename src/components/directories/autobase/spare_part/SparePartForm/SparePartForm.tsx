import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import sparePartPermissions from 'components/directories/autobase/spare_part/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { sparePartFormSchema } from 'components/directories/autobase/spare_part/SparePartForm/spare-part-from-schema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultSparePartElement } from 'components/directories/autobase/spare_part/SparePartForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnSparePartProps,
  PropsSparePart,
  StateSparePart,
  StatePropsSparePart,
  DispatchPropsSparePart,
  PropsSparePartWithForm,
} from 'components/directories/autobase/spare_part/SparePartForm/@types/SparePart.h';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';

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
    const { payload: { data } } = await this.props.autobaseGetSetMeasureUnit();

    this.setState({ measureUnitOptions: data.map(defaultSelectListMapper) });
  }
  async loadSparePartGroup() {
    const { payload: { data } } = await this.props.autobaseGetSetSparePartGroup();

    this.setState({ sparePartGroupOptions: data.map(defaultSelectListMapper) });
  }
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
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

    return (
      <Modal id="modal-spare-part" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Группа"
                error={errors.spare_part_group_id}
                options={sparePartGroupOptions}
                value={state.spare_part_group_id}
                onChange={this.handleChange}
                boundKeys="spare_part_group_id"
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Подгруппа"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys="name"
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Номер поставки"
                value={state.number}
                error={errors.number}
                onChange={this.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Единица измерения"
                error={errors.measure_unit_id}
                options={measureUnitOptions}
                value={state.measure_unit_id}
                onChange={this.handleChange}
                boundKeys="measure_unit_id"
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Количество"
                value={state.quantity}
                error={errors.quantity}
                onChange={this.handleChange}
                boundKeys="quantity"
                disabled={!isPermitted}
              />
              <ExtField
                type="date"
                label="Дата поставки"
                date={state.supplied_at}
                time={false}
                error={errors.supplied_at}
                onChange={this.handleChange}
                boundKeys="supplied_at"
                disabled={!isPermitted}
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
        <Button onClick={this.handleHide}>Отменить</Button>
        </Modal.Footer>
      </Modal>
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
