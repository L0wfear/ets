import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BlockCarInfo from './BlockCarInfo';

type BlockCarInfoWrapOwnProps = {
  carsConditionCarsList: CarsConditionCars[];
  handleHide: (isSubmitted: boolean) => void;

  page: string;
};
type BlockCarInfoWrapProps = (
  BlockCarInfoWrapOwnProps
  & WithSearchProps
);

const emptyElement = {};

const BlockCarInfoWrap: React.FC<BlockCarInfoWrapProps> = React.memo(
  (props) => {
    const [selectedCar, setSelectedCar] = React.useState(null);
    const selectedCarsConditionsCar = props.match.params.selectedCarsConditionsCar;

    const {
      carsConditionCarsList,
    } = props;

    React.useEffect(
      () => {
        if (selectedCarsConditionsCar === 'create') {
          setSelectedCar(emptyElement);
          return;
        }

        const id = getNumberValueFromSerch(selectedCarsConditionsCar);

        if (id && carsConditionCarsList.length) {
          const selectedCarData = carsConditionCarsList.find((carData) => carData.id === id);
          if (selectedCarData) {
            setSelectedCar(selectedCarData);
            return;
          } else {
            props.handleHide(false);
          }
        }
      },
      [selectedCarsConditionsCar, carsConditionCarsList],
    );

    return (
      selectedCar
        ? (
          <BlockCarInfo
            element={selectedCar}
            handleHide={props.handleHide}

            page={props.page}
            path="car_info-data"
          />
        )
        : (
          <DivNone />
        )
    );
  },
);

export default withSearch<BlockCarInfoWrapOwnProps>(BlockCarInfoWrap);
