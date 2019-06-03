import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { get } from 'lodash';
import { ChangeStatusRequesFormLazyOwnProps } from 'components/new/pages/edc_request/form/changeStatusRequesForm/index';
import {
  RequestHistoryListWrapper,
  RequestHistoryListRegistry,
} from 'components/new/pages/edc_request/form/requestInfo/styled/styled';
import TableMissionsRequest from 'components/new/pages/edc_request/form/requestInfo/table/TableMissionsRequest';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { HandleThunkActionCreator } from "react-redux";

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';

import {
  getConfig,
} from 'components/new/pages/edc_request/form/changeStatusRequesForm/_config-data/registry-config';

type ChangeStatusRequesFormOwnProps = {
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;
  checkedRows: ChangeStatusRequesFormLazyOwnProps['checkedRows'];
  itemToRemove: ChangeStatusRequesFormLazyOwnProps['itemToRemove'];
  contentIndex: ChangeStatusRequesFormLazyOwnProps['contentIndex'];
  element: any; // <<< заменить

  page: string;
  path?: string;
};

type ChangeStatusRequesFormStateProps = {
  edcRequestInfoList: IStateSomeUniq['edcRequestInfoList'];
};

type ChangeStatusRequesFormDispatchProps = {
  actionGetAndSetInStoreEdcRequestInfo: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreEdcRequestInfo>;
  actionResetEdcRequestInfo: HandleThunkActionCreator<typeof someUniqActions.actionResetEdcRequestInfo>;
};

type ChangeStatusRequesFormProps = (
  ChangeStatusRequesFormOwnProps
  & ChangeStatusRequesFormStateProps
  & ChangeStatusRequesFormDispatchProps
);

const ChangeStatusRequesForm: React.FC<ChangeStatusRequesFormProps> = React.memo(
  (props) => {

    const original = false;
    const request_id = get(props, 'element.request_id', '');
    const request_number = get(props, 'element.request_number', '');

    React.useEffect( () => {
      props.actionGetAndSetInStoreEdcRequestInfo({
        id: request_id,
        original,
      }, {page: props.page, path: props.path });
      return () => props.actionResetEdcRequestInfo();
    }, []);

    const setStatusResolve = React.useCallback(() => {
      // console.log('ResolveBtn Cliked');
      // тут делать запрос на бек для изменения статуса заявки
      props.onFormHide(true);
    }, []);

    const titleModal = `Заявка ЕДЦ №${request_number}`;
    const edcRequestInfoListItem = get(props, 'edcRequestInfoList.0', null); // !!!!Пустой!!!
    const registryKeyIndex = 'lastRequestMissionInfo';
    // console.log('ChangeStatusRequesForm___ props', props);

    return (
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={props.onFormHide} backdrop="static" bgsize="medium">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{titleModal}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          <h4>Все прикрепленные задания ЕДЦ №{request_number}</h4>
          <RequestHistoryListWrapper>
            <RequestHistoryListRegistry key={ `RequestHistoryListRegistry_0`}>
              <TableMissionsRequest
                key={`ChangeStatusRequesForm_0`}
                edcRequestInfo={edcRequestInfoListItem}
                index={0}
                original={original}
                getConfig={getConfig}
                registryKeyIndex={registryKeyIndex}
              />
            </RequestHistoryListRegistry>
          </RequestHistoryListWrapper>
          Все децентрализованные задания по заявке ЕДЦ №{request_id} закрыты.
          Установить заявке статус "Решена" или оставить в статусе "В работе"
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={setStatusResolve}>Установить статус "Решена"</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.onFormHide}>Оставить в статусе "В работе"</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<ChangeStatusRequesFormProps, ChangeStatusRequesFormOwnProps>(
  connect<ChangeStatusRequesFormStateProps, ChangeStatusRequesFormDispatchProps, ChangeStatusRequesFormOwnProps, ReduxState>(
    (state) => ({
      edcRequestInfoList: getSomeUniqState(state).edcRequestInfoList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreEdcRequestInfo: (...args) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreEdcRequestInfo(...args),
        )
      ),
      actionResetEdcRequestInfo: (...args) => (
        dispatch(
          someUniqActions.actionResetEdcRequestInfo(...args),
        )
      ),
    }),
  ),
  withSearch,
)(ChangeStatusRequesForm);
