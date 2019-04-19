import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsEmployee } from 'components/new/pages/nsi/employee/form/@types/EmployeeForm.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { isEmpty } from 'utils/functions';
import { diffDates } from 'utils/dates';

export const employeeFormSchema: SchemaType<Employee, PropsEmployee> = {
  properties: {
    last_name: {
      title: 'Фамилия',
      type: 'string',
      required: true,
    },
    first_name: {
      title: 'Имя',
      type: 'string',
      required: true,
    },
    personnel_number: {
      title: 'Табельный номер',
      type: 'string',
    },
    position_id: {
      title: 'Должность',
      type: 'valueOfArray',
      required: true,
    },
    special_license: {
      title: 'Специальное удостоверение',
      type: 'string',
    },
    drivers_license: {
      title: 'Водительское удостоверение',
      type: 'string',
    },
    drivers_license_date_end: {
      title: 'Срок действия водительского удостоверения',
      type: 'date',
    },
    special_license_date_end: {
      title: 'Срок действия специального удостоверения',
      type: 'date',
    },
    assignment_date_end: {
      title: 'Дата окончания действия',
      type: 'date',
    },
  },
  dependencies: {
    drivers_license: [
      (value, formData) => {
        if (formData.position_id === 15 || formData.position_id === 24 || formData.position_id === 46) {
          if (isEmpty(formData.special_license) && isEmpty(value)) {
            return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
          }
        }
        return undefined;
      },
    ],
    special_license: [
      (value, formData) => {
        if (formData.position_id === 15 || formData.position_id === 24 || formData.position_id === 46) {
          if (isEmpty(formData.drivers_license) && isEmpty(value)) {
            return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
          }
        }
        return undefined;
      },
    ],
    drivers_license_date_end: [
      (value, formData) => {
        if (!isEmpty(formData.drivers_license) && isEmpty(value)) {
          return 'Поле "Срок действия водительского удостоверения" должно быть заполнено';
        }
        return undefined;
      },
    ],
    special_license_date_end: [
      (value, formData) => {
        if (!isEmpty(formData.special_license) && isEmpty(value)) {
          return 'Поле "Срок действия специального удостоверения" должно быть заполнено';
        }
        return undefined;
      },
    ],
    category_drivers_license: [
      (value, formData) => {
        if (!isEmpty(formData.drivers_license) && !value.length) {
          return 'Поле "Категория водительского удостоверения" должно быть заполнено';
        }
        return undefined;
      },
    ],
    category_special_license: [
      (value, formData) => {
        if (!isEmpty(formData.special_license) && !value.length) {
          return 'Поле "Категория специального удостоверения" должно быть заполнено';
        }
        return undefined;
      },
    ],
    assignment_date_end: [
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
};
