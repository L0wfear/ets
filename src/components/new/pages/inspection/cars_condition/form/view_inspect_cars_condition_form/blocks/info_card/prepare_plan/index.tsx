import * as React from 'react';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import * as TypesCars from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-cars';
import * as TypesHarvestingUnit from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-agregat';
import { CustomTableWrapper } from './styled/styled';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { HrDelimiter } from 'global-styled/global-styled';

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

  const handleChangeTypesCars = React.useCallback(
    (types_cars) => {
      const newTypesCars = types_cars.map((elem) => {
        return {
          ...elem,
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
        return {
          ...elem,
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
        <BoxContainer>
          <h2>
            План подготовки
          </h2>
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
          <HrDelimiter />
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
        </BoxContainer>
      }
    </>
  );
};

export default PreparePlan;
