import * as React from 'react';
import { connect } from 'react-redux';
import { isArray, isFunction } from 'util';
import { compose, withProps } from 'recompose';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import FieldIsMain from 'components/new/pages/routes_list/form/inside_fields/is-main/FieldIsMain';
import FieldName from 'components/new/pages/routes_list/form/inside_fields/name/FieldName';
import FieldTechnicalOperation from 'components/new/pages/routes_list/form/inside_fields/technical-operation/FieldTechnicalOperation';
import FieldMunicipalFacility from 'components/new/pages/routes_list/form/inside_fields/municipal-facility/FieldMunicipalFacility';
import FieldStructure from 'components/new/pages/routes_list/form/inside_fields/structure/FieldStructure';
import FieldType from 'components/new/pages/routes_list/form/inside_fields/type/FieldType';
import CreatingMap from 'components/new/pages/routes_list/form/inside_fields/creating-map/CreatingMap';

import { FlewWrapFormRow } from 'components/old/ui/form/new/styled/styled';
import { routeFormSchema } from 'components/new/pages/routes_list/form/route-form-schema';
import {
  FormStateRouteForm,
  PropsRouteWithForm,
  DispatchRouteFormProps,
  StateRouteFormProps,
  OwnRouteFormProps,
  PropsRouteForm,
  StateRouteForm,
  InputRouteFormProps,
} from 'components/new/pages/routes_list/form/RouteForm.h';
import { ReduxState } from 'redux-main/@types/state';

import { DivNone } from 'global-styled/global-styled';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import routePermisions from 'components/new/pages/routes_list/config-data/permissions';
import bridgesPermission from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/permissions';
import { resetCachedDataForRoute } from 'components/new/pages/routes_list/form/inside_fields/creating-map/utils';
import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { polyState } from 'constants/polygons';
import {
  getSessionState,
  getSomeUniqState,
} from 'redux-main/reducers/selectors';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import { getDefaultRouteElement } from './utils';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

const path = 'routeForm';

class RouteForm extends React.PureComponent<PropsRouteForm, StateRouteForm> {
  state = {
    bridges: {},
  };

  async componentDidMount() {
    if (this.props.isPermittedToShowBridge) {
      const { serverName } = GEOOBJECTS_OBJ.bridges;
      const {
        payload: { [serverName]: data },
      } = await this.props.loadGeozones(serverName);

      this.setState({
        bridges: Object.entries(data).reduce(
          (newBridges: any, [key, value]) => ({
            ...newBridges,
            [key]: {
              ...value,
              state: polyState.ENABLE,
            },
          }),
          {},
        ),
      });
    }
  }
  handleHide = () => {
    this.props.handleHide(false);
    resetCachedDataForRoute();
  };

  checkRoute = async () => {
    const { formState } = this.props;

    if (!formState.input_lines.length) {
      this.props.handleChange({
        draw_object_list: [],
      });
    } else {
      const route_validate = await this.props.actionValidateRoute(formState, {
        page: this.props.page,
        path,
      });

      this.props.handleChange({
        draw_object_list: route_validate.odh_validate_result
          .filter((res) => res.status !== 'fail')
          .map((o) => ({
            name: o.odh_name,
            object_id: o.odh_id,
            state: o.state || 2,
            type: 'odh',
          })),
      });
    }
  };

  handleSaveAsTemplate = async () => {
    const result = await this.props.submitAction(this.props.formState, true);

    if (result) {
      resetCachedDataForRoute();
      if (result) {
        if (isFunction(this.props.handleHide)) {
          this.props.handleHide(true, result);
        }
      }
    }
  };
  handleSubmitForMission = async () => {
    const result = await this.props.submitAction(this.props.formState, false);

    if (result) {
      resetCachedDataForRoute();
      if (result) {
        if (isFunction(this.props.handleHide)) {
          this.props.handleHide(true, result);
        }
      }
    }
  };

  render() {
    const {
      formErrors,
      formState,
      formState: { technical_operation_id, municipal_facility_id, type },
      canSave,
      page,
      fromMission,
      hasMissionStructureId,
    } = this.props;

    const IS_CREATING = !formState.id;

    const title = !IS_CREATING
      ? 'Изменение маршрута'
      : 'Создание нового маршрута';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-route"
        show

        onHide={this.props.hideWithoutChanges}
        bsSize="large"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FlewWrapFormRow isWrap>
            <FieldIsMain
              value={formState.is_main}
              onChange={this.props.handleChange}
              disabled={!isPermitted}
            />
          </FlewWrapFormRow>
          <FlewWrapFormRow isWrap>
            <FieldName
              value={formState.name}
              error={formErrors.name}
              onChange={this.props.handleChange}
            />
            <FieldTechnicalOperation
              value={technical_operation_id}
              name={formState.technical_operation_name}
              disabled={!isPermitted || fromMission}
              error={formErrors.technical_operation_id}
              onChange={this.props.handleChange}
              page={page}
              path={path}
            />
            <FieldMunicipalFacility
              error={formErrors.municipal_facility_id}
              value={municipal_facility_id}
              name={formState.municipal_facility_name}
              normatives={formState.normatives}
              disabled={!isPermitted || fromMission || !technical_operation_id}
              onChange={this.props.handleChange}
              clearable={false}
              missionAvailableRouteTypes={this.props.missionAvailableRouteTypes}
              page={page}
              path={path}
            />
            <FieldStructure
              value={formState.structure_id}
              name={formState.structure_name}
              disabled={
                !isPermitted
                || (hasMissionStructureId && !!formState.structure_id)
              }
              error={formErrors.structure_id}
              onChange={this.props.handleChange}
              page={page}
              path={path}
            />
            <FieldType
              value={type}
              disabled={!isPermitted || !municipal_facility_id}
              error={formErrors.type}
              onChange={this.props.handleChange}
              available_route_types={formState.available_route_types}
              fromMission={fromMission}
              page={page}
              path={path}
            />
          </FlewWrapFormRow>
          <FlewWrapFormRow isWrap>
            <CreatingMap
              input_lines={formState.input_lines}
              object_list={formState.object_list}
              error={formErrors.object_list || formErrors.draw_object_list || formErrors.input_lines}
              draw_object_list={formState.draw_object_list}
              type={type}
              municipal_facility_id={municipal_facility_id}
              technical_operation_id={technical_operation_id}
              structure_id={formState.structure_id}
              onChange={this.props.handleChange}
              checkRoute={this.checkRoute}
              bridges={this.state.bridges}
              isPermitted={isPermitted}
              page={page}
              path={path}
            />
          </FlewWrapFormRow>
        </ModalBodyPreloader>

        <EtsBootstrap.ModalFooter>
          {
            isPermitted
              ? (
                <>
                  <EtsBootstrap.Button
                    id="route-submit-tempalte"
                    disabled={!canSave}
                    onClick={this.handleSaveAsTemplate}>
                    {this.props.fromMission && !this.props.fromMissionTemplate
                      ? 'Сохранить как шаблон'
                      : 'Сохранить'}
                  </EtsBootstrap.Button>
                  {this.props.fromMission && !this.props.fromMissionTemplate ? (
                    <EtsBootstrap.Button
                      id="route-submit"
                      disabled={!canSave}
                      onClick={this.handleSubmitForMission}>
                      Создать
                    </EtsBootstrap.Button>
                  ) : (
                    <DivNone />
                  )}
                </>
              ) : (
                <DivNone />
              )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsRouteForm, InputRouteFormProps>(
  connect<
    StateRouteFormProps,
    DispatchRouteFormProps,
    OwnRouteFormProps,
    ReduxState
  >(
    (state) => ({
      userData: getSessionState(state).userData,
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      geozoneMunicipalFacility: getSomeUniqState(state)
        .geozoneMunicipalFacility,
    }),
    (dispatch: any, { page }) => ({
      actionValidateRoute: (...arg) =>
        dispatch(routesActions.actionValidateRoute(...arg)),
      loadGeozones: (serverName) =>
        dispatch(
          loadGeozones('none', serverName, {
            promise: true,
            page,
            path,
          }),
        ),
    }),
  ),
  withProps<StateRouteFormProps & { isPermittedToShowBridge: boolean; }, any>(
    (props) => ({
      ...props,
      isPermittedToShowBridge: validatePermissions(bridgesPermission.list, props.userData.permissionsSet),
    }),
  ),
  withForm<PropsRouteWithForm, FormStateRouteForm>({
    uniqField: 'id',
    createAction: routesActions.actionCreateRoute,
    updateAction: routesActions.actionUpdateRoute,
    mergeElement: (props) => {
      const { element } = props;

      return {
        ...getDefaultRouteElement(props.element),
        structure_id: element.structure_id || props.userStructureId,
        structure_name:
          element.structure_name || element.structure_id
            ? null
            : props.userStructureName,
        draw_object_list: isArray(props.element.draw_object_list)
          ? props.element.draw_object_list
          : [],
        normatives: [],
        available_route_types: [],
      };
    },
    schema: routeFormSchema,
    permissions: routePermisions,
  }),
)(RouteForm);
