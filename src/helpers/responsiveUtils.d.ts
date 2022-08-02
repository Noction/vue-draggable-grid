import { Breakpoints, BreakpointsKeys, findOrGenerateResponsiveLayoutFnc } from '@/types/helpers';
export declare const findOrGenerateResponsiveLayout: findOrGenerateResponsiveLayoutFnc;
export declare const getBreakpointFromWidth: (breakpoints: Breakpoints, width: number) => BreakpointsKeys;
export declare const getColsFromBreakpoint: (breakpoint: string, cols: Breakpoints) => number;
export declare const sortBreakpoints: (breakpoints: Breakpoints) => BreakpointsKeys[];
