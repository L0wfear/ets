import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { CarsConditionCars, InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BlockCarsConditionSelectCarList from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/select_car/table/BlockCarsConditionSelectCarList';
import { ExtFieldContainer } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { get } from 'lodash';
import { monitoringKindSeasonReadiness } from 'components/new/pages/inspection/cars_condition/components/select_data/constants';
import ButtonShowTableForm from 'components/new/pages/inspection/cars_condition/components/button_inspect_cars_condition/ButtonShowTableForm';

type BlockCarsConditionSelectCarOwnProps = {
  cars_cnt: InspectCarsCondition['cars_cnt'];
  checked_cars_cnt: InspectCarsCondition['checked_cars_cnt'];
  error_checked_cars_cnt: string;
  carsConditionCarsList: CarsConditionCars[];
  isActiveInspect: boolean;
  isPermitted: boolean;
  loadingPage?: string;
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

    const getSelectedCarsConditionsCar = getNumberValueFromSerch(props.match.params.selectedCarsConditionsCar);

    const selectedCarsConditionsCar = isNaN(getSelectedCarsConditionsCar)
      ? props.match.params.selectedCarsConditionsCar
      : getSelectedCarsConditionsCar;

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
        );

        return {
          carsConditionCarsOptions,
        };
      },
      [carsConditionCarsList],
    );
    const monitoringKind = get(props, 'searchState.monitoringKind', null);
    const showCreateBtn = props.isActiveInspect && monitoringKindSeasonReadiness.key !== monitoringKind;
    return (
      <BoxContainer>
        <h4>Выбор ТС для просмотра карточки</h4>
        <ButtonShowTableForm loadingPage={props.loadingPage} />
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
        {
          monitoringKindSeasonReadiness.key !== monitoringKind &&
          (
            <p>
              <span>
                Для добавления информации о ТС, находящейся на базе, но отсутствующей на балансе, необходимо создать отдельную карточку.
                После создания карточка отобразиться в таблице проверенных и требующих проверки ТС в рамках текущей проверки
              </span>
            </p>
          )
        }
        {
          showCreateBtn &&
          (
            <EtsBootstrap.Button disabled={!props.isPermitted} onClick={handleCreateNewCardCar}>
              Создать карточку
            </EtsBootstrap.Button>
          )
        }
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
        <ErrorsBlock
          error={props.error_checked_cars_cnt}
        />
      </BoxContainer>
    );
  },
);

export default withSearch<BlockCarsConditionSelectCarOwnProps>(BlockCarsConditionSelectCar);
