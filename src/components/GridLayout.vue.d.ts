import { BreakpointsKeys, Layout } from '@/types/helpers';
import { PropType, nextTick } from 'vue';
declare const _default: {
    new (...args: any[]): {
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            colNum: number;
            isDraggable: boolean;
            isResizable: boolean;
            margin: number[];
            maxRows: number;
            rowHeight: number;
            useCssTransforms: boolean;
            cols: {
                lg: number;
                md: number;
                sm: number;
                xs: number;
                xxs: number;
            };
            autoSize: boolean;
            breakpoints: {
                lg: number;
                md: number;
                sm: number;
                xs: number;
                xxs: number;
            };
            preventCollision: boolean;
            responsive: boolean;
            responsiveLayouts: {};
            verticalCompact: boolean;
        }> & Omit<Readonly<import("vue").ExtractPropTypes<{
            autoSize: {
                default: boolean;
                type: BooleanConstructor;
            };
            breakpoints: {
                default: () => {
                    lg: number;
                    md: number;
                    sm: number;
                    xs: number;
                    xxs: number;
                };
                type: PropType<Partial<Record<BreakpointsKeys, number>>>;
                validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
            };
            colNum: {
                default: number;
                type: NumberConstructor;
            };
            cols: {
                default: () => {
                    lg: number;
                    md: number;
                    sm: number;
                    xs: number;
                    xxs: number;
                };
                type: PropType<Partial<Record<BreakpointsKeys, number>>>;
                validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
            };
            isDraggable: {
                default: boolean;
                type: BooleanConstructor;
            };
            isResizable: {
                default: boolean;
                type: BooleanConstructor;
            };
            layout: {
                required: true;
                type: PropType<Layout>;
                validator: (layout: Layout) => boolean;
            };
            margin: {
                default: () => number[];
                type: PropType<number[]>;
                validator: (value: [number, number]) => boolean;
            };
            maxRows: {
                default: number;
                type: NumberConstructor;
            };
            preventCollision: {
                default: boolean;
                type: BooleanConstructor;
            };
            responsive: {
                default: boolean;
                type: BooleanConstructor;
            };
            responsiveLayouts: {
                default: () => {};
                type: PropType<Partial<Record<BreakpointsKeys, Layout>>>;
                validator: (value: unknown) => boolean;
            };
            rowHeight: {
                default: number;
                type: NumberConstructor;
            };
            useCssTransforms: {
                default: boolean;
                type: BooleanConstructor;
            };
            verticalCompact: {
                default: boolean;
                type: BooleanConstructor;
            };
        }>> & {
            "onUpdate:layout"?: (...args: any[]) => any;
            "onLayout-ready"?: (...args: any[]) => any;
            "onUpdate:breakpoint"?: (...args: any[]) => any;
            "onLayout-created"?: (...args: any[]) => any;
            "onLayout-before-mount"?: (...args: any[]) => any;
            "onLayout-mounted"?: (...args: any[]) => any;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "colNum" | "isDraggable" | "isResizable" | "margin" | "maxRows" | "rowHeight" | "useCssTransforms" | "cols" | "autoSize" | "breakpoints" | "preventCollision" | "responsive" | "responsiveLayouts" | "verticalCompact">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue").Slot;
        }>;
        $root: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>;
        $parent: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>;
        $emit: (event: "update:layout" | "layout-ready" | "update:breakpoint" | "layout-created" | "layout-before-mount" | "layout-mounted", ...args: any[]) => void;
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
            autoSize: {
                default: boolean;
                type: BooleanConstructor;
            };
            breakpoints: {
                default: () => {
                    lg: number;
                    md: number;
                    sm: number;
                    xs: number;
                    xxs: number;
                };
                type: PropType<Partial<Record<BreakpointsKeys, number>>>;
                validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
            };
            colNum: {
                default: number;
                type: NumberConstructor;
            };
            cols: {
                default: () => {
                    lg: number;
                    md: number;
                    sm: number;
                    xs: number;
                    xxs: number;
                };
                type: PropType<Partial<Record<BreakpointsKeys, number>>>;
                validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
            };
            isDraggable: {
                default: boolean;
                type: BooleanConstructor;
            };
            isResizable: {
                default: boolean;
                type: BooleanConstructor;
            };
            layout: {
                required: true;
                type: PropType<Layout>;
                validator: (layout: Layout) => boolean;
            };
            margin: {
                default: () => number[];
                type: PropType<number[]>;
                validator: (value: [number, number]) => boolean;
            };
            maxRows: {
                default: number;
                type: NumberConstructor;
            };
            preventCollision: {
                default: boolean;
                type: BooleanConstructor;
            };
            responsive: {
                default: boolean;
                type: BooleanConstructor;
            };
            responsiveLayouts: {
                default: () => {};
                type: PropType<Partial<Record<BreakpointsKeys, Layout>>>;
                validator: (value: unknown) => boolean;
            };
            rowHeight: {
                default: number;
                type: NumberConstructor;
            };
            useCssTransforms: {
                default: boolean;
                type: BooleanConstructor;
            };
            verticalCompact: {
                default: boolean;
                type: BooleanConstructor;
            };
        }>> & {
            "onUpdate:layout"?: (...args: any[]) => any;
            "onLayout-ready"?: (...args: any[]) => any;
            "onUpdate:breakpoint"?: (...args: any[]) => any;
            "onLayout-created"?: (...args: any[]) => any;
            "onLayout-before-mount"?: (...args: any[]) => any;
            "onLayout-mounted"?: (...args: any[]) => any;
        }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:layout" | "layout-ready" | "update:breakpoint" | "layout-created" | "layout-before-mount" | "layout-mounted")[], string, {
            colNum: number;
            isDraggable: boolean;
            isResizable: boolean;
            margin: number[];
            maxRows: number;
            rowHeight: number;
            useCssTransforms: boolean;
            cols: {
                lg: number;
                md: number;
                sm: number;
                xs: number;
                xxs: number;
            };
            autoSize: boolean;
            breakpoints: {
                lg: number;
                md: number;
                sm: number;
                xs: number;
                xxs: number;
            };
            preventCollision: boolean;
            responsive: boolean;
            responsiveLayouts: {};
            verticalCompact: boolean;
        }> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions<boolean>): import("vue").WatchStopHandle;
    } & Readonly<import("vue").ExtractPropTypes<{
        autoSize: {
            default: boolean;
            type: BooleanConstructor;
        };
        breakpoints: {
            default: () => {
                lg: number;
                md: number;
                sm: number;
                xs: number;
                xxs: number;
            };
            type: PropType<Partial<Record<BreakpointsKeys, number>>>;
            validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
        };
        colNum: {
            default: number;
            type: NumberConstructor;
        };
        cols: {
            default: () => {
                lg: number;
                md: number;
                sm: number;
                xs: number;
                xxs: number;
            };
            type: PropType<Partial<Record<BreakpointsKeys, number>>>;
            validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
        };
        isDraggable: {
            default: boolean;
            type: BooleanConstructor;
        };
        isResizable: {
            default: boolean;
            type: BooleanConstructor;
        };
        layout: {
            required: true;
            type: PropType<Layout>;
            validator: (layout: Layout) => boolean;
        };
        margin: {
            default: () => number[];
            type: PropType<number[]>;
            validator: (value: [number, number]) => boolean;
        };
        maxRows: {
            default: number;
            type: NumberConstructor;
        };
        preventCollision: {
            default: boolean;
            type: BooleanConstructor;
        };
        responsive: {
            default: boolean;
            type: BooleanConstructor;
        };
        responsiveLayouts: {
            default: () => {};
            type: PropType<Partial<Record<BreakpointsKeys, Layout>>>;
            validator: (value: unknown) => boolean;
        };
        rowHeight: {
            default: number;
            type: NumberConstructor;
        };
        useCssTransforms: {
            default: boolean;
            type: BooleanConstructor;
        };
        verticalCompact: {
            default: boolean;
            type: BooleanConstructor;
        };
    }>> & {
        "onUpdate:layout"?: (...args: any[]) => any;
        "onLayout-ready"?: (...args: any[]) => any;
        "onUpdate:breakpoint"?: (...args: any[]) => any;
        "onLayout-created"?: (...args: any[]) => any;
        "onLayout-before-mount"?: (...args: any[]) => any;
        "onLayout-mounted"?: (...args: any[]) => any;
    } & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    autoSize: {
        default: boolean;
        type: BooleanConstructor;
    };
    breakpoints: {
        default: () => {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
        type: PropType<Partial<Record<BreakpointsKeys, number>>>;
        validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
    };
    colNum: {
        default: number;
        type: NumberConstructor;
    };
    cols: {
        default: () => {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
        type: PropType<Partial<Record<BreakpointsKeys, number>>>;
        validator: (cols: Partial<Record<BreakpointsKeys, number>>) => boolean;
    };
    isDraggable: {
        default: boolean;
        type: BooleanConstructor;
    };
    isResizable: {
        default: boolean;
        type: BooleanConstructor;
    };
    layout: {
        required: true;
        type: PropType<Layout>;
        validator: (layout: Layout) => boolean;
    };
    margin: {
        default: () => number[];
        type: PropType<number[]>;
        validator: (value: [number, number]) => boolean;
    };
    maxRows: {
        default: number;
        type: NumberConstructor;
    };
    preventCollision: {
        default: boolean;
        type: BooleanConstructor;
    };
    responsive: {
        default: boolean;
        type: BooleanConstructor;
    };
    responsiveLayouts: {
        default: () => {};
        type: PropType<Partial<Record<BreakpointsKeys, Layout>>>;
        validator: (value: unknown) => boolean;
    };
    rowHeight: {
        default: number;
        type: NumberConstructor;
    };
    useCssTransforms: {
        default: boolean;
        type: BooleanConstructor;
    };
    verticalCompact: {
        default: boolean;
        type: BooleanConstructor;
    };
}>> & {
    "onUpdate:layout"?: (...args: any[]) => any;
    "onLayout-ready"?: (...args: any[]) => any;
    "onUpdate:breakpoint"?: (...args: any[]) => any;
    "onLayout-created"?: (...args: any[]) => any;
    "onLayout-before-mount"?: (...args: any[]) => any;
    "onLayout-mounted"?: (...args: any[]) => any;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:layout" | "layout-ready" | "update:breakpoint" | "layout-created" | "layout-before-mount" | "layout-mounted")[], "update:layout" | "layout-ready" | "update:breakpoint" | "layout-created" | "layout-before-mount" | "layout-mounted", {
    colNum: number;
    isDraggable: boolean;
    isResizable: boolean;
    margin: number[];
    maxRows: number;
    rowHeight: number;
    useCssTransforms: boolean;
    cols: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    };
    autoSize: boolean;
    breakpoints: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    };
    preventCollision: boolean;
    responsive: boolean;
    responsiveLayouts: {};
    verticalCompact: boolean;
}> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        item: (_: {
            item: import("@/types/helpers").LayoutItem;
        }) => any;
    };
});
export default _default;
