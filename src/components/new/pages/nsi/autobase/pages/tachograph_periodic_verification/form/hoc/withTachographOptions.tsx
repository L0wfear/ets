import { uniqBy } from 'lodash';
import * as React from 'react';
import { TachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { FormWithHandleChange } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { actionGetTachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type WithTachographOptionsFormState = {
  tachograph_brand_id: number;
  factory_number: string;
};
export type WithTachographProps = {
  formState: WithTachographOptionsFormState;
  handleChange: FormWithHandleChange<WithTachographOptionsFormState>;
  meta: {
    page: string;
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
      meta: { page },
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
    const dispatch = etsUseDispatch();
    React.useEffect(() => {
      (async () => {
        const tachographBrandNameList = await dispatch(await actionGetTachographList(
          {},
          { page }
        ));
        setTachographBrandNameList(tachographBrandNameList.data);
      })();
    }, []);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        const tachographBrandNamesIdsUniqedByName = uniqBy(tachographBrandNameList, 'tachograph_brand_name').map((el) => el.id);
        const currentBrandName = tachographBrandNameList.find((el) => el.id === state.tachograph_brand_id)?.tachograph_brand_name;
        const tachographBrandNameOptions 
          = uniqBy(
            tachographBrandNameList?.map((rowData) => ({
              value: rowData.id,
              label: rowData.tachograph_brand_name,
              rowData,
              isNotVisible: !tachographBrandNamesIdsUniqedByName.includes(rowData.id) || rowData.tachograph_brand_name === currentBrandName
            })),
            'value'
          ) ?? [];
        setTachographBrandNameOptions(tachographBrandNameOptions);
      }
    }, [tachographBrandNameList, state.tachograph_brand_id]);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        const tachograph_brand_name = tachographBrandNameList.find(
          (el) => el.id === state.tachograph_brand_id
        )?.tachograph_brand_name;
        const dataList = state.tachograph_brand_id
          ? tachographBrandNameList.filter(
            (el) => el.tachograph_brand_name === tachograph_brand_name
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
        const tachograph_brand_id = tachographBrandNameOptions.find(
          (el) => el.rowData.factory_number === state.factory_number
        )?.value;

        if ((!state.tachograph_brand_id || state.tachograph_brand_id !== tachograph_brand_id) && state.factory_number) {
          handleChange('tachograph_brand_id', tachograph_brand_id);
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
    ]);

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
