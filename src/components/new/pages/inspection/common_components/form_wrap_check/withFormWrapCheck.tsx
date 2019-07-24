import * as React from 'react';
import { get } from 'lodash';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { isBoolean } from 'util';
import { DivNone } from 'global-styled/global-styled';

import { INSPECT_TYPE_FORM } from '../../autobase/global_constants';
import { isInspectIsConducting } from 'redux-main/reducers/modules/inspect/inspect_utils';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { HiddenPageEtsContainer, PopupBottomForm, TitleForm } from './styled';

import { createPortal } from 'react-dom';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type WithInspectFormWrapCheckConfig = {
  loadingPage: string;
  loadInpectById: any;
  inspectPermissions: (
    {
      update: string | string[];
      update_closed: string | string[];
    } & Record<string, string | string[]>
  );
  title: React.ReactNode;
};

type InspectionFormWrapStateProps = {};
type InspectionFormWrapDispatchProps = {
  actionGetInspectById: any;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>
};
type InspectionFormWrapOwnProps = {
  loadingPage: string;
};
type InspectionFormWrapMergedProps = (
  InspectionFormWrapStateProps
  & InspectionFormWrapDispatchProps
  & InspectionFormWrapOwnProps
);
type InspectionFormWrapProps = (
  InspectionFormWrapMergedProps
  & WithSearchProps
  & {
    isPermitted: boolean;
    isPermittedToUpdateClose: boolean;
  }
);

export type withInspectFormWrapCheckOuterProps = {
  selectedInspect: any;
  element: any;
  type: keyof typeof INSPECT_TYPE_FORM;
  handleHide: any;
  isPermitted: boolean;

  page: string;
};

const withInspectFormWrapCheck = (config: WithInspectFormWrapCheckConfig) => (Component) => {
  const getSelectedInspect = async (props: InspectionFormWrapProps, inspectId: number) => {
    const selectedInspectNew = await props.actionGetInspectById(
      inspectId,
      { page: props.loadingPage },
    );

    return selectedInspectNew;
  };

  const checkSearchState = (searchState, setDataInSearch, selectedInspect) => {
    if (!searchState.carpoolId || !searchState.companyId) {
      setDataInSearch({
        carpoolId: selectedInspect.base_id,
        companyId: selectedInspect.company_id,
      });
    }
  };

  const inspectionListDidUpdate = async (
    props: InspectionFormWrapProps,
    inspectId: number,
    selectedInspect: any,
    setSelectedInspect: React.Dispatch<any>,
    handleCloseForm: (isSubmitted: boolean) => void,
  ) => {
    const currentSelectedId = get(selectedInspect, 'id', null);

    if (inspectId && (currentSelectedId !== inspectId)) {
      const selectedInspectNew = await getSelectedInspect(props, inspectId);

      if (selectedInspectNew) {
        checkSearchState(
          props.searchState,
          props.setDataInSearch,
          selectedInspectNew,
        );

        setSelectedInspect(selectedInspectNew);
      } else {
        handleCloseForm(false);
      }
    }
  };

  const InspectionFormWrap: React.FC<InspectionFormWrapProps> = (props) => {
    const [selectedInspect, setSelectedInspect] = React.useState(null);
    const inspectId = getNumberValueFromSerch(props.match.params.id);
    const inspectType = props.match.params.type;

    const handleCloseForm = React.useCallback(
      async (isSubmitted) => {
        props.actionUnselectSelectedRowToShow(props.loadingPage, isBoolean(isSubmitted) ? isSubmitted : true);

        if (isBoolean(isSubmitted) && isSubmitted || true) {
          props.registryLoadDataByKey(props.loadingPage);
        }

        props.setParams(
          {
            id: '',
            type: '',
          },
          'replace',
        );
        setSelectedInspect(null);
      },
      [props.match.url,  props.location.search],
    );

    React.useEffect(
      () => {
        inspectionListDidUpdate(
          props,
          inspectId,
          selectedInspect,
          setSelectedInspect,
          handleCloseForm,
        );
      }, [props.match.url, props.location.search, selectedInspect, inspectId],
    );

    React.useEffect(() => {
      if (inspectId && selectedInspect) {
        const tirregOnWrongType = (
          !inspectType
          || (
            inspectType !== INSPECT_TYPE_FORM.list
            && inspectType !== INSPECT_TYPE_FORM.closed
          )
          || (
            inspectType === INSPECT_TYPE_FORM.closed
            && isInspectIsConducting(selectedInspect.status)
          )
        );

        if (tirregOnWrongType) {
          props.setParams(
            {
              type: INSPECT_TYPE_FORM.list,
            },
            'replace',
          );
        }

        if (inspectType === INSPECT_TYPE_FORM.list) {
          if (!isInspectIsConducting(selectedInspect.status)) {
            props.setParams(
              {
                type: INSPECT_TYPE_FORM.closed,
              },
              'replace',
            );
          }
        }
      }
    }, [inspectId, inspectType, selectedInspect]);

    const handleCloseWithoutChanges = React.useCallback(
      async () => {
        if (inspectType !== INSPECT_TYPE_FORM.closed) {
          try {
            await global.confirmDialog({
              title: 'Покинуть страницу?',
              body: 'Возможно, внесенные изменения не сохранятся.',
              okName: 'Закрыть',
              cancelName: 'Остаться',
            });
          } catch (error) {
            // no
            return;
          }
        }

        handleCloseForm(
          inspectType !== INSPECT_TYPE_FORM.closed,
        );
      },
      [inspectType, handleCloseForm],
    );

    useEscapeEvent(handleCloseWithoutChanges);

    return createPortal(
      <HiddenPageEtsContainer>
        <PopupBottomForm show={Boolean(selectedInspect) && Boolean(inspectId) && inspectType}>
        {
            inspectId && selectedInspect && inspectType
              ? (
                <React.Fragment>
                  <TitleForm md={12} sm={12}>
                    <h4>{config.title}</h4>
                    <EtsBootstrap.Button onClick={handleCloseWithoutChanges}><EtsBootstrap.Glyphicon glyph="remove" /></EtsBootstrap.Button>
                  </TitleForm>
                  <Component
                    selectedInspect={selectedInspect}
                    element={selectedInspect}
                    type={inspectType}
                    handleHide={handleCloseForm}
                    handleCloseWithoutChanges={handleCloseWithoutChanges}
                    isPermitted={inspectType === INSPECT_TYPE_FORM.closed ? props.isPermittedToUpdateClose : props.isPermitted}
                    isPermittedToUpdateClose={props.isPermittedToUpdateClose}

                    page={props.loadingPage}
                    loadingPage={props.loadingPage}

                    inspectIsClosed={inspectType === INSPECT_TYPE_FORM.closed}
                    inspectIsActive={inspectType === INSPECT_TYPE_FORM.list}
                  />
                </React.Fragment>
              )
              : (
                <DivNone />
              )
            }
        </PopupBottomForm>
      </HiddenPageEtsContainer>,
      document.getElementById('container'),
    );
  };

  return compose<InspectionFormWrapProps, InspectionFormWrapOwnProps>(
    withPreloader({
      page: config.loadingPage,
      typePreloader: 'mainpage',
    }),
    connect<InspectionFormWrapStateProps, InspectionFormWrapDispatchProps, InspectionFormWrapOwnProps, ReduxState>(
      null,
      (dispatch: any) => ({
        actionGetInspectById: (...arg) => (
          dispatch(
            config.loadInpectById(...arg),
          )
        ),
        actionUnselectSelectedRowToShow: (...arg) => (
          dispatch(
            actionUnselectSelectedRowToShow(...arg),
          )
        ),
        registryLoadDataByKey: (...arg) => (
          dispatch(
            registryLoadDataByKey(...arg),
          )
        ),
      }),
    ),
    withSearch,
    withRequirePermissionsNew({
      permissions: config.inspectPermissions.update,
      withIsPermittedProps: true,
    }),
    withRequirePermissionsNew({
      permissions: config.inspectPermissions.update_closed,
      withIsPermittedProps: true,
      permissionName: 'isPermittedToUpdateClose',
    }),
  )(InspectionFormWrap);
};

export default withInspectFormWrapCheck;
