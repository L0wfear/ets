import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import { InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

type UseCarsConditionCarsOptionsAns = {
  carsConditionCarsList: CarsConditionCars[],
};

type UseCarsConditionCarsOptions = (
  loadCarsConditionCars: HandleThunkActionCreator<typeof inspectionCarsConditionActions.autobaseGetCarsConditionCars>,
  inspection_id: InspectCarsCondition['id'],
  page: string,
  path: string,
) => UseCarsConditionCarsOptionsAns;

const useCarsConditionGetCars: UseCarsConditionCarsOptions = (loadCarsConditionCars, inspection_id, page, path) => {
  const [carsConditionCarsList, setCarsConditionCarsList] = React.useState<CarsConditionCars[]>([]);

  React.useEffect(
    () => {
      loadCarsConditionCars(inspection_id, { page, path }).then(
        (result) => (
          setCarsConditionCarsList(result)
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return {
    carsConditionCarsList,
  };
};

export default useCarsConditionGetCars;
