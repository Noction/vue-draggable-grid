declare const _default: {
    breakpointsValidatorPayload: {
        invalidBreakpointsKeys1: {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xx: number;
        };
        invalidBreakpointsKeys2: {
            lg: number;
            md: number;
            sm: number;
            xs: number;
        };
        invalidBreakpointsTypes: {
            lg: string;
            md: number;
            sm: number;
            xs: number;
            xx: number;
        };
        validBreakpoints: {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
    };
    keysValidatorPayload: {
        invalidKeys1: string[];
        invalidKeys2: string[];
        validKeys: string[];
    };
    layoutValidatorPayload: {
        invalidOptionalLayout: {
            isDraggable: boolean;
            isResizable: boolean;
            maxH: number;
            maxW: string;
            minH: number;
            minW: number;
            moved: boolean;
            static: boolean;
        };
        invalidRequiredLayout: {
            h: number;
            i: string;
            w: number;
            x: number;
            y: number;
        };
        validOptionalLayout: {
            isDraggable: boolean;
            isResizable: boolean;
            maxH: number;
            maxW: number;
            minH: number;
            minW: number;
            moved: boolean;
            static: boolean;
        };
        validRequiredLayout: {
            h: number;
            i: string;
            w: number;
            x: number;
            y: number;
        };
    };
    marginValidatorPayload: {
        invalidMargin1: number[];
        invalidMargin2: (string | number)[];
        validMargin: number[];
    };
};
export default _default;
