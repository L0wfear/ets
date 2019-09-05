import * as React from 'react';

import useForm from "components/@next/@form/hook_selectors/useForm";
import { WaybillFormStoreType } from "components/new/pages/waybill/form/context/@types";
import useRefillTypeList from 'components/new/utils/hooks/services/useList/useRefillTypeList';
import { Waybill } from "redux-main/reducers/modules/waybill/@types";

export const useWaybillLoadCarRefillType = (formDataKey: string) => {
  const store = useForm.useFormDataStore<Waybill, WaybillFormStoreType>(formDataKey);

  useForm.useFormDataLoadOptions<WaybillFormStoreType, 'refillTypeList'>(
    formDataKey,
    'refillTypeList',
    useRefillTypeList(),
  );

  useForm.useFormDataLoadOptions<WaybillFormStoreType, 'refillTypeOptions'>(
    formDataKey,
    'refillTypeOptions',
    React.useMemo(
      () => {
        const options = store.refillTypeList.list.map(
          (rowData) => ({
            value: rowData.id,
            label: rowData.name,
            isNotVisible: !rowData.is_selectable,
            rowData,
          }),
        );

        return {
          options,
          isLoading: store.refillTypeList.isLoading,
        };
      },
      [
        store.refillTypeList,
      ],
    ),
  );
};
