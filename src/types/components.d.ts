declare type InnerKeys = 'h' | 'w' | 'x' | 'y';
export interface GridItemClasses {
    'css-transforms': boolean;
    'disable-user-select': boolean;
    'no-touch': boolean;
    resizing: boolean;
    static: boolean;
    'vue-draggable-dragging': boolean;
    'vue-resizable': boolean;
}
export interface GridItemPosition {
    height: number;
    left: number;
    top: number;
    width: number;
}
export declare type GridLayoutEvent = [string, string, number, number, number, number];
export declare type Inner<Type> = Record<InnerKeys, Type>;
export {};
