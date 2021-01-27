import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsEmployee } from 'components/new/pages/nsi/employee/form/@types/EmployeeForm.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { isEmpty } from 'utils/functions';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';

const isValidLicense = (data) => {
  return /[^АВЕКМНОРСТУХ0-9_ ]/g.test(data);
};

const isValidFormat = (data) => {
  if (data.length <= 2 || data.length >= 5) {
    return (data.length >= 4 && isNaN(data.charAt(2)) !== isNaN(data.charAt(3))) ||  isNaN(data.charAt(data.length - 1)) === true;
  }
};

const isValidString = (data) => {
  let err = 0;
  for (let char of data) {
    if (isNaN(char) && (data.length <= 2 || data.length >= 5) && data.indexOf(char) !== 2 && data.indexOf(char) !== 3) {
      err += 1;
    }
  }
  return Boolean(err);
};

const isValidValue = (data) => {
  return /[0-9]{2}[0-9]{2}[0-9]{6}/.test(data) || /[0-9]{2}[АВЕКМНОРСТУХ]{2}[0-9]{6}/.test(data);
};

export const employeeFormSchema: SchemaType<Employee, PropsEmployee> = {
  properties: {
    last_name: {
      title: 'Фамилия',
      type: 'string',
      maxLength: 50,
      required: true,
    },
    first_name: {
      title: 'Имя',
      maxLength: 50,
      type: 'string',
      required: true,
    },
    middle_name: {
      title: 'Отчество',
      maxLength: 50,
      type: 'string',
    },
    phone: {
      type: 'string',
      title: 'Телефон',
      maxLength: 50,
    },
    special_marks: {
      type: 'string',
      title: 'Особые отметки',
      maxLength: 150,
    },
    snils: {
      type: 'string',
      title: 'СНИЛС',
      dependencies: [
        (snils) => {
          if (snils && snils.length !== 14) {
            return 'Поле "СНИЛС" должно содержать 11 цифр';
          }
        },
      ],
    },
    personnel_number: {
      title: 'Табельный номер',
      type: 'string',
      maxLength: 15,
    },
    position_id: {
      title: 'Должность',
      type: 'valueOfArray',
      required: true,
    },
    special_license_country_id: {
      title: 'Страна, выдавшая специальное удостоверение',
      type: 'number',
      strick: true,
      dependencies: [
        (value, formData) => {
          if (!value && formData.special_license) {
            return getRequiredFieldMessage('Страна, выдавшая специальное удостоверение');
          }
        }
      ],
    },
    special_license: {
      title: 'Специальное удостоверение',
      type: 'string',
      dependencies: [
        (value, formData) => {
          const maxLengthString = 10;
          if (value && formData.special_license_country_id === 185 && (isValidLicense(value) || isValidFormat(value) || isValidString(value) || value.length === 10 && !isValidValue(value) || value && value.length < maxLengthString)) {
            return 'Недопустимое значение. Данные не будут сохранены';
          }
          if (formData.is_driver) {
            if (isEmpty(formData.drivers_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          if (value ? value.length > maxLengthString : false) {
            return `Длина поля не должна превышать максимальное количество символов (${maxLengthString}). Пример заполнения: 30КЕ123456`;
          }

          return undefined;
        },
      ],
    },
    drivers_license_country_id: {
      title: 'Страна, выдавшая водительское удостоверение',
      type: 'number',
      strick: true,
      dependencies: [
        (value, formData) => {
          if (!value && formData.drivers_license) {
            return getRequiredFieldMessage('Страна, выдавшая водительское удостоверение');
          }
        }
      ],
    },
    drivers_license: {
      title: 'Водительское удостоверение',
      type: 'string',
      dependencies: [
        (value, formData) => {
          const maxLengthString = 10;
          if (value && formData.drivers_license_country_id === 185 && (isValidLicense(value) || isValidFormat(value) || isValidString(value) || value.length === 10 && !isValidValue(value)  || value && value.length < maxLengthString)) {
            return 'Недопустимое значение. Данные не будут сохранены';
          }
          if (formData.is_driver) {
            if (isEmpty(formData.special_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          if (value ? value.length > maxLengthString : false) {
            return `Длина поля не должна превышать максимальное количество символов (${maxLengthString}). Пример заполнения: 30КЕ123456`;
          }

          return undefined;
        },
      ],
    },
    drivers_license_date_end: {
      title: 'Срок действия водительского удостоверения',
      type: 'date',
      dependencies: [
        (value, formData) => {
          if (!isEmpty(formData.drivers_license) && isEmpty(value)) {
            return 'Поле "Срок действия водительского удостоверения" должно быть заполнено';
          }
          return undefined;
        },
      ],
    },
    special_license_date_end: {
      title: 'Срок действия специального удостоверения',
      type: 'date',
      dependencies: [
        (value, formData) => {
          if (!isEmpty(formData.special_license) && isEmpty(value)) {
            return 'Поле "Срок действия специального удостоверения" должно быть заполнено';
          }
          return undefined;
        },
      ],
    },
    medical_certificate: {
      type: 'string',
      title: 'Медицинская справка №',
      maxLength: 25,
    },
    assignment_date_end: {
      title: 'Дата окончания действия',
      type: 'date',
      dependencies: [
        (value, {assignment_date_start}) => {
          if (value) {
            if (assignment_date_start && diffDates(assignment_date_start, value) >= 0) {
              return `"Дата окончания действия" должно быть больше "Дата начала действия"`;
            }
          }
          return undefined;
        },
      ],
    },
    category_drivers_license: {
      title: 'Категория водительского удостоверения',
      type: 'multiValueOfArray',
      dependencies: [
        (value, formData) => {
          if (!isEmpty(formData.drivers_license) && !value.length) {
            return 'Поле "Категория водительского удостоверения" должно быть заполнено';
          }
          return undefined;
        },
      ],
    },
    category_special_license: {
      title: 'Категория специального удостоверения',
      type: 'multiValueOfArray',
      dependencies: [
        (value, formData) => {
          if (!isEmpty(formData.special_license) && !value.length) {
            return 'Поле "Категория специального удостоверения" должно быть заполнено';
          }
          return undefined;
        },
      ],
    },
    secondary_car: {
      title: 'Вторичное ТС',
      type: 'multiValueOfArray',
      dependencies: [
        (value, formData) => {
          if (value?.length && formData.secondary_car?.includes?.(formData.prefer_car)
          ) {
            return 'Одно и то же ТС не может быть указано как основное и как вторичное одновременно';
          }
          return undefined;
        },
      ],
    },
    layoff_reason_id: {
      title: 'Основание увольнения',
      type: 'valueOfArray',
      dependencies: [
        (value, {active}) => {
          if (!value && !active) {
            return 'Поле «Основание увольнения» должно быть заполнено';
          }
        }
      ]
    },
    comment: {
      title: 'Комментарий',
      type: 'valueOfArray',
      dependencies: [
        (value, { layoff_reason_id, active }) => {
          if (!value && !active) {
            return 'Поле «Комментарий» должно быть заполнено';
          }
        }
      ]
    }
  },
};
