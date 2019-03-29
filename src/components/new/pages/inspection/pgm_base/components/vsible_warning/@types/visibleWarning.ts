export type SingleFiled = {
    key: string;
    title?: string | null;
    type?: string | null;
    className?: string | null;
    reset?: string[] | null;
    sub?: number | null;
    hidden?: string | null;
    options?: {
        value: string | number;
        label: string;
    }[];
    readOnly?: boolean | null;
    inline?: boolean | null;
    sub_header?: string | null;
};
export type FiledToCheck = SingleFiled[];
