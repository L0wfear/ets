export type SingleFiled<F> = {
    key: keyof F;
    title?: string | null;
    time?: boolean;
    type?: string | null;
    className?: string | null;
    reset?: Array<keyof F> | null;
    sub?: number | null;
    hidden?: keyof F;
    options?: {
        value: string | number;
        label: string;
    }[];
};
export type FiledToCheck<F = any> = SingleFiled<F>[];
