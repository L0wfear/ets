import { Car } from "redux-main/reducers/modules/autobase/@types/autobase.h";
import { get } from 'lodash';

export const carActualOptionLabelGarage = ( // <рег номер ТС [гаражный номер/Марка шасси/Модель/Тип ТС]>
    rowData: Car,
) => {
    const gov_number = get(rowData, 'gov_number'); // рег номер ТС
    const garage_number = get(rowData, 'garage_number'); // гаражный номер
    const model_name = get(rowData, 'model_name'); // Марка шасси
    const special_model_name = get(rowData, 'special_model_name'); // Модель
    const type_name = get(rowData, 'type_name'); // Тип ТС

    return `${gov_number} [${garage_number || ''}${ garage_number ? '/' : ''}${model_name || ''}${ model_name ? '/' : ''}${special_model_name || ''}${type_name ? '/' : ''}${type_name || ''}]`;
};
