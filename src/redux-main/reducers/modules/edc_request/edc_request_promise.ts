import { EdcRequestService, EdcRequestChangeStatusService, EdcRefusalReasonService, EdcRejectionReasonService, EdcRequestImportService } from "api/Services";
import { get } from 'lodash';
import { EdcRequest } from "./@types";
import { EdcRequestCancel } from "components/new/pages/edc_request/form/cancel/@types/EdcRequestCancel";
import { EdcRequestReject } from "components/new/pages/edc_request/form/reject/@types/EdcRequestReject";

export const promiseLoadEdcRequestById = async (id: number) => {
  let response = null;

  try {
    response = await EdcRequestService.get(
      { id },
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const edc_request: EdcRequest = get(response, 'result.0', null);

  return edc_request;
};

// для добавления в БД новой записи по заявке
export const promiseSetTestDataToDatabase = async (id: number) => {
  let response = null;

  try {
    const testData = {
        request_id: "4545",
        root_id: "34",
        status_name: "На доработку", // на доработку
        rework: true, // только для заявок в статусе на доработку
        request_number: "202020209",

        bpm_operation: null,
        bpm_except: null,
        tree_id: null,
        create_date_ui: "24.02.2019 10:37",
        create_date: "2019-02-24T07:37:08.287Z",
        start_date: "2019-02-25T17:10:59.753Z",
        status_id: "80",
        deffect_category_name: "Зимние виды работ",
        defect_category_id: "49",
        emergency_name: "Обычная",
        house_address: "Малый Палашёвский переулок, дом 2/8",
        address_name: "Малый Палашёвский переулок, дом 2/8 Подъезд 0 Этаж 0 кв. 0",
        defect_name: "Зимние виды работ Другое",
        defect_short_name: "не передаем!!!!",
        defect_id: "3659",
        source_name: "телефон",
        source_id: "1129",
        payable_type_name: "бесплатная",
        pay_status_name: null,
        contractor_name: "ГБУ Автомобильные дороги ЦАО",
        cancel_reason_name: null,
        rejection_reason_name: null,
        okrug_name: "ЦАО",
        district_name: "Тверской",
        address_comment: null,
        description: " У Кафе дворники высыпали ведро соли у входа в кафе, люди жалуются. Убрать эту соль ее очень.",
        question: null,
        question_description: null,
        intercom_code: "0",
        declarant_name: null,
        main_phone: "79672332304",
        additional_phone: null,
        applicant_name: null,
        applicant_phone: null,
        desired_time: "24.02.2019 с 08:00 по 20:00",
        desired_time_from: "08:00",
        desired_time_to: "20:00",
        desired_date: "24.02.2019",
        agreed_price: null,
        create_user_name: "voxcom",
        work_type: "Заявка выполнена: Со слов заявителя заявка выполнена . Соль убрана.",
        feedback: null,
        entrance_num: "0",
        floor_num: "0",
        flat: "0",
        rating: null,
        is_card: null,
        contractor_id: "1557050",
        executor_id: null,
        executor_name: null,
        payable_type_id: "72",
        cancel_reason_id: null,
        rejection_reason_id: null,
        declarant_jur_id: null,
        emergency_id: "67",
        address_id: "1778018",
        substatus_id: null,
        pay_status_id: null,
        eno: null,
        sso_id: null,
        // contact_face: {
        //     name: null,
        //     phone: "79672332304",
        // },
        source: "телефон",
        grade: null,
        grade_id: null,
        specialty: null,
        ods: "ОДС 1",
        creator_fio: "Оператор КЦ  ",
        uk_name: "ГБУ «ЖИЛИЩНИК РАЙОНА ТВЕРСКОЙ»",
        filters_rw: {
            call_center: [
                8137,
            ],
        },
        t_connection: "node1_domain_4_nauss_0_1550149087_523870",
        aon_phone: "89672332304",
        external_user_login: "muntan_ef",
        is_notified: false,
        wfm_key: null,
        is_emergency_service_has_cabinet: true,
        external_system_message: null,
    };

    // console.log('set testData === ', testData);
    response = await EdcRequestImportService.post(testData, false, 'json');
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const edc_request: EdcRequest = get(response, 'result.0', null);

  return edc_request;
};

export const promiseRejectEdcRequest = async (edc_request_reject: EdcRequestReject) => {
  const { id, ...payload } = edc_request_reject;
  const response  = await EdcRequestChangeStatusService.path(id).path('reject').put(
    payload,
    false,
    'json',
  );

  return response;
};

export const promiseCancelEdcRequest = async (edc_request_cancel: EdcRequestCancel) => {
  const { id, ...payload } = edc_request_cancel;
  const response  = await EdcRequestChangeStatusService.path(id).path('cancel').put(
    payload,
    false,
    'json',
  );

  return response;
};

export const promiseCloseEdcRequestById = async (id: number) => {
  const response  = await EdcRequestChangeStatusService.path(id).path('close').put(
    {},
    false,
    'json',
  );

  return response;
};

export const loadRefusalReason = async () => {
  let response = null;
  try {
    response  = await EdcRefusalReasonService.get();
  } catch (error) {
    console.error(error); //tslint:disable-line
  }

  const refusalReasonList: any[] = get(response, 'result.rows', []);
  return refusalReasonList;
};

export const loadRejectionReason = async () => {
  let response = null;
  try {
    response  = await EdcRejectionReasonService.get();
  } catch (error) {
    console.error(error); //tslint:disable-line
  }

  const refusalReasonList: any[] = get(response, 'result.rows', []);
  return refusalReasonList;
};
