export const typeTemplate = {
  missionDutyTemplate: 'missionDutyTemplate',
  missionTemplate: 'missionTemplate',
} as const;

export const ASSING_BY_KEY = {
  assign_to_active: 'assign_to_active',
  assign_to_new_draft: 'assign_to_new_draft',
  assign_to_available_draft: 'assign_to_available_draft',
};

export const ASSIGN_OPTIONS = [
  { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
  { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
  { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
];
