import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const makeCarOptionLabel = (car: Car | null) => (
  car
    ? (
      `${car.gov_number} [${car.model_name || ''}${car.model_name ? '/' : ''}${car.special_model_name || ''}${car.type_name ? '/' : ''}${car.type_name || ''}]`
    )
    : (
      ''
    )
);

export const makePayloadFromState = (formState, type_id) => ({
  datetime: formState.date_start,
  technical_operation_id: formState.technical_operation_id,
  municipal_facility_id: formState.municipal_facility_id,
  route_type: formState.route_type,
  func_type_id: type_id || formState.type_id,
  needs_brigade: false,
});
