import * as React from 'react';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import * as TypesCars from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-cars';
import * as TypesHarvestingUnit from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-agregat';
import { CustomTableWrapper } from './styled/styled';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type PreparePlanProps = {
  types_cars: InspectCarsCondition['data']['types_cars'];
  types_harvesting_unit: InspectCarsCondition['data']['types_harvesting_unit'];
  canSavePreparePlanHandler: (value: boolean) => any;
  handleChangeData: (ownObj: Partial<InspectCarsCondition['data']>) => any;

  page: string;
};

const PreparePlan: React.FC<PreparePlanProps> = (props) => {
  const [typesListOpt, setTypesListOpt] = React.useState([]);
  const [canSaveTypesCars, setCanSaveTypesCars] = React.useState(true);
  const [canSaveTypesHarvestingUnit, setCanSaveTypesHarvestingUnit] = React.useState(true);

  const dispatch = etsUseDispatch();
  // componentDidMount
  React.useEffect(() => {
    dispatch(
      autobaseGetSetCarFuncTypes(
        {},
        props,
      ),
    ).then(
      ({ data }) => {
        setTypesListOpt(
          data.map(
            (rowData) => ({
              label: rowData.short_name,
              value: rowData.short_name,
              rowData,
            }),
          ),
        );
      },
    );
    props.canSavePreparePlanHandler(
      canSaveTypesCars && canSaveTypesHarvestingUnit,
    );
  }, []);

  const stringToFloat = React.useCallback((value: string) => {
      return value
        ? parseFloat(value)
        : value;
    },
  []);

  const handleChangeTypesCars = React.useCallback(
    (types_cars) => {
      const newTypesCars = types_cars.map((elem) => {
        const allseason_use_cnt = stringToFloat(elem.allseason_use_cnt);
        const checks_period_use_cnt = stringToFloat(elem.checks_period_use_cnt);
        const will_checked_cnt = stringToFloat(elem.will_checked_cnt);

        return {
          ...elem,
          allseason_use_cnt,
          checks_period_use_cnt,
          will_checked_cnt,
        };
      });

      props.handleChangeData({
        types_cars: newTypesCars,
      });
    },
    [props.handleChangeData],
  );
  const handleChangeTypesHarvestingUnit = React.useCallback(
    (types_harvesting_unit) => {
      const newTypesHarvestingUnit = types_harvesting_unit.map((elem) => {
        const ready_cnt = stringToFloat(elem.ready_cnt);
        const not_ready_cnt = stringToFloat(elem.not_ready_cnt);
        const will_checked_cnt = stringToFloat(elem.will_checked_cnt);

        return {
          ...elem,
          ready_cnt,
          not_ready_cnt,
          will_checked_cnt,
        };
      });
      props.handleChangeData({
        types_harvesting_unit: newTypesHarvestingUnit,
      });
    },
    [props.handleChangeData],
  );

  const handleValidityTypesCars = React.useCallback(
    ({ isValidInput: canSaveTypesCarsNew }) => {
      setCanSaveTypesCars(canSaveTypesCarsNew);

      props.canSavePreparePlanHandler(
        canSaveTypesCarsNew && canSaveTypesHarvestingUnit,
      );
    },
    [canSaveTypesHarvestingUnit],
  );

  const handleValidityTypesHarvestingUnit = React.useCallback(
    ({ isValidInput: canSaveTypesHarvestingUnitNew }) => {
      setCanSaveTypesHarvestingUnit(canSaveTypesHarvestingUnitNew);
      props.canSavePreparePlanHandler(
        canSaveTypesCars && canSaveTypesHarvestingUnitNew,
      );
    },
    [canSaveTypesCars],
  );

  return(
    <>
      {
        <div>
          <h3>
            План подготовки
          </h3>
          <CustomTableWrapper>
            <DataTableInput
              tableSchema={TypesCars.meta}
              renderers={TypesCars.renderers}
              validationSchema={TypesCars.validationSchema}
              addButtonLabel="Добавить тип"
              removeButtonLable="Удалить тип"
              stackOrder
              onChange={handleChangeTypesCars}
              inputList={props.types_cars}
              path="cars_condition-prepare_plan"
              isPermitted={Boolean(typesListOpt.length)}
              onValidation={handleValidityTypesCars}
              selectField="customId"
              typesListOpt={typesListOpt}
              tableTitle="План подготовки ТС"
              {...props}
            />
          </CustomTableWrapper>
          <CustomTableWrapper>
            <DataTableInput
              tableSchema={TypesHarvestingUnit.meta}
              renderers={TypesHarvestingUnit.renderers}
              validationSchema={TypesHarvestingUnit.validationSchema}
              addButtonLabel="Добавить тип"
              removeButtonLable="Удалить тип"
              stackOrder
              onChange={handleChangeTypesHarvestingUnit}
              inputList={props.types_harvesting_unit}
              path="cars_condition-prepare_plan"
              isPermitted={true}
              onValidation={handleValidityTypesHarvestingUnit}
              selectField="customId"
              tableTitle='План и проверка готовности к сезону прицепных, навесных и уборочных агрегатов'
              {...props}
            />
          </CustomTableWrapper>
        </div>
      }
    </>
  );
};

export default PreparePlan;
