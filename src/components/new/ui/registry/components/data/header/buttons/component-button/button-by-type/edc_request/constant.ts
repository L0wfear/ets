export const edc_form_permitted_type = {
  edc_request_create_mission: 'mission',
  edc_request_create_duty_mission: 'duty_mission',
  edc_request_reject: 'reject',
  edc_request_cancel: 'cancel',
  edc_request_close: 'close',
  edc_request_info: 'info',
};

export const edc_form_permitted_type_reverse = Object.entries(edc_form_permitted_type).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
