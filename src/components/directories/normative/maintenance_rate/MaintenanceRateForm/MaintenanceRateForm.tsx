import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { ExtField } from 'components/ui/new/field/ExtField';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  maintenanceRateCreate,
  maintenanceRateUpdate,
} from 'redux-main/reducers/modules/maintenance_rate/actions-maintenanceRate';

import {
  MAINTENANCE_RATE_SET_DATA
} from 'redux-main/reducers/modules/maintenance_rate/maintenanceRate';
import {
  OwnMaintenanceRateProps,
  PropsMaintenanceRate,
  StateMaintenanceRate,
  StatePropsMaintenanceRate,
  DispatchPropsMaintenanceRate,
  PropsMaintenanceRateWithForm,
} from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/@types/MaintenanceRate.h';

import { getDefaultMaintenanceRateElement } from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/utils';
import { maintenanceRateSchema } from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/maintenanceRateSchema';
import { IMaintenanceRateUpd } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import MaintenanceRatePermissions from 'components/directories/normative/maintenance_rate/config-data/permissions';
import { connectToStores } from 'utils/decorators';

@connectToStores(['objects'])
class MaintenanceRateForm extends React.PureComponent<PropsMaintenanceRate, StateMaintenanceRate> {

  handleHide = () => {
    this.props.handleHide(false);
  }

  handleChangeBoolean = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'checked']),
    });
  }

  handleChangeCategory = (value) => {
    this.props.handleChange({
      clean_subcategory_id: null,
      clean_category_id: value,
    });
    // this.props.handleChange('clean_subcategory_id', null);
    // this.props.handleChange('clean_category_id', value);
  }

  render() {
    const {
      page,
      path,
      formState: state,
      formErrors: errors,

      type,
      technicalOperationsList = [],
      maintenanceWorkList = [],
      cleanCategoriesList = [],
    } = this.props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const { subcategories = [] } = (cleanCategoriesList.find((c) => state.clean_category_id === c.id) || {}); // subcategories через Lodash get, по деф пустой массив

    const TECH_OPERATIONS = technicalOperationsList.map(defaultSelectListMapper);
    const MAINTENANCE_WORK = maintenanceWorkList.map(defaultSelectListMapper);
    const CATEGORIES = cleanCategoriesList.map(defaultSelectListMapper);
    const SUBCATEGORIES = subcategories.map(defaultSelectListMapper);

    return (
      <Modal id="modal-maintenance-rate" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Добавление' : 'Изменение'} нормы на содержание {type === 'odh' ? 'ОДХ' : 'ДТ'}</Modal.Title>
        </Modal.Header>

        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Технологическая операция"
                error={errors.technical_operation_id}
                options={TECH_OPERATIONS}
                value={state.technical_operation_id}
                onChange={this.props.handleChange}
                boundKeys="technical_operation_id"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Наименование регламентной работы"
                error={errors.maintenance_work_id}
                options={MAINTENANCE_WORK}
                value={state.maintenance_work_id}
                onChange={this.props.handleChange}
                boundKeys="maintenance_work_id"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <ExtField
                type="select"
                label="Сезон"
                error={errors.season_id}
                options={[{ value: 2, label: 'Зима' }, { value: 1, label: 'Лето' }]} // in const
                value={state.season_id}
                onChange={this.props.handleChange}
                boundKeys="season_id"
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="select"
                label="Категория"
                error={errors.clean_category_id}
                options={CATEGORIES}
                value={state.clean_category_id}
                onChange={this.handleChangeCategory}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="select"
                label="Подкатегория"
                error={errors.clean_subcategory_id}
                options={SUBCATEGORIES}
                value={state.clean_subcategory_id}
                onChange={this.props.handleChange}
                boundKeys="clean_subcategory_id"
                disabled={!isPermitted || SUBCATEGORIES.length === 0}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="string"
                label="Норма"
                error={errors.value}
                value={state.value}
                onChange={this.props.handleChange}
                boundKeys="value"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.props.defaultSubmit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsMaintenanceRate, OwnMaintenanceRateProps>(
  connect<StatePropsMaintenanceRate, DispatchPropsMaintenanceRate, OwnMaintenanceRateProps, ReduxState>(
    null,
    (dispatch, { page, path, type }) => ({
      createAction: (formState) => (
        dispatch(
          maintenanceRateCreate(
            MAINTENANCE_RATE_SET_DATA,
            type,
            { ...formState, page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          maintenanceRateUpdate(
            MAINTENANCE_RATE_SET_DATA,
            type,
            { ...formState, page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsMaintenanceRateWithForm, IMaintenanceRateUpd>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultMaintenanceRateElement(props.element);
    },
    schema: maintenanceRateSchema,
    permissions: MaintenanceRatePermissions,
  }),
)(MaintenanceRateForm);
