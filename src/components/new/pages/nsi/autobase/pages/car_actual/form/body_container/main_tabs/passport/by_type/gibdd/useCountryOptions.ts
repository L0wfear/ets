import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { actionLoadCountry } from 'redux-main/reducers/modules/some_uniq/country/actions';
import { Country } from 'redux-main/reducers/modules/some_uniq/country/@types';

type UseCountryOptionsAns = {
  countryOptions: DefaultSelectOption<Country['id'], Country['short_name'], Country>[],
};

type UseCountryOptions = (
  loadCountry: HandleThunkActionCreator<typeof actionLoadCountry>,
  page: string,
  path: string,
) => UseCountryOptionsAns;

const useCountryOptions: UseCountryOptions = (loadCountry, page, path) => {
  const [countryOptions, setCountryList] = React.useState<DefaultSelectOption<Country['id'], Country['short_name'], Country>[]>([]);

  React.useEffect(
    () => {
      loadCountry({}, { page, path }).then(
        (countryList) => (
          setCountryList(
            countryList.map((rowData) => ({
              value: rowData.id,
              label: rowData.short_name,
              rowData,
            })),
          )
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return {
    countryOptions,
  };
};

export default useCountryOptions;
