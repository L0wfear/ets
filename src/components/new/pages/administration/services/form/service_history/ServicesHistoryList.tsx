import * as React from 'react';
import { compose } from 'recompose';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getConfig,
} from 'components/new/pages/administration/services/form/service_history/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import { Service } from 'redux-main/reducers/modules/services/@types/services';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359, diffDates } from 'components/@next/@utils/dates/dates';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  service_id: Service['id'];
  service_name: Service['name'];
};
type Props = (
  OwnProps
) & WithSearchProps;

const ServicesHistoryList: React.FC<Props> = (props) => {
  const date_start: string = props.searchState.date_from;
  const date_end: string = props.searchState.date_to;

  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        registryAddInitialData(
          getConfig(
            props.service_id,
            props.service_name,
            date_start || createValidDateTime(getToday0am()),
            date_end || createValidDateTime(getToday2359()),
          ),
        ),
      );
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [props.service_id, props.service_name],
  );

  React.useEffect(
    () => {
      if (date_start && date_end) {
        const date_start_value = date_start || createValidDateTime(getToday0am());
        const date_end_value = date_end || createValidDateTime(getToday2359());

        if (diffDates(date_end_value, date_start_value) > 0) {
          const payload = {
            getRegistryData: {
              date_start: date_start_value,
              date_end: date_end_value,
            },
            getBlobData: {
              format: 'xls',
              date_start: date_start_value,
              date_end: date_end_value,
            },
          };

          dispatch(actionChangeGlobalPaylaodInServiceData(registryKey, payload));
        }
      }
    },
    [date_start, date_end],
  );

  return (
    <Registry registryKey={registryKey} />
  );
};

export default compose<Props, OwnProps>(
  withPreloader<{}>({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  withSearch,
)(ServicesHistoryList);
