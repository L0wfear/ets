import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/medical_stats/_config-data/registry-config';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359 } from 'components/@next/@utils/dates/dates';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

type OwnProps = {};
type Props = OwnProps & WithSearchProps;

const MedicalStatsList: React.FC<Props> = (props) => {
  const date_from: string = props.searchState.date_from;
  const date_to: string = props.searchState.date_to;
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        registryAddInitialData(
          getToConfig(
            date_from || createValidDateTime(getToday0am()),
            date_to || createValidDateTime(getToday2359()),
          ),
        ),
      );
      return () => {
        dispatch(
          registryRemoveData(registryKey),
        );
      };
    },
    [],
  );

  React.useEffect(
    () => {
      if (date_from && date_to) {
        const payload = {
          getRegistryData: {
            date_from,
            date_to,
          },
          getBlobData: {
            format: 'xls',
            date_from,
            date_to,
          },
        };

        dispatch(
          actionChangeGlobalPaylaodInServiceData(registryKey, payload),
        );
      }
    },
    [date_from, date_to],
  );

  return (
    <Registry registryKey={registryKey} />
  );
};

export default withSearch<OwnProps>(MedicalStatsList);
