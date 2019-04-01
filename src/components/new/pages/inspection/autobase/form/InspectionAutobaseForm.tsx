import * as React from 'react';
import { get } from 'lodash';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { InspectionAutobaseFormProps, InspectionAutobaseFormOwnProps, InspectionAutobaseFormDispatchProps, InspectionAutobaseFormMergeProps, InspectionAutobaseFormStateProps } from 'components/new/pages/inspection/autobase/form/@types/InspectionAutobaseForm';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { compose } from 'recompose';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { PopupBottomForm, HiddenPageEtsContainer } from './styled/InspectionAutobaseFormStyled';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { isBoolean } from 'util';
import { DivNone } from 'global-styled/global-styled';
import ViewInspectAutobaseWrap from './view_inspect_autobase_form';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import { defaultInspectAutobaseData, makeFilesForFront } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_promise';

const loadingPage = 'InspectionAutobaseForm';
const registryKey = 'inspectAutobase';

const getSelectedInspectAutobase = async (props: InspectionAutobaseFormProps, inspectAutobaseId: InspectAutobase['id']) => {
  const selectedInspectAutobaseNew = await props.actionGetInspectAutobaseById(
    inspectAutobaseId,
    { page: props.loadingPage },
  );

  return selectedInspectAutobaseNew;
};

const checkSearchState = (searchState, setDataInSearch, selectedInspectAutobase) => {
  if (!searchState.carpoolId || !searchState.companyId) {
    setDataInSearch({
      carpoolId: selectedInspectAutobase.base_id,
      companyId: selectedInspectAutobase.company_id,
    });
  }
};

const inspectionAutobaseListDidUpdate = async (props: InspectionAutobaseFormProps, inspectAutobaseId: InspectAutobase['id'], selectedInspectAutobase: InspectAutobase, setSelectedInspectAutobase: React.Dispatch<InspectAutobase>, handleCloseForm: (isSubmitted: boolean) => void) => {
  const currentSelectedId = get(selectedInspectAutobase, 'id', null);

  if (inspectAutobaseId && (currentSelectedId !== inspectAutobaseId)) {
    const selectedInspectAutobaseNew = await getSelectedInspectAutobase(props, inspectAutobaseId);

    if (selectedInspectAutobaseNew) {
      checkSearchState(
        props.searchState,
        props.setDataInSearch,
        selectedInspectAutobaseNew,
      );

      setSelectedInspectAutobase(selectedInspectAutobaseNew);
    } else {
      handleCloseForm(false);
    }
  }
};

const InspectionAutobaseList: React.FC<InspectionAutobaseFormProps> = (props) => {
  const { inspectAutobaseList } = props;
  const [selectedInspectAutobase, setSelectedInspectAutobase] = React.useState<InspectAutobase>(null);
  const inspectAutobaseId = getNumberValueFromSerch(props.match.params.id);

  const handleCloseForm = React.useCallback(
    async (isSubmitted) => {
      props.actionUnselectSelectedRowToShow(registryKey, isBoolean(isSubmitted) ? isSubmitted : false);

      if (isBoolean(isSubmitted) && isSubmitted) {
        const { payload } = await props.registryLoadDataByKey(registryKey);
        const array = get(payload, `list.data.array`, []);

        const inspectAutobaseListNew = array.map((inspectAutobase: InspectAutobase) => {
          inspectAutobase.data = {
            ...(inspectAutobase.data || defaultInspectAutobaseData),
            ...makeFilesForFront(inspectAutobase),
          };

          delete inspectAutobase.data.files;

          return inspectAutobase;
        }).sort((a, b) => a.id - b.id);

        props.actionSetInspectAutobaseInspectAutobaseList(inspectAutobaseListNew);
      }

      props.setParams({
        id: '',
        type: '',
      });
      setSelectedInspectAutobase(null);
    },
    [props.match.url,  props.location.search],
  );

  useEscapeEvent(handleCloseForm);

  React.useEffect(
    () => {
      inspectionAutobaseListDidUpdate(
        props,
        inspectAutobaseId,
        selectedInspectAutobase,
        setSelectedInspectAutobase,
        handleCloseForm,
      );
    }, [props.match.url, props.location.search, inspectAutobaseList, selectedInspectAutobase, inspectAutobaseId],
  );

  return (
    <HiddenPageEtsContainer>
      <PopupBottomForm show={Boolean(selectedInspectAutobase) && Boolean(inspectAutobaseId)}>
      {
          inspectAutobaseId && selectedInspectAutobase
            ? (
              <ViewInspectAutobaseWrap
                selectedInspectAutobase={selectedInspectAutobase}
                onFormHide={handleCloseForm}
                loadingPage={props.loadingPage}
              />
            )
            : (
              <DivNone />
            )
          }
      </PopupBottomForm>
    </HiddenPageEtsContainer>
  );
};

export default compose<InspectionAutobaseFormProps, InspectionAutobaseFormOwnProps>(
  withPreloader({
    page: loadingPage,
    typePreloader: 'mainpage',
  }),
  connect<InspectionAutobaseFormStateProps, InspectionAutobaseFormDispatchProps, InspectionAutobaseFormOwnProps, InspectionAutobaseFormMergeProps, ReduxState>(
    (state) => ({
      inspectAutobaseList: getInspectAutobase(state).inspectAutobaseList,
    }),
    (dispatch: any) => ({
      actionGetInspectAutobaseById: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionGetInspectAutobaseById(...arg),
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
      actionSetInspectAutobaseInspectAutobaseList: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionSetInspectAutobaseInspectAutobaseList(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(InspectionAutobaseList);
