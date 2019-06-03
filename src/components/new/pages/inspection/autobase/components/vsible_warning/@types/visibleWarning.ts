export type SingleFiled<F> = {
    key: keyof F;
    title?: string | null;
    time?: boolean;
    type?: string | null;
    multi?: boolean;
    className?: string | null;
    reset?: Array<keyof F> | null;
    sub?: number | null;
    hidden?: keyof F;
    inline?: boolean;
    readOnly?: boolean;
    options?: {
        value: string | number;
        label: string;
    }[];
    sub_header?: string;
};
export type FiledToCheck<F> = SingleFiled<F>[];
