import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
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
} from 'components/new/pages/nsi/autobase/pages/spare_part/form/@types/SparePartForm';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import sparePartPermissions from '../_config-data/permissions';
import { sparePartFormSchema } from './schema';
import { getDefaultSparePartElement } from './utils';

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
      <Modal id="modal-spare-part" show onHide={this.props.hideWithoutChanges} backdrop="static">
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
                onChange={this.props.handleChange}
                boundKeys="spare_part_group_id"
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Подгруппа"
                value={state.name}
                error={errors.name}
                onChange={this.props.handleChange}
                boundKeys="name"
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Номер поставки"
                value={state.number}
                error={errors.number}
                onChange={this.props.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
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
              <ExtField
                type="string"
                label="Количество"
                value={state.quantity}
                error={errors.quantity}
                onChange={this.props.handleChange}
                boundKeys="quantity"
                disabled={!isPermitted}
              />
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
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          <div>
            {
              isPermitted // либо обновление, либо создание
              ? (
                <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
              )
              : (
                <DivNone />
              )
            }
            <Button onClick={this.props.hideWithoutChanges}>Отменить</Button>
          </div>
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
