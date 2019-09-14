import * as React from 'react';
import { defaultSelectListMapper, DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { actionLoadStateProgramStatus } from 'redux-main/reducers/modules/repair/state_program_status/actions_state_program_status';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { StateProgramStatus } from 'redux-main/reducers/modules/repair/state_program_status/@types/stateProgramStatus';

const useStateProgramStatusOptions = (meta: LoadingMeta) => {
  const [options, setOptions] = React.useState<DefaultSelectListMapper<StateProgramStatus>>([]);
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        actionLoadStateProgramStatus({}, meta),
      ).then(
        (result) => (
          setOptions(
            result.map(defaultSelectListMapper),
          )
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return options;
};

export default useStateProgramStatusOptions;
