import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Button, Row } from 'react-bootstrap';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BlockCarsConditionSelectCarList from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/select_car/table/BlockCarsConditionSelectCarList';
import { ExtFieldContainer } from './styled';

type BlockCarsConditionSelectCarOwnProps = {
  carsConditionCarsList: CarsConditionCars[];
  isActiveInspect: boolean;
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

    const handleCreateNewCardCar = React.useCallback(
      () => {
        handleSelectCar('create');
      },
      [handleSelectCar],
    );

    const carsData = React.useMemo(
      () => {
        const carsConditionCarsOptions = carsConditionCarsList.map(
          (carData) => ({
            value: carData.id,
            label: `${carData.gov_number} [${carData.was_resaved ? 'Проверено' : 'Ожидает проверки'}]${carData.fact_status_text ? `[${carData.fact_status_text}]` : ''}`,
            rowData: carData,
          }),
        ).filter(({ value }) => value);

        return {
          carsConditionCarsOptions,
          cars_cnt: carsConditionCarsOptions.length,
          checked_cars_cnt: carsConditionCarsOptions.reduce((summ, { rowData }) => summ + Number(rowData.was_resaved), 0),
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
        <div>
          <span>
            Для добавления информации о ТС, находящейся на базе, но отсутствующей на балансе, необходимо создать отдельную карточку.
            После создания карточка отобразиться в таблице проверенных и требующих проверки ТС в рамках текущей проверки
          </span>
        </div>
        <Button onClick={handleCreateNewCardCar}>Создать карточку</Button>
        <br />
        <Row>
          <BlockCarsConditionSelectCarList
            carsConditionCarsList={carsConditionCarsList}
          />
        </Row>
        <ExtField
          type="string"
          label="Проверено ТС:"
          value={carsData.checked_cars_cnt}
          readOnly
          inline
        />
        <ExtField
          type="string"
          label="Ожидают проверки:"
          value={carsData.cars_cnt}
          readOnly
          inline
        />
      </BoxContainer>
    );
  },
);

export default withSearch<BlockCarsConditionSelectCarOwnProps>(BlockCarsConditionSelectCar);
