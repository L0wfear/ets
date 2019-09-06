import * as React from 'react';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';
import ChangeRouteTable from './ChangeRouteTable';
import { TechnicalOperationRelations } from 'redux-main/reducers/modules/technical_operation_relations/@types/technicalOperationRelations';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import { ReduxState } from 'redux-main/@types/state';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { isBoolean } from 'util';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import routePermissions from 'components/new/pages/routes_list/config-data/permissions';

type ChangeRouteFormStateProps = {};
type ChangeRouteFormDispatchProps = {
  actionLoadRouteById: HandleThunkActionCreator<typeof routesActions.actionLoadRouteById>;
  actionRemoveRoute: HandleThunkActionCreator<typeof routesActions.actionRemoveRoute>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ChangeRouteFormOwnProps = {
  element: TechnicalOperationRelations;
  handleHide: any;
  registryKey: string;

  page: string;
  path?: string;
};
type ChangeRouteFormOwnMergedProps = (
  ChangeRouteFormStateProps
  & ChangeRouteFormDispatchProps
  & ChangeRouteFormOwnProps
);

type ChangeRouteFormProps = (
  ChangeRouteFormOwnMergedProps
  & WithSearchProps
);
/**
 *
 * @todo перевести на нормальные реестр
 */
const ChangeRouteForm: React.FC<ChangeRouteFormProps> = (props) => {
  const [routeSelected, setRouteSelected] = React.useState<ValuesOf<TechnicalOperationRelations['routes']>>(null);
  const [routeElement, setRouteElement] = React.useState<Partial<Route>>(null);
  const {
    element,
  } = props;
  const technical_operation_id = getNumberValueFromSerch(props.searchState.technical_operation_id) || null;
  const municipal_facility_id = getNumberValueFromSerch(props.searchState.municipal_facility_id) || null;
  const {
    page, path,
  } = props;

  const reloadRegistry = React.useCallback(
    () => {
      props.registryLoadDataByKey(props.registryKey);
    },
    [],
  );

  React.useEffect(
    () => {
      setRouteSelected(null);
      setRouteElement(null);
    },
    [element],
  );

  const onRouteFormHide = React.useCallback(
    (isSubmitted) => {
      if (isBoolean(isSubmitted) && isSubmitted) {
        reloadRegistry();
      }
      setRouteElement(null);
    },
    [reloadRegistry],
  );

  const onRowClick = React.useCallback(
    ({ props: { data } }) => {
      setRouteSelected(data);
    },
    [],
  );

  const handleCreateNewRouteNew = React.useCallback(
    () => {
      setRouteElement({
        is_main: true,
        name: '',
        municipal_facility_id,
        municipal_facility_name: '',
        technical_operation_id,
        technical_operation_name: '',
        structure_id: null,
        structure_name: '',
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      });
    },
    [municipal_facility_id, technical_operation_id],
  );

  const removeRoute = React.useCallback(
    async () => {
      try {
        await global.confirmDialog({
          title: 'Внимание!',
          body: 'Вы уверены, что хотите удалить выбранный маршрут?',
        });
      } catch (e) {
        return;
      }
      try {
        await props.actionRemoveRoute(
          routeSelected.id,
          {
            page,
            path,
          },
        );
        reloadRegistry();
      } catch (error) {
        console.log(error); // tslint:disable-line
      }
    },
    [reloadRegistry, routeSelected],
  );

  const handleChangeRoute = React.useCallback(
    async () => {
      try {
        const route_data = await props.actionLoadRouteById(
          routeSelected.id,
          { page, path },
        );

        setRouteElement(
          route_data,
        );
      } catch (error) {
        console.log(error); // tslint:disable-line
      }
    },
    [routeSelected],
  );

  return (
    <React.Fragment>
      <EtsBootstrap.ModalContainer
        id="modal-technical-operation"
        show
        onHide={props.handleHide}
        bsSize="large"
      >
          <EtsBootstrap.ModalHeader closeButton>
            <EtsBootstrap.ModalTitle>Маршруты</EtsBootstrap.ModalTitle>
          </EtsBootstrap.ModalHeader>
          <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
            <ChangeRouteTable
              data={element.routes}
              onRowClick={onRowClick}
              selected={routeSelected}
            >
              <EtsBootstrap.Button onClick={handleCreateNewRouteNew} permissions={routePermissions.create}>
                Создать новый маршрут
              </EtsBootstrap.Button>
              <EtsBootstrap.Button
                disabled={!routeSelected}
                onClick={removeRoute}
                permissions={routePermissions.delete}
              >
                Удалить маршрут
              </EtsBootstrap.Button>
            </ChangeRouteTable>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={3} mdOffset={9}>
                <EtsBootstrap.Button
                  block
                  id="change-route"
                  bsClass="btn all-width"
                  disabled={!routeSelected}
                  onClick={handleChangeRoute}
                  permissions={routePermissions.update}
                >
                  Изменить
                </EtsBootstrap.Button>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </ModalBodyPreloader>
        </EtsBootstrap.ModalContainer>
        <RouteFormWrap
          element={routeElement}
          handleHide={onRouteFormHide}
          showForm={Boolean(routeElement)}

          page={page}
          path={path}
        />
      </React.Fragment>
  );
};

export default compose<ChangeRouteFormProps, ChangeRouteFormOwnProps>(
  withSearch,
  connect<ChangeRouteFormStateProps, ChangeRouteFormDispatchProps, ChangeRouteFormOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadRouteById: (...arg) => (
        dispatch(
          routesActions.actionLoadRouteById(...arg),
        )
      ),
      actionRemoveRoute: (...arg) => (
        dispatch(
          routesActions.actionRemoveRoute(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
    }),
  ),
)(ChangeRouteForm);
