import * as React from 'react';
import memoize from 'memoize-one';
import { get } from 'lodash';

import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import HiddenMapForPrint from 'components/missions/mission_template/print/HiddenMapForPrint';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import {
  StatePropsFieldRouteMissionTemplate,
  DispatchPropsFieldRouteMissionTemplate,
  OwnPropsFieldRouteMissionTemplate,
  PropsFieldRouteMissionTemplate,
  StateFieldRouteMissionTemplate,
} from 'components/missions/mission_template/form/template/inside_fields/route/FieldRouteMissionTemplate.d';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { isNullOrUndefined } from 'util';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getSomeUniqState } from 'redux-main/reducers/selectors/index';
import { getAvailableRouteTypes } from 'components/missions/mission_template/form/template/utils';

const getAvailableRouteTypesMemo = (
  memoize(getAvailableRouteTypes)
);

class FieldRouteMissionTemplate extends React.PureComponent<PropsFieldRouteMissionTemplate, StateFieldRouteMissionTemplate> {
  state = {
    printKey: {
      big: 'printMapKeyBig',
      small: 'printMapKeyBig',
      routeInfo: 'mapMissionTemplateFrom',
    },
    showRouteForm: false,
    selectedRouteRaw: null,
    selectedRoute: null,
    routesList: [],
  };

  componentDidMount() {
    const {
      route_id,
      technical_operation_id,
      municipal_facility_id,
      for_column,
      municipalFacilityForMissionList,
    } = this.props;

    const triggerOnGetRoutesList = (
      !isNullOrUndefined(technical_operation_id)
      && !isNullOrUndefined(municipal_facility_id)
      && Boolean(municipalFacilityForMissionList.length)
    );

    if (triggerOnGetRoutesList) {
      this.getRoutes(
        route_id,
        technical_operation_id,
        municipal_facility_id,
        for_column,
      );
    }
  }

  componentDidUpdate(prevProps: PropsFieldRouteMissionTemplate) {
    const {
      route_id,
      technical_operation_id,
      municipal_facility_id,
      for_column,
      municipalFacilityForMissionList,
      structure_id,
    } = this.props;
    const {
      selectedRoute,
    } = this.state;

    let newRouteId = route_id;

    const isDiffTechnicalOperationId = (
      technical_operation_id !== prevProps.technical_operation_id
    );
    const isDiffMunicipalFacilityId = (
      municipal_facility_id !== prevProps.municipal_facility_id
    );
    const isDiffForColumn = (
      for_column !== prevProps.for_column
    );

    const triggerOnReset = (
      route_id
      && (
        !for_column
        || (
          for_column
          && get(this.state.selectedRoute, 'type', null) !== 'mixed'
        )
      )
      && (
        isDiffTechnicalOperationId
        || isDiffMunicipalFacilityId
        || isDiffForColumn
      )
    );

    if (triggerOnReset) {
      if (isDiffTechnicalOperationId || isDiffMunicipalFacilityId) {
        newRouteId = null;
        this.handleRouteIdChange(newRouteId, null);
      }
    } else if (structure_id && route_id && selectedRoute) {
      if (selectedRoute.structure_id !== structure_id) {
        newRouteId = null;
        this.handleRouteIdChange(newRouteId, null);
      }
    }

    const municipalFacilityForMissionListLength = municipalFacilityForMissionList.length;

    const triggerOnGetRoutesList = (
      !isNullOrUndefined(technical_operation_id)
      && !isNullOrUndefined(municipal_facility_id)
      && Boolean(municipalFacilityForMissionListLength)
      && (
        (
          isDiffTechnicalOperationId
          || isDiffMunicipalFacilityId
          || isDiffForColumn
        )
        || (
          !prevProps.municipalFacilityForMissionList.length
        )
      )
    );

    if (triggerOnGetRoutesList) {
      this.getRoutes(
        newRouteId,
        technical_operation_id,
        municipal_facility_id,
        for_column,
      );
    }
  }

  async getRoutes(route_id, technical_operation_id, municipal_facility_id, for_column?) {
    const { page, path } = this.props;

    const {
      data: routesList,
    } = await this.props.routesGetSetRoutes(
      {
        technical_operation_id,
        municipal_facility_id,
        type: getAvailableRouteTypesMemo(
          this.props.municipalFacilityForMissionList,
          for_column ? null : municipal_facility_id,
          for_column,
        ).toString(),
      },
      { page, path },
    );

    let { selectedRoute } = this.state;
    if (route_id && (!selectedRoute || selectedRoute.id === route_id)) {
      const { route_data } = await this.routesLoadRouteById(route_id);
      if (route_data) {
        selectedRoute = route_data;

        routesList.push(selectedRoute);
      } else {
        throw new Error(`not found route for id=${route_id}`);
      }
    } else {
      selectedRoute = null;
    }

    this.setState({
      routesList,
      selectedRoute,
    });
  }

  onRouteFormHide = (isSubmitted, route) => {
    const route_id = get(route, 'id', null);
    const route_type = get(route, 'type', '');
    const route_name = get(route, 'name', '');

    this.props.handleChange({
      route_id,
      route_type,
      route_name,
    });

    if (isSubmitted) {
      this.getRoutes(
        get(route, 'id', 'null'),
        this.props.technical_operation_id,
        this.props.municipal_facility_id,
        this.props.for_column,
      );
    }

    this.setState({
      selectedRouteRaw: null,
      showRouteForm: false,
    });
  }

  handleRouteIdChange = async (route_id: any, route: any) => {
    const route_type = get(route, 'type', '');
    const route_name = get(route, 'name', '');

    this.props.handleChange({
      route_id,
      route_type,
      route_name,
    });

    if (route_id) {
      try {
        const { route_data } = await this.routesLoadRouteById(route_id);

        if (route_data) {
          this.setState(({ routesList }) => {
            const routesListNew = [...routesList, route_data];
            return {
              selectedRoute: route_data,
              routesList: routesListNew,
            };
          });
        } else {
          throw new Error(`Не найден маршрут ${route_id}`);
        }
      } catch (error) {
        console.warn(error); // tslint:disable-line
      }
    } else {
      this.setState({
        selectedRoute: null,
      });
    }
  }

  routesLoadRouteById(route_id) {
    const { page, path } = this.props;

    return this.props.routesLoadRouteById(
      route_id,
      { page, path },
    );
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
  }

  makeOptionFromRouteList = (
    memoize(
      (
        routesList,
        structure_id,
      ) => (
        routesList.reduce((newArr, route) => {
          const triggerOnAdRoutetoShow = (
            !structure_id
            || (route.structure_id === structure_id)
          );

          if (triggerOnAdRoutetoShow) {
            newArr.push(defaultSelectListMapper(route));
          }

          return newArr;
        }, [])
      ),
    )
  );

  render() {
    const {
      page,
      error_route_id,
      route_id,
      municipal_facility_id,
      structure_id,
      for_column,
    } = this.props;

    const {
      showRouteForm,
      selectedRouteRaw,
      selectedRoute,
      routesList,
    } = this.state;

    const hasSelectedMunicipalFacilityId = Boolean(municipal_facility_id);
    const hasSelectedStructureId = Boolean(structure_id);

    const ROUTES = this.makeOptionFromRouteList(
      routesList,
      structure_id,
    );

    return (
      <>
        <Row>
          <Col md={6}>
            <ExtField
              type="select"
              id="route_id"
              modalKey={page}
              label="Маршрут"
              error={error_route_id}
              options={ROUTES}
              value={route_id}
              disabled={!hasSelectedMunicipalFacilityId}
              onChange={this.handleRouteIdChange}
              clearable
            />
            {
              !route_id
                ? (
                  <Button
                    id="mt-create-route"
                    onClick={this.createNewRoute}
                    disabled={!hasSelectedMunicipalFacilityId}
                  >
                    Создать новый
                  </Button>
                )
                : (
                  <DivNone />
                )
            }
          </Col>
          <Col md={6}>
            {
              selectedRoute && !showRouteForm
                ? (
                  <RouteInfo
                    route={selectedRoute}
                    noRouteName
                    mapKey={this.state.printKey.routeInfo}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </Col>
        </Row>
        <HiddenMapForPrint
          route={showRouteForm ? null : selectedRoute}
          printMapKeyBig={this.state.printKey.big}
          printMapKeySmall={this.state.printKey.small}
        />
        {
          showRouteForm
            ? (
              <RouteFormWrap
                element={selectedRouteRaw}
                showForm={showRouteForm}
                handleHide={this.onRouteFormHide}
                hasMissionStructureId={hasSelectedStructureId}
                missionAvailableRouteTypes={
                  getAvailableRouteTypesMemo(
                    this.props.municipalFacilityForMissionList,
                    for_column ? null : municipal_facility_id,
                    for_column,
                  )
                }
                fromMission
                fromMissionTemplate
                page={page}
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

export default connect<StatePropsFieldRouteMissionTemplate, DispatchPropsFieldRouteMissionTemplate, OwnPropsFieldRouteMissionTemplate, ReduxState>(
  (state) => ({
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
  }),
  (dispatch: any) => ({
    routesLoadRouteById: (...arg) => (
      dispatch(
        routesActions.routesLoadRouteById(...arg),
      )
    ),
    routesGetSetRoutes: (...arg) => (
      dispatch(
        routesActions.routesGetSetRoutes(...arg),
      )
    ),
  }),
)(FieldRouteMissionTemplate);
