export declare type Breakpoints = RecordBreakpoint<number>;
export declare type BreakpointsKeys = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
export interface HW {
    height: string;
    width: string;
}
export declare type Layout = LayoutItem[];
export declare type LayoutItem = LayoutItemRequired & LayoutItemOptional;
export declare type LayoutItemOptional = {
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
};
export declare type LayoutItemRequired = {
    w: number;
    h: number;
    x: number;
    y: number;
    i: string;
};
export interface Position extends HW {
    position: string;
    top: string;
    left: string;
}
export declare type RecordBreakpoint<Type> = Partial<Record<BreakpointsKeys, Type>>;
export declare type ResponsiveLayout = RecordBreakpoint<Layout>;
export interface Transform extends HW {
    transform: string;
    position: string;
}
export declare type findOrGenerateResponsiveLayoutFnc = (orgLayout: Layout, layouts: ResponsiveLayout, breakpoints: Breakpoints, breakpoint: BreakpointsKeys, lastBreakpoint: BreakpointsKeys, cols: number, verticalCompact: boolean) => Layout;
export declare type setPositionFnc<Position> = (top: number, left: number, width: number, height: number) => Position;
