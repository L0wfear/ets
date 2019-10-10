import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { CarsConditionCars, InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BlockCarsConditionSelectCarList from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/select_car/table/BlockCarsConditionSelectCarList';
import { ExtFieldContainer, GreyTextContainer, SelectCarConditionTitleWrapper, CarConditionTitle } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { monitoringKindSeasonReadiness } from 'components/new/pages/inspection/cars_condition/components/select_data/constants';
import ButtonShowTableForm from 'components/new/pages/inspection/cars_condition/components/button_inspect_cars_condition/ButtonShowTableForm';
import { canCreateCarInCondition } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/utils';
import { HrDelimiter } from 'global-styled/global-styled';

type BlockCarsConditionSelectCarOwnProps = {
  monitoring_kind: InspectCarsCondition['monitoring_kind'];
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
      monitoring_kind,
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
      [props.setParams, props.searchState],
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
    const showCreateBtn = canCreateCarInCondition(monitoring_kind, props.isActiveInspect);

    const disableCreateBtn = Boolean(props.match.params.selectedCarsConditionsCar);

    return (
      <BoxContainer>
        <SelectCarConditionTitleWrapper>
          <CarConditionTitle>Выбор ТС для просмотра карточки</CarConditionTitle>
          <ButtonShowTableForm loadingPage={props.loadingPage} />
        </SelectCarConditionTitleWrapper>

        <GreyTextContainer>
          <p>
            Введите гос. номер транспортного средства для отображения соответствующей карточки в окно поиска или выберите нужную ТС в таблице
          </p>
        </GreyTextContainer>
        <ExtFieldContainer>
          <ExtField
            id="selected_car"
            type="select"
            value={selectedCarsConditionsCar}
            options={carsData.carsConditionCarsOptions}
            onChange={handleSelectCar}
            label={false}
          />
        </ExtFieldContainer>
        {
          monitoringKindSeasonReadiness.key !== monitoring_kind &&
          (
            <React.Fragment>
              <HrDelimiter />
              <GreyTextContainer>
                <p>
                  Для добавления информации о ТС, находящейся на базе, но отсутствующей на балансе, необходимо создать отдельную карточку.
                  После создания карточка отобразиться в таблице проверенных и требующих проверки ТС в рамках текущей проверки
                </p>
              </GreyTextContainer>
            </React.Fragment>
          )
        }
        {
          showCreateBtn &&
          (
            <EtsBootstrap.Button disabled={!props.isPermitted || disableCreateBtn} onClick={handleCreateNewCardCar}>
              Создать карточку
            </EtsBootstrap.Button>
          )
        }
        <HrDelimiter />
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
        />
        <ErrorsBlock
          error={props.error_checked_cars_cnt}
        />
      </BoxContainer>
    );
  },
);

export default withSearch<BlockCarsConditionSelectCarOwnProps>(BlockCarsConditionSelectCar);
