import * as React from 'react';
import { get } from 'lodash';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { InspectionPgmBaseFormProps, InspectionPgmBaseFormOwnProps, InspectionPgmBaseFormDispatchProps, InspectionPgmBaseFormMergeProps, InspectionPgmBaseFormStateProps } from 'components/new/pages/inspection/pgm_base/form/@types/InspectionPgmBaseForm';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { compose } from 'recompose';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { PopupBottomForm, HiddenPageEtsContainer } from './styled/InspectionPgmBaseFormStyled';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { isBoolean } from 'util';
import { DivNone } from 'global-styled/global-styled';
import ViewInspectPgmBaseWrap from './view_inspect_pgm_base_form';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import { defaultInspectPgmBaseData, makeFilesForFront } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_promise';

const loadingPage = 'InspectionPgmBaseForm';
const registryKey = 'inspectPgmBase';

const getSelectedInspectPgmBase = async (props: InspectionPgmBaseFormProps, inspectPgmBaseId: InspectPgmBase['id']) => {
  const selectedInspectPgmBaseNew = await props.actionGetInspectPgmBaseById(
    inspectPgmBaseId,
    { page: props.loadingPage },
  );
  const selectedPgmBase = props.pgmBaseList.find((elem) => parseInt(get(props, 'searchState.pgmBaseId', null), 10) === get(elem, 'id'));

  const selectedInspectPgmBaseNewAdd = {
    ...selectedInspectPgmBaseNew,
    data: {
      ...selectedInspectPgmBaseNew.data,
      address_base: `${selectedPgmBase.address} (${selectedPgmBase.pgm_stores_type_name})`,
      balance_holder_base: selectedPgmBase.company_name,
      operating_base: selectedPgmBase.company_name,
    },
  };
  // <<< data here
  // tslint:disable-next-line:no-console
  console.log('<<< data here selectedInspectPgmBaseNew === ', {selectedInspectPgmBaseNewAdd, props, } );

  return selectedInspectPgmBaseNewAdd;
};

const checkSearchState = (searchState, setDataInSearch, selectedInspectPgmBase) => {
  if (!searchState.pgmBaseId || !searchState.companyId) {
    setDataInSearch({
      pgmBaseId: selectedInspectPgmBase.base_id,
      companyId: selectedInspectPgmBase.company_id,
    });
  }
};

const inspectionPgmBaseListDidUpdate = async (props: InspectionPgmBaseFormProps, inspectPgmBaseId: InspectPgmBase['id'], selectedInspectPgmBase: InspectPgmBase, setSelectedInspectPgmBase: React.Dispatch<InspectPgmBase>, handleCloseForm: (isSubmitted: boolean) => void) => {
  const currentSelectedId = get(selectedInspectPgmBase, 'id', null);

  if (inspectPgmBaseId && (currentSelectedId !== inspectPgmBaseId)) {
    const selectedInspectPgmBaseNew = await getSelectedInspectPgmBase(props, inspectPgmBaseId);

    if (selectedInspectPgmBaseNew) {
      checkSearchState(
        props.searchState,
        props.setDataInSearch,
        selectedInspectPgmBaseNew,
      );

      setSelectedInspectPgmBase(selectedInspectPgmBaseNew);
    } else {
      handleCloseForm(false);
    }
  }
};

const InspectionPgmBaseList: React.FC<InspectionPgmBaseFormProps> = (props) => {
  const { inspectPgmBaseList } = props;
  const [selectedInspectPgmBase, setSelectedInspectPgmBase] = React.useState<InspectPgmBase>(null);
  const inspectPgmBaseId = getNumberValueFromSerch(props.match.params.id);

  const handleCloseForm = React.useCallback(
    async (isSubmitted) => {
      props.actionUnselectSelectedRowToShow(registryKey, isBoolean(isSubmitted) ? isSubmitted : false);

      if (isBoolean(isSubmitted) && isSubmitted) {
        const { payload } = await props.registryLoadDataByKey(registryKey);
        const array = get(payload, `list.data.array`, []);

        const inspectPgmBaseListNew = array.map((inspectPgmBase: InspectPgmBase) => {
          inspectPgmBase.data = {
            ...(inspectPgmBase.data || defaultInspectPgmBaseData),
            ...makeFilesForFront(inspectPgmBase),
          };

          delete inspectPgmBase.data.files;

          return inspectPgmBase;
        }).sort((a, b) => a.id - b.id);

        props.actionSetInspectPgmBaseInspectPgmBaseList(inspectPgmBaseListNew);
      }

      props.setParams({
        id: '',
        type: '',
      });
      setSelectedInspectPgmBase(null);
    },
    [props.match.url,  props.location.search],
  );

  useEscapeEvent(handleCloseForm);

  React.useEffect(
    () => {
      inspectionPgmBaseListDidUpdate(
        props,
        inspectPgmBaseId,
        selectedInspectPgmBase,
        setSelectedInspectPgmBase,
        handleCloseForm,
      );
    }, [props.match.url, props.location.search, inspectPgmBaseList, selectedInspectPgmBase, inspectPgmBaseId],
  );

  return (
    <HiddenPageEtsContainer>
      <PopupBottomForm show={Boolean(selectedInspectPgmBase)}>
      {
          inspectPgmBaseId && selectedInspectPgmBase
            ? (
              <ViewInspectPgmBaseWrap
                selectedInspectPgmBase={selectedInspectPgmBase}
                onFormHide={handleCloseForm}
                loadingPage={props.loadingPage}
                pgmBaseList={props.pgmBaseList}
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

export default compose<InspectionPgmBaseFormProps, InspectionPgmBaseFormOwnProps>(
  withPreloader({
    page: loadingPage,
    typePreloader: 'mainpage',
  }),
  connect<InspectionPgmBaseFormStateProps, InspectionPgmBaseFormDispatchProps, InspectionPgmBaseFormOwnProps, InspectionPgmBaseFormMergeProps, ReduxState>(
    (state) => ({
      inspectPgmBaseList: getInspectPgmBase(state).inspectPgmBaseList,
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
    (dispatch: any) => ({
      actionGetInspectPgmBaseById: (...arg) => (
        dispatch(
          inspectionActions.actionGetInspectPgmBaseById(...arg),
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
      actionSetInspectPgmBaseInspectPgmBaseList: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionSetInspectPgmBaseInspectPgmBaseList(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(InspectionPgmBaseList);
