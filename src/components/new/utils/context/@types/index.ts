export type TitleDisplayIf = {
  title: string;
  disaplayIf: (
    'IS_CREATING'
  );
  reverse?: boolean;
};
export type SchemaFormContextHeader = (
  {
    type: 'default',
    title: TitleDisplayIf[];
  }
);

export type FieldCommon = {
  title: string;
  required?: boolean,
};
export type FieldString<F, K extends keyof F> = FieldCommon & {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  trimSpace?: boolean;
};
export type FieldValueOFArray<F, K extends keyof F> = FieldCommon & {
  type: 'valueOfArray';
  clearable?: boolean;
};
export type ObjectProperty<F, K extends keyof F> = FieldCommon & {
  type: 'schema';
  schemaBody: SchemaFormContextBody<F[K]>;
};
export type Field<F, K extends keyof F> = (
  F[K] extends object
    ? ObjectProperty<F, K>
    : FieldString<F, K>
      | FieldValueOFArray<F, K>
);

export type SchemaFormContextBody<F> = {
  fields: Partial<Record<keyof F, Field<F, keyof F>>>;
};

export type ButtonType = 'save' | 'cancel';
export type ButtonBLock = ButtonType[];
export type SchemaFormContextFooter = (
  {
    type: 'default';
    buttons: ButtonBLock[];
  }
);

export type SchemaFormContext<F> = {
  header: SchemaFormContextHeader;
  body: SchemaFormContextBody<F>;
  footer: SchemaFormContextFooter;
};

export type FormErrorBySchema<F, SchemaBodyFields extends SchemaFormContextBody<any>, RootFormState> = (
  {
    [K in keyof SchemaBodyFields['fields']]?: (
      string
    );
  }
);
