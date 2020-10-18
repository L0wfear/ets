export const TACHOGRAPH_BRAND_NAME_LIST = [
  'Atol Drive 5',
  'Atol Drive Smart',
  'VDO DTCO 3283',
  'Касби ДТ20М',
  'Меркурий ТА-001',
  'ТЦА-02НК',
  'ШТРИХ-ТахоRUS',
] as const;

export type TACHOGRAPH_BRAND_NAME_LIST_OPTIONS_TYPE = Array<{
  value: typeof TACHOGRAPH_BRAND_NAME_LIST[number];
  label: typeof TACHOGRAPH_BRAND_NAME_LIST[number];
}>;

export const TACHOGRAPH_BRAND_NAME_LIST_OPTIONS: TACHOGRAPH_BRAND_NAME_LIST_OPTIONS_TYPE = TACHOGRAPH_BRAND_NAME_LIST.map(
  (el) => ({ value: el, label: el })
);

export const TACHOGRAPH_REPLACEMENT_SKZI_LIST = [
  'Первичная установка тахографа на ТС',
  'Истечение срока эксплуатации',
  'Неисправность',
  'Переустановка тахографа на другое ТС',
  'Смена рег. номера ТС',
] as const;

export type TACHOGRAPH_REPLACEMENT_SKZI_LIST_OPTIONS_TYPE = Array<{
  value: number;
  label: typeof TACHOGRAPH_REPLACEMENT_SKZI_LIST[number];
}>;

export const TACHOGRAPH_REPLACEMENT_SKZI_LIST_OPTIONS: TACHOGRAPH_REPLACEMENT_SKZI_LIST_OPTIONS_TYPE = TACHOGRAPH_REPLACEMENT_SKZI_LIST.map(
  (el, i) => ({ value: i + 1, label: el })
);
