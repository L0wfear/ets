import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BlockCarInfo from './BlockCarInfo';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

type BlockCarInfoWrapOwnProps = {
  carsConditionCarsList: CarsConditionCars[];
  handleHide: (isSubmitted: boolean) => void;
  type: keyof typeof INSPECT_TYPE_FORM;

  page: string;
};
type BlockCarInfoWrapProps = (
  BlockCarInfoWrapOwnProps
  & WithSearchProps
);

const BlockCarInfoWrap: React.FC<BlockCarInfoWrapProps> = React.memo(
  (props) => {
    const [selectedCar, setSelectedCar] = React.useState(null);
    const selectedCarsConditionsCar = props.match.params.selectedCarsConditionsCar;
    const inspection_id = getNumberValueFromSerch(props.match.params.id);

    const {
      carsConditionCarsList,
    } = props;

    React.useEffect(
      () => {
        if (selectedCarsConditionsCar === 'create') {
          if (props.type === INSPECT_TYPE_FORM.list) {
            setSelectedCar({
              inspection_id,
            });
          } else {
            props.handleHide(false);
          }
          return;
        }

        const id = getNumberValueFromSerch(selectedCarsConditionsCar);

        if (id && carsConditionCarsList.length) {
          const selectedCarData = carsConditionCarsList.find((carData) => carData.id === id);
          if (selectedCarData) {
            setSelectedCar({
              inspection_id,
              ...selectedCarData,
            });
            return;
          } else {
            props.handleHide(false);
          }
        }
      },
      [selectedCarsConditionsCar, carsConditionCarsList, props.type, inspection_id],
    );

    return (
      selectedCar
        ? (
          <BlockCarInfo
            element={selectedCar}
            handleHide={props.handleHide}
            type={props.type}

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
