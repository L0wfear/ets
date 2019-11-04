import * as React from 'react';
import memoize from 'memoize-one';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { DivNone } from 'global-styled/global-styled';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import {
  StatePropsFieldRouteIdMission,
  DispatchPropsFieldRouteIdMission,
  OwnPropsFieldRouteIdMission,
  PropsFieldRouteIdMission,
  StateFieldRouteIdMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/route_id/FieldRouteIdMission.h';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getSomeUniqState, getMissionsState } from 'redux-main/reducers/selectors/index';
import { getAvailableRouteTypes } from 'components/new/pages/missions/mission_template/form/template/utils';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getRoutesState } from 'redux-main/reducers/selectors/index';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { makeOptionFromRouteList } from 'components/new/pages/missions/mission/form/main/inside_fields/route_id/makeOptions';
import { routeTypesByKey } from 'constants/route';
import HiddenMapForPrint from './print/HiddenMapForPrint';

const getAvailableRouteTypesMemo = (
  memoize(getAvailableRouteTypes)
);

const getDependeceTechnicalOperationRouteType = (
  memoize(
    (dependeceTechnicalOperation, for_column) => {
      if (!for_column) {
        return get(dependeceTechnicalOperation, 'route_types', []);
      }

      return ['mixed'];
    },
  )
);

class FieldRouteIdMission extends React.PureComponent<PropsFieldRouteIdMission, StateFieldRouteIdMission> {
  state = {
    showRouteForm: false,
    selectedRouteRaw: null,
    selectedRoute: null,
    ROUTE_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldRouteIdMission) {
    const {
      value,
      name,
      routesList,
      structure_id,
    } = nextProps;

    let ROUTE_OPTIONS = makeOptionFromRouteList(
      routesList,
      structure_id,
    );

    if (value) {
      const selectedRouteNotInOption = ROUTE_OPTIONS.find((routeOptionData) => routeOptionData.value === value);

      if (!selectedRouteNotInOption) {
        ROUTE_OPTIONS = [
          ...ROUTE_OPTIONS,
          {
            value,
            label: name,
            rowData: {
              id: value,
              name,
            },
          },
        ];
      }
    }

    return {
      ROUTE_OPTIONS,
    };
  }

  componentDidMount() {
    const {
      value,
      isPermitted,
      mission_id,
    } = this.props;

    if (isPermitted) {
      const {
        MISSION_IS_ORDER_SOURCE,
        municipal_facility_id,
        technical_operation_id,
        for_column,
        dependeceTechnicalOperation,
        municipalFacilityForMissionList,
      } = this.props;

      const triggerOnGetRouteList = (
        technical_operation_id
        && municipal_facility_id
        && (
          MISSION_IS_ORDER_SOURCE
            ? dependeceTechnicalOperation
            : municipalFacilityForMissionList.length
        )
        || mission_id
      );

      if (triggerOnGetRouteList) {
        this.getRoutes(technical_operation_id, municipal_facility_id, for_column, mission_id);
      }
    }

    if (value) {
      this.loadSelectedRoute(value);
    }
  }

  componentDidUpdate(prevProps: PropsFieldRouteIdMission) {
    const {
      isPermitted,
    } = this.props;

    if (isPermitted) {
      const {
        value,
        dependeceTechnicalOperation,
        municipal_facility_id,
        technical_operation_id,
        for_column,
        municipalFacilityForMissionList,
        MISSION_IS_ORDER_SOURCE,
      } = this.props;

      const triggerOne = (
        (
          (
            technical_operation_id !== prevProps.technical_operation_id
            || municipal_facility_id !== prevProps.municipal_facility_id
            || for_column !== prevProps.for_column
          )
          && (
            MISSION_IS_ORDER_SOURCE
              ? dependeceTechnicalOperation
              : municipalFacilityForMissionList.length
          )
        )
      );

      if (triggerOne) {
        if (technical_operation_id && municipal_facility_id && value) {
          this.getRoutesWithCheckCurrent(technical_operation_id, municipal_facility_id, for_column);
        }
      }

      const triggerTwo = (
        technical_operation_id
        && municipal_facility_id
        && (
          technical_operation_id !== prevProps.technical_operation_id
          || municipal_facility_id !== prevProps.municipal_facility_id
          || for_column !== prevProps.for_column
          || (
            MISSION_IS_ORDER_SOURCE
              ? (
                dependeceTechnicalOperation
              && !prevProps.dependeceTechnicalOperation
              )
              : (
                municipalFacilityForMissionList.length
              && !prevProps.municipalFacilityForMissionList.length
              )
          )
        )
        && (
          MISSION_IS_ORDER_SOURCE
            ? (
              dependeceTechnicalOperation
                || (
                  dependeceTechnicalOperation
                  && !prevProps.dependeceTechnicalOperation
                )
            )
            : (
              municipalFacilityForMissionList.length
              || (
                municipalFacilityForMissionList.length
                && !prevProps.municipalFacilityForMissionList.length
              )
            )
        )
      );

      if (triggerTwo) {
        this.getRoutes(technical_operation_id, municipal_facility_id, for_column);
      }

      if (value !== prevProps.value && value !== get(this.state.selectedRoute, 'id', null)) {
        this.loadSelectedRoute(value);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.isPermitted) {
      this.props.actionResetSetRoutes();
    }
  }

  async getRoutesWithCheckCurrent(technical_operation_id, municipal_facility_id, for_column) {
    const { dataIndex } = await this.getRoutes(technical_operation_id, municipal_facility_id, for_column);
    const {
      value,
    } = this.props;

    if (value && !dataIndex[value]) {
      this.handleRouteIdChange(null);
    }
  }

  async getRoutes(technical_operation_id, municipal_facility_id, for_column, mission_id?: number) {
    const {
      dependeceTechnicalOperation,
      MISSION_IS_ORDER_SOURCE,
      page, path,
    } = this.props;

    if (mission_id) {
      const payload: any = {};
      if (this.props.IS_TEMPLATE) {
        payload.mission_template_id = mission_id;
      } else {
        payload.mission_id = mission_id;
      }
      return this.props.actionLoadAndSetInStoreRoutes(
        payload,
        { page, path },
      );
    }

    return this.props.actionLoadAndSetInStoreRoutes(
      {
        technical_operation_id,
        municipal_facility_id,
        type: (
          MISSION_IS_ORDER_SOURCE
            ? getDependeceTechnicalOperationRouteType(
              dependeceTechnicalOperation,
              for_column,
            )
            : getAvailableRouteTypesMemo(
              this.props.municipalFacilityForMissionList,
              municipal_facility_id,
              for_column,
            )
        ).toString(),
      },
      { page, path },
    );
  }

  onRouteFormHide = (isSubmitted, route) => {
    const route_id = get(route, 'id', null);
    const route_name = get(route, 'name', '');
    const route_type = get(route, 'type', '');
    const object_type_id = get(route, 'type_id', null);
    const object_type_name = get(
      routeTypesByKey,
      `${get(route, 'type', '')}.title`,
      null,
    );

    if (isSubmitted) {
      const {
        technical_operation_id,
        municipal_facility_id,
        for_column,
      } = this.props;

      this.setState({
        selectedRoute: route,
      });
      this.getRoutes(technical_operation_id, municipal_facility_id, for_column);
    }

    this.setState({
      selectedRouteRaw: null,
      showRouteForm: false,
    });

    this.props.onChange({
      route_id,
      route_name,
      route_type,
      object_type_id,
      object_type_name,
    });
  };

  handleRouteIdChange = async (route_id: Mission['route_id'], route?: ValuesOf<StateFieldRouteIdMission['ROUTE_OPTIONS']>) => {
    const route_name = get(route, 'rowData.name', null);
    const route_type = get(route, 'rowData.type', null);
    const object_type_id = get(route, 'rowData.type_id', null);
    const object_type_name = get(
      routeTypesByKey,
      `${get(route, 'rowData.type', null)}.title`,
      null,
    );

    if (this.props.formDataKey === 'mission' && !route_id && this.props.consumable_materials[0]) {
      try {
        await global.confirmDialog({
          title: 'Внимание!',
          body: 'При удалении маршрута будет очищена таблица расходных материалов. Продолжить?',
        });
      } catch {
        return;
      }
    }

    this.props.onChange({
      route_id,
      route_name,
      route_type,
      object_type_id,
      object_type_name,
    });
  };

  async loadSelectedRoute(route_id: Route['id'] | null) {
    if (route_id) {
      const { page, path } = this.props;

      try {
        const route_data = await this.props.actionLoadRouteById(
          route_id,
          { page, path },
        );

        if (route_data) {
          this.setState({
            selectedRoute: route_data,
          });
          const object_type_name = get(
            routeTypesByKey,
            `${get(route_data, 'type', '')}.title`,
            null,
          );

          this.props.onChange({
            object_type_name,
          });
        } else {
          throw new Error(`Не найден маршрут ${route_id}`);
        }
      } catch (error) {
        console.warn(error); // tslint:disable-line
        throw new Error(error);
      }
    } else {
      this.setState({
        selectedRoute: null,
      });
    }
  }

  createNewRoute = () => {
    const {
      municipal_facility_id,
      municipal_facility_name,
      technical_operation_id,
      technical_operation_name,
      structure_id,
      structure_name,
    } = this.props;

    this.setState({
      showRouteForm: true,
      selectedRouteRaw: {
        is_main: true,
        name: '',
        municipal_facility_id,
        municipal_facility_name,
        technical_operation_id,
        technical_operation_name,
        structure_id,
        structure_name,
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      },
    });
  };

  render() {
    const {
      page,
      error,
      value,
      municipal_facility_id,
      structure_id,
      MISSION_IS_ORDER_SOURCE,
      dependeceTechnicalOperation,
      for_column,
      request_id,
      edcRequest,
      fromMissionTemplate,
      fromMission,
    } = this.props;

    const {
      showRouteForm,
      selectedRouteRaw,
      selectedRoute,
      ROUTE_OPTIONS,
    } = this.state;

    const hasSelectedMunicipalFacilityId = Boolean(municipal_facility_id);
    const hasSelectedStructureId = Boolean(structure_id);

    return (
      <>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="select"
              id="route_id"
              modalKey={page}
              label={`Маршрут ${request_id ? `(адрес в заявке: ${get(edcRequest, 'house_address', '')})` : ''}`}
              error={error}
              options={ROUTE_OPTIONS}
              value={value}
              disabled={!hasSelectedMunicipalFacilityId || this.props.disabled}
              onChange={this.handleRouteIdChange}
              clearable
            />
            {
              !value
                ? (
                  <EtsBootstrap.Button
                    id="mt-create-route"
                    onClick={this.createNewRoute}
                    disabled={!hasSelectedMunicipalFacilityId || this.props.disabled}
                  >
                    Создать новый
                  </EtsBootstrap.Button>
                )
                : (
                  <DivNone />
                )
            }
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            {
              selectedRoute && !showRouteForm
                ? (
                  <RouteInfo
                    route={selectedRoute}
                    noRouteName
                    mapKey="mission__template_form"
                  />
                )
                : (
                  <DivNone />
                )
            }
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {
          showRouteForm
            ? (
              <RouteFormWrap
                element={selectedRouteRaw}
                showForm={showRouteForm}
                handleHide={this.onRouteFormHide}
                hasMissionStructureId={hasSelectedStructureId}
                missionAvailableRouteTypes={
                  (
                    MISSION_IS_ORDER_SOURCE
                      ? getDependeceTechnicalOperationRouteType(
                        dependeceTechnicalOperation,
                        for_column,
                      )
                      : getAvailableRouteTypesMemo(
                        this.props.municipalFacilityForMissionList,
                        municipal_facility_id,
                        for_column,
                      )
                  )
                }
                fromMission={fromMission}
                fromMissionTemplate={fromMissionTemplate}
                page={page}
              />
            )
            : (
              <DivNone />
            )
        }
        {
          selectedRoute && !showRouteForm   // рак
            ? (
              <HiddenMapForPrint
                route={selectedRoute}
                hiddenMapConfig={this.props.hiddenMapConfig}
              />
            )
            : (
              <DivNone />
            )
        }
      </>
    );
  }
}

export default connect<StatePropsFieldRouteIdMission, DispatchPropsFieldRouteIdMission, OwnPropsFieldRouteIdMission, ReduxState>(
  (state) => ({
    routesList: getRoutesState(state).routesList,
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
    dependeceTechnicalOperation: getMissionsState(state).missionData.dependeceTechnicalOperation,
    edcRequest: getMissionsState(state).missionData.edcRequest,
  }),
  (dispatch: any) => ({
    actionLoadRouteById: (...arg) => (
      dispatch(
        routesActions.actionLoadRouteById(...arg),
      )
    ),
    actionLoadAndSetInStoreRoutes: (...arg) => (
      dispatch(
        routesActions.actionLoadAndSetInStoreRoutes(...arg),
      )
    ),
    actionResetSetRoutes: (...arg) => (
      dispatch(
        routesActions.actionResetSetRoutes(...arg),
      )
    ),
  }),
)(FieldRouteIdMission);
