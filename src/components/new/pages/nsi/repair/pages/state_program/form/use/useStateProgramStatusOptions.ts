import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { actionLoadStateProgramStatus } from 'redux-main/reducers/modules/repair/state_program_status/actions_state_program_status';
import { StateProgramStatus } from 'redux-main/reducers/modules/repair/state_program_status/@types/stateProgramStatus';

type UseTechnicalOperationOptionsAns = DefaultSelectListMapper<StateProgramStatus>;

type UseTechnicalOperationOptions = (
  loadActions: HandleThunkActionCreator<typeof actionLoadStateProgramStatus>,
  page: string,
  path: string,
) => UseTechnicalOperationOptionsAns;

const useStateProgramStatusOptions: UseTechnicalOperationOptions = (loadActions, page, path) => {
  const [options, setOptions] = React.useState<UseTechnicalOperationOptionsAns>([]);

  React.useEffect(
    () => {
      loadActions({}, { page, path }).then(
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
