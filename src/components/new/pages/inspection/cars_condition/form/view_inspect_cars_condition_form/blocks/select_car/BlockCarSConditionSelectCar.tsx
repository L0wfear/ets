import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { CarsConditionCars, InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BlockCarsConditionSelectCarList from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/select_car/table/BlockCarsConditionSelectCarList';
import { ExtFieldContainer } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type BlockCarsConditionSelectCarOwnProps = {
  cars_cnt: InspectCarsCondition['cars_cnt'];
  checked_cars_cnt: InspectCarsCondition['checked_cars_cnt'];
  error_checked_cars_cnt: string;
  carsConditionCarsList: CarsConditionCars[];
  isActiveInspect: boolean;
  isPermitted: boolean;
};

type BlockCarsConditionSelectCarProps = (
  BlockCarsConditionSelectCarOwnProps
  & WithSearchProps
);

const BlockCarsConditionSelectCar: React.FC<BlockCarsConditionSelectCarProps> = React.memo(
  (props) => {
    const {
      carsConditionCarsList,
    } = props;

    const selectedCarsConditionsCar = getNumberValueFromSerch(props.match.params.selectedCarsConditionsCar);

    const handleSelectCar = React.useCallback(
      (car_id) => {
        if (car_id) {
          props.setParams({
            selectedCarsConditionsCar: car_id,
            typeRightView: 'car_info',
          });
        } else {
          props.setParams({
            selectedCarsConditionsCar: null,
            typeRightView: null,
          });
        }
      },
      [props.setParams],
    );

    const carsData = React.useMemo(
      () => {
        const carsConditionCarsOptions = carsConditionCarsList.map(
          (carData) => ({
            value: carData.id,
            label: `${carData.gov_number} [${carData.was_resaved ? 'Проверено' : 'Ожидает проверки'}]${carData.fact_status_text ? `[${carData.fact_status_text}]` : ''}`,
            rowData: carData,
          }),
        );

        return {
          carsConditionCarsOptions,
        };
      },
      [carsConditionCarsList],
    );

    return (
      <BoxContainer>
        <h4>Выбор ТС для просмотра карточки</h4>
        <div>
          <span>Введите гос. номер транспортного средства для отображения соответствующей карточки в окно поиска или выберите нужную ТС в таблице</span>
        </div>
        <ExtFieldContainer>
          <ExtField
            id="selected_car"
            type="select"
            value={selectedCarsConditionsCar}
            options={carsData.carsConditionCarsOptions}
            onChange={handleSelectCar}
          />
        </ExtFieldContainer>
        <EtsBootstrap.Row>
          <BlockCarsConditionSelectCarList
            carsConditionCarsList={carsConditionCarsList}
          />
        </EtsBootstrap.Row>
        <ExtField
          type="string"
          label="Проверено ТС:"
          value={props.checked_cars_cnt}
          readOnly
          inline
        />
        <ExtField
          type="string"
          label="Ожидают проверки:"
          value={props.cars_cnt}
          readOnly
          inline
          error="hello"
        />
        <span className="error">{props.error_checked_cars_cnt}</span>
      </BoxContainer>
    );
  },
);

export default withSearch<BlockCarsConditionSelectCarOwnProps>(BlockCarsConditionSelectCar);
