export const company_structure_types = {
  company_structure_create: 'company_structure_create',
};

export const company_structure_types_reverse = Object.entries(company_structure_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
