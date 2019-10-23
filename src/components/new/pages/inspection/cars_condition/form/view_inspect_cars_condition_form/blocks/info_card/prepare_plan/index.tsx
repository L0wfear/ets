import * as React from 'react';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import * as TypesCars from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-cars';
import * as TypesHarvestingUnit from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-agregat';
import { CustomTableWrapper } from './styled/styled';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { HrDelimiter, FooterEnd } from 'global-styled/global-styled';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { actionUpdatePreparePlan } from 'redux-main/reducers/modules/inspect/inspect_actions';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

type PreparePlanProps = {
  types_cars: InspectCarsCondition['data']['types_cars'];
  types_harvesting_unit: InspectCarsCondition['data']['types_harvesting_unit'];
  canSavePreparePlanHandler: (value: boolean) => any;
  handleChangeData: (ownObj: Partial<InspectCarsCondition['data']>) => any;
  inspectType: keyof typeof INSPECT_TYPE_FORM;
  isPermitted: boolean;

  page: string;
};

type Props = (
  PreparePlanProps
  & WithSearchProps
);

const PreparePlan: React.FC<Props> = (props) => {
  const [typesListOpt, setTypesListOpt] = React.useState([]);
  const [canSaveTypesCars, setCanSaveTypesCars] = React.useState(true);
  const [canSaveTypesHarvestingUnit, setCanSaveTypesHarvestingUnit] = React.useState(true);
  const [originTypesCars, setOriginTypesCars] = React.useState(null);
  const [originTypesHarvestingUnit, setOriginTypesHarvestingUnit] = React.useState(null);

  const dispatch = etsUseDispatch();

  const inspectId = getNumberValueFromSerch(props.match.params.id);

  const handleClose = React.useCallback(
    async () => {
      if (originTypesCars !== props.types_cars || originTypesHarvestingUnit !== props.types_harvesting_unit ) {
        try {
          await global.confirmDialog({
            title: 'Покинуть страницу?',
            body: 'Возможно, внесенные изменения не сохранятся.',
            okName: 'Закрыть',
            cancelName: 'Остаться',
          });
        } catch {
          return;
        }
      }

      props.handleChangeData({
        types_cars: originTypesCars,
        types_harvesting_unit: originTypesHarvestingUnit,
      });

      props.setParams({
        typeRightView: null,
        selectedCarsConditionsCar: null,
      });
    },
    [props.setParams, props.match.params, originTypesCars,
      originTypesHarvestingUnit, props.types_cars, props.types_harvesting_unit],
  );

  const handleSave = React.useCallback(
    () => {
      dispatch(
        actionUpdatePreparePlan(
          inspectId,
          {
            page: props.page,
          },
          {
            types_cars: props.types_cars,
            types_harvesting_unit: props.types_harvesting_unit,
          },
        ),
      ).then(() => {
        props.setParams({
          typeRightView: null,
          selectedCarsConditionsCar: null,
        });
      });
    },
    [
      props.types_cars, props.page, inspectId, props.match.params,
      props.match.url, props.location.search, props.setParams, props.types_harvesting_unit,
    ],
  );
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
        setOriginTypesCars(props.types_cars);
        setOriginTypesHarvestingUnit(props.types_harvesting_unit);
      },
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
    [props.handleChangeData, canSaveTypesCars, canSaveTypesHarvestingUnit],
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
    [props.handleChangeData, canSaveTypesCars, canSaveTypesHarvestingUnit],
  );

  const handleValidityTypesCars = React.useCallback(
    ({ isValidInput: canSaveTypesCarsNew }) => {
      setCanSaveTypesCars(canSaveTypesCarsNew);
    },
    [canSaveTypesHarvestingUnit, canSaveTypesCars],
  );

  const handleValidityTypesHarvestingUnit = React.useCallback(
    ({ isValidInput: canSaveTypesHarvestingUnitNew }) => {
      setCanSaveTypesHarvestingUnit(canSaveTypesHarvestingUnitNew);
    },
    [canSaveTypesCars, canSaveTypesHarvestingUnit],
  );

  React.useEffect(() => {
      props.canSavePreparePlanHandler(canSaveTypesCars && canSaveTypesHarvestingUnit);
    },
    [canSaveTypesCars, canSaveTypesHarvestingUnit],
  );

  return(
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
          hideButtons={true}
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
          hideButtons={true}
          {...props}
        />
      </CustomTableWrapper>
      <FooterEnd>
        {
          props.isPermitted &&
            <EtsBootstrap.Button disabled={ props.isPermitted && (!canSaveTypesCars || !canSaveTypesHarvestingUnit) } onClick={handleSave}>
              Сохранить
            </EtsBootstrap.Button>
        }
        <EtsBootstrap.Button onClick={handleClose}>
          Закрыть
        </EtsBootstrap.Button>
      </FooterEnd>
    </BoxContainer>
  );
};

export default withSearch<PreparePlanProps>(PreparePlan);
