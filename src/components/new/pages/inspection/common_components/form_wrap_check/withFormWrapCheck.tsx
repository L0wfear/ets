import * as React from 'react';
import { get } from 'lodash';
import { createPortal } from 'react-dom';
import { compose, withProps } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { isBoolean } from 'util';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { ReduxState } from 'redux-main/@types/state';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { DivNone } from 'global-styled/global-styled';

import { INSPECT_TYPE_FORM } from '../../autobase/global_constants';
import { isInspectIsConducting } from 'redux-main/reducers/modules/inspect/inspect_utils';

import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { HiddenPageEtsContainer, PopupBottomForm } from './styled';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { getSessionState } from 'redux-main/reducers/selectors';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

type WithInspectFormWrapCheckConfig = {
  loadingPage: string;
  loadInpectById: any;
  inspectPermissions: (
    {
      update: string | Array<string>;
      update_closed: string | Array<string>;
    } & Record<string, string | Array<string>>
  );
  title: React.ReactNode;
};

type InspectionFormWrapStateProps = {
  userData: InitialStateSession['userData'];
};
type InspectionFormWrapDispatchProps = {
  actionGetInspectById: any;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
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
                  <Component
                    selectedInspect={selectedInspect}
                    element={selectedInspect}
                    type={inspectType}
                    title={config.title}
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
      (state) => ({
        userData: getSessionState(state).userData,
      }),
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
    withRequirePermission({
      permissions: config.inspectPermissions.update,
      withIsPermittedProps: true,
    }),
    withProps<InspectionFormWrapStateProps & { isPermittedToUpdateClose: boolean; }, any>(
      (props) => ({
        ...props,
        isPermittedToUpdateClose: validatePermissions(config.inspectPermissions.update_closed, props.userData.permissionsSet),
      }),
    ),
  )(InspectionFormWrap);
};

export default withInspectFormWrapCheck;
