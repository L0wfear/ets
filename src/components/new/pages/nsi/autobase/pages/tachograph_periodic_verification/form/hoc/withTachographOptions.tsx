import { uniqBy } from 'lodash';
import * as React from 'react';
import { TachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { FormWithHandleChange } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { actionGetAndSetInStoreTachographList, actionResetTachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { TachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { createValidDate, dateInPeriod } from 'components/@next/@utils/dates/dates';

type WithTachographOptionsFormState = TachographMetrologicalVerification & Tachograph & TachographRepair;
export type WithTachographProps = {
  formState: WithTachographOptionsFormState;
  handleChange: FormWithHandleChange<WithTachographOptionsFormState>;
  meta: {
    page: string;
    path: string;
  };
};

export type WithTachographOptionsComponentProps = {
  tachographBrandNameOptions: Array<
    DefaultSelectOption<string | number, string, TachographList>
  >;
  tachographFactoryNumberOptions: Array<
    DefaultSelectOption<string | number, string, TachographList>
  >;
  tachographBrandNameList: Array<TachographList>;
};

const withTachographOptions = (
  Component: React.ComponentType<WithTachographOptionsComponentProps>
): React.FC<WithTachographProps> =>
  React.memo((props) => {
    const {
      formState: state,
      handleChange,
      meta: { page, path },
    } = props;

    const [
      tachographBrandNameOptions,
      setTachographBrandNameOptions,
    ] = React.useState<
      Array<DefaultSelectOption<string | number, string, TachographList>>
    >([]);
    const [
      tachographFactoryNumberOptions,
      setTachographFactoryNumberOptions,
    ] = React.useState<
      Array<DefaultSelectOption<string | number, string, TachographList>>
    >([]);
    const [
      tachographBrandNameList,
      setTachographBrandNameList,
    ] = React.useState<Array<TachographList>>([]);
    const dateOfEvent = React.useMemo(
      () => createValidDate(state.repair_date || state.verification_date || state.calibration_date), 
      [state.repair_date, state.verification_date, state.calibration_date]);
    const dispatch = etsUseDispatch();
    React.useEffect(() => {
      (async () => {
        const tachographBrandNameList = await dispatch(await actionGetAndSetInStoreTachographList(
          {},
          { page, path }
        ));
        setTachographBrandNameList(tachographBrandNameList.data);
        return () => {
          dispatch(actionResetTachographList());
        };
      })();
    }, []);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        const tachographBrandNamesIdsUniqedByName = uniqBy(tachographBrandNameList, 'tachograph_brand_name').map((el) => el.id);
        const currentBrandName = tachographBrandNameList.find((el) => el.factory_number === state.factory_number)?.tachograph_brand_name;
        const tachographBrandNameOptions 
          = tachographBrandNameList?.map((rowData) => ({
            value: rowData.tachograph_brand_id,
            label: rowData.tachograph_brand_name,
            rowData,
            isNotVisible: !tachographBrandNamesIdsUniqedByName.includes(rowData.id) || rowData.tachograph_brand_name === currentBrandName
          })) ?? [];
        setTachographBrandNameOptions(tachographBrandNameOptions);
      }
    }, [tachographBrandNameList, state.tachograph_brand_id, state.factory_number]);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        const dataList = state.tachograph_brand_id
          ? tachographBrandNameList.filter(
            (el) => el.tachograph_brand_id === state.tachograph_brand_id
          )
          : tachographBrandNameList;

        const tachographFactoryNumberOptions = dataList.map(
          (rowData) => ({
            value: rowData.factory_number,
            label: rowData.factory_number,
            rowData
          })
        );
        setTachographFactoryNumberOptions(tachographFactoryNumberOptions);
        const tachograph_id = tachographBrandNameOptions.find(
          (el) => el.rowData.factory_number === state.factory_number
        )?.rowData.id;
        const tachograph_brand_id = +tachographBrandNameOptions.find(
          (el) => el.rowData.id === tachograph_id
        )?.value;
        const objChage = {
          tachograph_id,
          tachograph_brand_id,
        };
        if ((!state.tachograph_brand_id || state.tachograph_id !== tachograph_id) && state.factory_number) {
          handleChange(objChage);
        }
        if (state.tachograph_brand_id) {
          if (
            !tachographFactoryNumberOptions.find(
              (el) => el.value === state.factory_number
            )
          ) {
            handleChange('factory_number', null);
          }
        }
      }
    }, [
      state.tachograph_brand_id,
      state.factory_number,
      tachographBrandNameList,
      tachographBrandNameOptions,
      state.tachograph_id,
    ]);

    React.useEffect(() => {
      let gov_number = null;
      if (state.factory_number && dateOfEvent) {
        const tachograph_on_car
          = tachographBrandNameList?.find(
            ({ factory_number }) => factory_number === state.factory_number
          )?.tachograph_on_car || [];
        gov_number = tachograph_on_car.find((el) =>
          dateInPeriod(
            el.installed_at,
            el.uninstalled_at || dateOfEvent,
            dateOfEvent,
            { excludeEnd: false, excludeStart: !el.uninstalled_at }
          )
        )?.gov_number;
      }
      handleChange('gov_number', gov_number);
    }, [state.factory_number, dateOfEvent, tachographBrandNameList]);

    return (
      <Component
        tachographBrandNameOptions={tachographBrandNameOptions}
        tachographFactoryNumberOptions={tachographFactoryNumberOptions}
        tachographBrandNameList={tachographBrandNameList}
        {...props}
      />
    );
  });

export default withTachographOptions;
