import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  getConfig,
  getRegistryKey,
} from 'components/new/pages/edc_request/form/requestInfo/table/_config_data/registry-config';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';
import { get } from 'lodash';
import { createValidDateDots } from 'utils/dates';
import { HandleThunkActionCreator } from "react-redux";
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { RequestHistoryCreateDate } from 'components/new/pages/edc_request/form/requestInfo/styled/styled';
import { connect } from 'react-redux';

export type TableMissionsRequestStateProps = {};
export type TableMissionsRequestDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};

export type TableMissionsRequestOwnProps = {
  key: number;
  edcRequestInfo: EdcRequestInfo;
  index: number;
};

export type TableMissionsRequestProps = (
  TableMissionsRequestStateProps
  & TableMissionsRequestDispatchProps
  & TableMissionsRequestOwnProps
);

const TableMissionsRequest: React.FC<TableMissionsRequestProps> = React.memo(
  (props) => {
    const missionsList = get(props, 'edcRequestInfo.missions', null);
    const edc_date = get(props, 'edcRequestInfo.edc_date', null);

    const registryKeyIndex = getRegistryKey(props.index);

    React.useEffect(
      () => {
        props.registryAddInitialData(
          getConfig(
            missionsList,
            props.index,
          ),
        );
        return () => {
          props.registryRemoveData(registryKeyIndex);
        };
      },
      [],
    );

    const date_text = `Ранее завершенные работы по заявке от ${createValidDateDots(edc_date)}:`;

    return (
      <React.Fragment>
        <RequestHistoryCreateDate>{date_text}</RequestHistoryCreateDate>
        <Registry registryKey={registryKeyIndex} ></Registry>
      </React.Fragment>
    );
  },
);

export default compose<TableMissionsRequestProps, TableMissionsRequestOwnProps>(
  connect<TableMissionsRequestStateProps, TableMissionsRequestDispatchProps, TableMissionsRequestOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      registryAddInitialData: (...any) => (
        dispatch(
          registryAddInitialData(...any),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
    }),
  ),
)(TableMissionsRequest);
