import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import roadAccidentPermissions from 'components/directories/autobase/road_accident/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { roadAccidentFormSchema } from 'components/directories/autobase/road_accident/RoadAccidentForm/roadAccident-schema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultRoadAccidentElement } from 'components/directories/autobase/road_accident/RoadAccidentForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnRoadAccidentProps,
  PropsRoadAccident,
  StateRoadAccident,
  StatePropsRoadAccident,
  DispatchPropsRoadAccident,
  PropsRoadAccidentWithForm,
} from 'components/directories/autobase/road_accident/RoadAccidentForm/@types/RoadAccident.h';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { isNullOrUndefined } from 'util';

class RoadAccidentForm extends React.PureComponent<PropsRoadAccident, StateRoadAccident> {
  state = {
    roadAccidentCauseOptions: [],
    driversOptions: [],
  };

  componentDidMount() {
    this.loadRoadAccidentCauseOptions();
    this.loadDriverOptions();
  }
  async loadRoadAccidentCauseOptions() {
    const { payload: { data } } = await this.props.autobaseGetAccidentCause();

    this.setState({ roadAccidentCauseOptions: data.map(defaultSelectListMapper) });
  }
  async loadDriverOptions() {
    const { payload: { data } } = await this.props.employeeDriverGetSetDriver();

    this.setState({
      driversOptions: data.map((driver) => ({
        value: driver.id,
        label: driver.fio_license,
        allData: driver,
      })),
    });
  }
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
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
      page,
      path,
    } = this.props;
    const {
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

      <Modal id="modal-insurance-policy" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
            <ExtField
                id="accident_date"
                type="date"
                label="Дата"
                date={state.accident_date}
                time={false}
                error={errors.accident_date}
                onChange={this.handleChange}
                boundKeys="accident_date"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="driver_id"
                type="select"
                label="Водитель"
                value={state.driver_id}
                error={errors.driver_id}
                options={this.state.driversOptions}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys="driver_id"
                clearable={false}
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="cause_id"
                type="select"
                label="Причина ДТП"
                value={state.cause_id}
                error={errors.cause_id}
                options={this.state.roadAccidentCauseOptions}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys="cause_id"
                clearable={false}
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="accident_place"
                type="string"
                label="Место ДТП"
                value={state.accident_place}
                error={errors.accident_place}
                onChange={this.handleChange}
                boundKeys="accident_place"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="is_guilty"
                type="boolean"
                label="Виновность"
                value={state.is_guilty}
                error={errors.is_guilty}
                onChange={this.handleChangeBoolean}
                boundKeys="is_guilty"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="damage_price"
                type="number"
                label="Стоимость ущерба, руб."
                value={state.damage_price}
                error={errors.damage_price}
                onChange={this.handleChange}
                boundKeys="damage_price"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="comment"
                type="string"
                label="Примечание"
                value={state.comment}
                error={errors.comment}
                onChange={this.handleChange}
                boundKeys="comment"
                disabled={!isPermitted}
                modalKey={page}
              />
              <FileField
                id="files"
                label="Файл"
                multiple
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys="files"
                disabled={!isPermitted}
                modalKey={page}
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

export default compose<PropsRoadAccident, OwnRoadAccidentProps>(
  connect<StatePropsRoadAccident, DispatchPropsRoadAccident, OwnRoadAccidentProps, ReduxState>(
    (state) => ({
      userCompanyId: state.session.userData.company_id,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseActions.autobaseCreateRoadAccident(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          autobaseActions.autobaseUpdateRoadAccident(
            formState,
            { page, path },
          ),
        )
      ),
      autobaseGetAccidentCause: () => (
        dispatch(
          autobaseActions.autobaseGetSetRoadAccidentCause(
            {},
            { page, path },
          ),
        )
      ),
      employeeDriverGetSetDriver: () => (
        dispatch(
          employeeActions.employeeDriverGetSetDriver(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsRoadAccidentWithForm, RoadAccident>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultRoadAccidentElement(props.element);
    },
    schema: roadAccidentFormSchema,
    permissions: roadAccidentPermissions,
  }),
)(RoadAccidentForm);
