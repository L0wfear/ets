export const odhNormSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'consumable_material_id',
      title: 'Расходный материал',
      type: 'number',
      required: true,
    },
    {
      key: 'season_id',
      title: 'Сезон',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_category_id',
      title: 'Категория',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_subcategory_id',
      title: 'Подкатегория',
      type: 'number',
      required: true,
    },
    {
      key: 'value',
      title: 'Норма',
      type: 'string',
      required: true,
    },
  ],
};
