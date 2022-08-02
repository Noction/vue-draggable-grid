import { Breakpoints, Layout } from '@/types/helpers';
export declare const breakpointsValidator: (cols: Breakpoints) => boolean;
export declare const keysValidator: (requiredKeys: string[], propsKeys: string[]) => boolean;
export declare const layoutValidator: (layout: Layout) => boolean;
export declare const marginValidator: (value: [number, number]) => boolean;
