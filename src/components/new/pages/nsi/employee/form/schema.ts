import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsEmployee } from 'components/new/pages/nsi/employee/form/@types/EmployeeForm.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { isEmpty } from 'utils/functions';
import { diffDates } from 'components/@next/@utils/dates/dates';

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
    special_license: {
      title: 'Специальное удостоверение',
      type: 'string',
      dependencies: [
        (value, formData) => {
          if (formData.position_id === 15 || formData.position_id === 24 || formData.position_id === 46) {
            if (isEmpty(formData.drivers_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          const maxLengthString = 12;
          if ( value ? value.length > maxLengthString : false) {
            return `Длина поля не должна превышать максимальное количество символов (${maxLengthString}). Пример заполнения: 30 КЕ 123456`;
          }

          return undefined;
        },
      ],
    },
    drivers_license: {
      title: 'Водительское удостоверение',
      type: 'string',
      dependencies: [
        (value, formData) => {
          if (formData.position_id === 15 || formData.position_id === 24 || formData.position_id === 46) {
            if (isEmpty(formData.special_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          const maxLengthString = 12;
          if ( value ? value.length > maxLengthString : false) {
            return `Длина поля не должна превышать максимальное количество символов (${maxLengthString}). Пример заполнения: 30 КЕ 123456`;
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
  },
};
