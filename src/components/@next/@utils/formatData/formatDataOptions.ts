import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

// <рег номер ТС [гаражный номер/Марка шасси/Модель/Тип ТС]>
export const carActualOptionLabelGarage = (
  rowData: Car,
) => {
  const gov_number = rowData?.gov_number;                   // рег номер ТС
  const garage_number = rowData?.garage_number;             // гаражный номер
  const model_name = rowData?.model_name;                   // Марка шасси
  const special_model_name = rowData?.special_model_name;   // Модель
  const type_name = rowData?.type_name;                     // Тип ТС

  return `${gov_number} [${garage_number || ''}${ garage_number ? '/' : ''}${model_name || ''}${ model_name ? '/' : ''}${special_model_name || ''}${type_name ? '/' : ''}${type_name || ''}]`;
};
