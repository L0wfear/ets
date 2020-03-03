import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/user_action_log/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359 } from 'components/@next/@utils/dates/dates';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};
type Props = (
  OwnProps
) & WithSearchProps;

const UserActionLogList: React.FC<Props> = (props) => {
  const date_start: string = props.searchState.date_from;
  const date_end: string = props.searchState.date_to;
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        registryAddInitialData(
          getToConfig(
            date_start || createValidDateTime(getToday0am()),
            date_end || createValidDateTime(getToday2359()),
          ),
        ),
      );
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [],
  );

  React.useEffect(
    () => {
      if (date_start && date_end) {
        const payload = {
          getRegistryData: {
            date_start,
            date_end,
          },
          getBlobData: {
            format: 'xls',
            date_start,
            date_end,
          },
        };

        dispatch(actionChangeGlobalPaylaodInServiceData(registryKey, payload));
      }
    },
    [date_start, date_end],
  );

  return (
    <Registry registryKey={registryKey} />
  );
};

export default withSearch<OwnProps>(UserActionLogList);
