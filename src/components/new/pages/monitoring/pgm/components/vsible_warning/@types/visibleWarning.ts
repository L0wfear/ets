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
};
export type FiledToCheck = SingleFiled[];
