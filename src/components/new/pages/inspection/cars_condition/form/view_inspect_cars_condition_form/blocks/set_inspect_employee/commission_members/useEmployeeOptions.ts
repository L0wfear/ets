import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { employeeEmployeeGetSetEmployee } from 'redux-main/reducers/modules/employee/employee/actions';

type UseEmployeeOptionsAns = DefaultSelectOption<Employee['id'], Employee['full_name'], Employee>[];

type UseEmployeeOptions = (
  loadAction: HandleThunkActionCreator<typeof employeeEmployeeGetSetEmployee>,
  page: string,
  path?: string,
) => UseEmployeeOptionsAns;

const useEmployeeOptions: UseEmployeeOptions = (loadAction, page, path) => {
  const [options, setOptions] = React.useState<UseEmployeeOptionsAns>([]);

  React.useEffect(
    () => {
      loadAction({}, { page, path }).then(
        ({ payload: { data } }) => (
          setOptions(
            data.map((rowData) => ({
              value: rowData.id,
              label: rowData.full_name,
              rowData,
            })),
          )
        ),
      ).catch((error) => {
        console.error(error); // tslint:disable-line
      });
    },
    [],
  );

  return options;
};

export default useEmployeeOptions;
