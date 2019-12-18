import * as React from 'react';
import memoize from 'memoize-one';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import {
  StatePropsFieldRouteIdDutyMission,
  DispatchPropsFieldRouteIdDutyMission,
  OwnPropsFieldRouteIdDutyMission,
  PropsFieldRouteIdDutyMission,
  StateFieldRouteIdDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/route_id/FieldRouteIdDutyMission.d';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  getSomeUniqState,
  getMissionsState,
} from 'redux-main/reducers/selectors/index';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { getRoutesState } from 'redux-main/reducers/selectors/index';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { makeOptionFromRouteList } from 'components/new/pages/missions/duty_mission/form/main/inside_fields/route_id/makeOptions';
import { routeTypesByKey } from 'constants/route';
import { getAvailableRouteTypes } from 'components/new/pages/missions/mission_template/form/template/utils';

const getAvailableRouteTypesMemo = memoize(getAvailableRouteTypes);

/**
 * Поле "Маршрут" для формы наряд-задания
 * Зависит от ТО, Элемент и подразделения
 * ТО/ Элемент или зависимое поручение дают возможность получения списка маршрутов по norm_id
 * если !isPermitted, то не будет запроса за ТО
 */
class FieldRouteIdDutyMission extends React.PureComponent<PropsFieldRouteIdDutyMission, StateFieldRouteIdDutyMission> {
  state = {
    showRouteForm: false,
    selectedRouteRaw: null,
    selectedRoute: null,
    ROUTE_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldRouteIdDutyMission) {
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
      const selectedRouteNotInOption = ROUTE_OPTIONS.find(
        (routeOptionData) => routeOptionData.value === value,
      );

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
    const { value, isPermitted } = this.props;

    if (isPermitted) {
      const {
        DUTY_MISSION_IS_ORDER_SOURCE,
        municipal_facility_id,
        technical_operation_id,
        dependeceTechnicalOperation,
      } = this.props;

      const triggerOnGetRouteList = (
        technical_operation_id
        && municipal_facility_id
        && (
          DUTY_MISSION_IS_ORDER_SOURCE
          ? dependeceTechnicalOperation
          : municipal_facility_id
        )
      );

      if (triggerOnGetRouteList) {
        this.getRoutes(technical_operation_id, municipal_facility_id);
      }
    }

    if (value) {
      this.loadSelectedRoute(value);
    }
  }

  async componentDidUpdate(prevProps: PropsFieldRouteIdDutyMission) {
    const { isPermitted } = this.props;

    if (isPermitted) {
      const {
        value,
        dependeceTechnicalOperation,
        structure_id,
        municipal_facility_id,
        technical_operation_id,
        municipalFacilityForDutyMissionList,
        DUTY_MISSION_IS_ORDER_SOURCE,
      } = this.props;

      const triggerOne =
        (
          (
            technical_operation_id !== prevProps.technical_operation_id
            || municipal_facility_id !== prevProps.municipal_facility_id
          )
          && (
            DUTY_MISSION_IS_ORDER_SOURCE
            ? dependeceTechnicalOperation
            : municipalFacilityForDutyMissionList.length
          )
        ) ||
        (
          DUTY_MISSION_IS_ORDER_SOURCE
          ? !dependeceTechnicalOperation &&
            prevProps.dependeceTechnicalOperation
          : !municipalFacilityForDutyMissionList.length &&
            prevProps.municipalFacilityForDutyMissionList.length
        );

      if (triggerOne) {
        if (technical_operation_id && municipal_facility_id) {
          const routesList = await this.getRoutes(technical_operation_id, municipal_facility_id);
          const ROUTE_OPTIONS = (makeOptionFromRouteList(routesList.data, structure_id));
          const selectedRouteNotInOption = ROUTE_OPTIONS.find(
            (routeOptionData) => routeOptionData.value === value,
          );

          if (!selectedRouteNotInOption) {
            this.handleRouteIdChange(null);
          }
        }
      }

      if (!technical_operation_id || !municipal_facility_id) {
        this.handleRouteIdChange(null);
      }

      if (value !== prevProps.value && value !== get(this.state.selectedRoute, 'id', null)) {
        this.loadSelectedRoute(value);
      }
      if (structure_id !== prevProps.structure_id) {
        if (structure_id) {
          const route_structure_id = get(
            this.state.selectedRoute,
            'structure_id',
            null,
          );

          if (route_structure_id !== structure_id) {
            this.handleRouteIdChange(null);
          }
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.isPermitted) {
      this.props.actionResetSetRoutes();
    }
  }

  async getRoutes(technical_operation_id, municipal_facility_id) {
    const {
      dependeceTechnicalOperation,
      DUTY_MISSION_IS_ORDER_SOURCE,
      page,
      path,
    } = this.props;

    return this.props.actionLoadAndSetInStoreRoutes(
      {
        technical_operation_id,
        municipal_facility_id,
        type: (DUTY_MISSION_IS_ORDER_SOURCE
          ? get(dependeceTechnicalOperation, 'route_types', [])
          : getAvailableRouteTypesMemo(
              this.props.municipalFacilityForDutyMissionList,
              municipal_facility_id,
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
      const { technical_operation_id, municipal_facility_id } = this.props;

      this.setState({
        selectedRoute: route,
      });
      this.getRoutes(technical_operation_id, municipal_facility_id);
    }

    this.props.onChange({
      route_id,
      route_name,
      route_type,
      object_type_id,
      object_type_name,
    });

    this.setState({
      selectedRouteRaw: null,
      showRouteForm: false,
    });
  };

  handleRouteIdChange = async (
    route_id: DutyMission['route_id'],
    route?: ValuesOf<StateFieldRouteIdDutyMission['ROUTE_OPTIONS']>,
  ) => {
    const route_name = get(route, ['rowData', 'name'], '');
    const route_type = get(route, ['rowData', 'type'], '');

    const object_type_id = get(route, ['rowData', 'type_id'], null);
    const object_type_name = get(
      routeTypesByKey,
      `${get(route, 'rowData.type', '')}.title`,
      null,
    );

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
        const route_data = await this.props.actionLoadRouteById(route_id, {
          page,
          path,
        });

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
      DUTY_MISSION_IS_ORDER_SOURCE,
      dependeceTechnicalOperation,
      request_id,
      edcRequest,
      fromMission,
      fromMissionTemplate,
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
            {!value ? (
              <EtsBootstrap.Button
                id="mt-create-route"
                onClick={this.createNewRoute}
                disabled={
                  !hasSelectedMunicipalFacilityId || this.props.disabled
                }>
                Создать новый
              </EtsBootstrap.Button>
            ) : (
              <DivNone />
            )}
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            {selectedRoute && !showRouteForm ? (
              <RouteInfo
                route={selectedRoute}
                noRouteName
                mapKey="duty_mission__template_form"
              />
            ) : (
              <DivNone />
            )}
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {showRouteForm ? (
          <RouteFormWrap
            element={selectedRouteRaw}
            showForm={showRouteForm}
            handleHide={this.onRouteFormHide}
            hasMissionStructureId={hasSelectedStructureId}
            missionAvailableRouteTypes={(DUTY_MISSION_IS_ORDER_SOURCE
              ? get(dependeceTechnicalOperation, 'route_types', [])
              : getAvailableRouteTypesMemo(
                  this.props.municipalFacilityForDutyMissionList,
                  municipal_facility_id,
                )
            )}
            fromMission={fromMission}
            fromMissionTemplate={fromMissionTemplate}
            page={page}
          />
        ) : (
          <DivNone />
        )}
      </>
    );
  }
}

export default connect<
  StatePropsFieldRouteIdDutyMission,
  DispatchPropsFieldRouteIdDutyMission,
  OwnPropsFieldRouteIdDutyMission,
  ReduxState
>(
  (state) => ({
    routesList: getRoutesState(state).routesList,
    municipalFacilityForDutyMissionList: getSomeUniqState(state)
      .municipalFacilityForDutyMissionList,
    dependeceTechnicalOperation: getMissionsState(state).dutyMissionData
      .dependeceTechnicalOperation,
    edcRequest: getMissionsState(state).dutyMissionData.edcRequest,
  }),
  (dispatch: any, { page, path }) => ({
    actionLoadRouteById: (...arg) =>
      dispatch(routesActions.actionLoadRouteById(...arg)),
    actionLoadAndSetInStoreRoutes: (...arg) =>
      dispatch(routesActions.actionLoadAndSetInStoreRoutes(...arg)),
    actionResetSetRoutes: (...arg) =>
      dispatch(routesActions.actionResetSetRoutes(...arg)),
  }),
)(FieldRouteIdDutyMission);
