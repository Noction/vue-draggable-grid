import { BreakpointsKeys } from '@/types/helpers';
import { PropType } from 'vue';
declare const _default: {
    new (...args: any[]): {
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            maxH: number;
            maxW: number;
            minH: number;
            minW: number;
            static: boolean;
        }> & Omit<Readonly<import("vue").ExtractPropTypes<{
            breakpointCols: {
                required: true;
                type: PropType<Partial<Record<BreakpointsKeys, number>>>;
            };
            colNum: {
                required: true;
                type: NumberConstructor;
            };
            containerWidth: {
                required: true;
                type: NumberConstructor;
            };
            h: {
                required: true;
                type: NumberConstructor;
            };
            i: {
                required: true;
                type: StringConstructor;
            };
            isDraggable: {
                required: true;
                type: BooleanConstructor;
            };
            isResizable: {
                required: true;
                type: BooleanConstructor;
            };
            lastBreakpoint: {
                required: true;
                type: PropType<BreakpointsKeys>;
            };
            margin: {
                required: true;
                type: PropType<number[]>;
            };
            maxH: {
                default: number;
                type: NumberConstructor;
            };
            maxRows: {
                required: true;
                type: NumberConstructor;
            };
            maxW: {
                default: number;
                type: NumberConstructor;
            };
            minH: {
                default: number;
                type: NumberConstructor;
            };
            minW: {
                default: number;
                type: NumberConstructor;
            };
            rowHeight: {
                required: true;
                type: NumberConstructor;
            };
            static: {
                default: boolean;
                type: BooleanConstructor;
            };
            useCssTransforms: {
                required: true;
                type: BooleanConstructor;
            };
            w: {
                required: true;
                type: NumberConstructor;
            };
            x: {
                required: true;
                type: NumberConstructor;
            };
            y: {
                required: true;
                type: NumberConstructor;
            };
        }>> & {
            "onContainer-resized"?: (...args: any[]) => any;
            onResize?: (...args: any[]) => any;
            onResized?: (...args: any[]) => any;
            onMove?: (...args: any[]) => any;
            onMoved?: (...args: any[]) => any;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "maxH" | "maxW" | "minH" | "minW" | "static">;
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
        $emit: (event: "container-resized" | "resize" | "resized" | "move" | "moved", ...args: any[]) => void;
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
            breakpointCols: {
                required: true;
                type: PropType<Partial<Record<BreakpointsKeys, number>>>;
            };
            colNum: {
                required: true;
                type: NumberConstructor;
            };
            containerWidth: {
                required: true;
                type: NumberConstructor;
            };
            h: {
                required: true;
                type: NumberConstructor;
            };
            i: {
                required: true;
                type: StringConstructor;
            };
            isDraggable: {
                required: true;
                type: BooleanConstructor;
            };
            isResizable: {
                required: true;
                type: BooleanConstructor;
            };
            lastBreakpoint: {
                required: true;
                type: PropType<BreakpointsKeys>;
            };
            margin: {
                required: true;
                type: PropType<number[]>;
            };
            maxH: {
                default: number;
                type: NumberConstructor;
            };
            maxRows: {
                required: true;
                type: NumberConstructor;
            };
            maxW: {
                default: number;
                type: NumberConstructor;
            };
            minH: {
                default: number;
                type: NumberConstructor;
            };
            minW: {
                default: number;
                type: NumberConstructor;
            };
            rowHeight: {
                required: true;
                type: NumberConstructor;
            };
            static: {
                default: boolean;
                type: BooleanConstructor;
            };
            useCssTransforms: {
                required: true;
                type: BooleanConstructor;
            };
            w: {
                required: true;
                type: NumberConstructor;
            };
            x: {
                required: true;
                type: NumberConstructor;
            };
            y: {
                required: true;
                type: NumberConstructor;
            };
        }>> & {
            "onContainer-resized"?: (...args: any[]) => any;
            onResize?: (...args: any[]) => any;
            onResized?: (...args: any[]) => any;
            onMove?: (...args: any[]) => any;
            onMoved?: (...args: any[]) => any;
        }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("container-resized" | "resize" | "resized" | "move" | "moved")[], string, {
            maxH: number;
            maxW: number;
            minH: number;
            minW: number;
            static: boolean;
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
        $nextTick: typeof import("vue").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions<boolean>): import("vue").WatchStopHandle;
    } & Readonly<import("vue").ExtractPropTypes<{
        breakpointCols: {
            required: true;
            type: PropType<Partial<Record<BreakpointsKeys, number>>>;
        };
        colNum: {
            required: true;
            type: NumberConstructor;
        };
        containerWidth: {
            required: true;
            type: NumberConstructor;
        };
        h: {
            required: true;
            type: NumberConstructor;
        };
        i: {
            required: true;
            type: StringConstructor;
        };
        isDraggable: {
            required: true;
            type: BooleanConstructor;
        };
        isResizable: {
            required: true;
            type: BooleanConstructor;
        };
        lastBreakpoint: {
            required: true;
            type: PropType<BreakpointsKeys>;
        };
        margin: {
            required: true;
            type: PropType<number[]>;
        };
        maxH: {
            default: number;
            type: NumberConstructor;
        };
        maxRows: {
            required: true;
            type: NumberConstructor;
        };
        maxW: {
            default: number;
            type: NumberConstructor;
        };
        minH: {
            default: number;
            type: NumberConstructor;
        };
        minW: {
            default: number;
            type: NumberConstructor;
        };
        rowHeight: {
            required: true;
            type: NumberConstructor;
        };
        static: {
            default: boolean;
            type: BooleanConstructor;
        };
        useCssTransforms: {
            required: true;
            type: BooleanConstructor;
        };
        w: {
            required: true;
            type: NumberConstructor;
        };
        x: {
            required: true;
            type: NumberConstructor;
        };
        y: {
            required: true;
            type: NumberConstructor;
        };
    }>> & {
        "onContainer-resized"?: (...args: any[]) => any;
        onResize?: (...args: any[]) => any;
        onResized?: (...args: any[]) => any;
        onMove?: (...args: any[]) => any;
        onMoved?: (...args: any[]) => any;
    } & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    breakpointCols: {
        required: true;
        type: PropType<Partial<Record<BreakpointsKeys, number>>>;
    };
    colNum: {
        required: true;
        type: NumberConstructor;
    };
    containerWidth: {
        required: true;
        type: NumberConstructor;
    };
    h: {
        required: true;
        type: NumberConstructor;
    };
    i: {
        required: true;
        type: StringConstructor;
    };
    isDraggable: {
        required: true;
        type: BooleanConstructor;
    };
    isResizable: {
        required: true;
        type: BooleanConstructor;
    };
    lastBreakpoint: {
        required: true;
        type: PropType<BreakpointsKeys>;
    };
    margin: {
        required: true;
        type: PropType<number[]>;
    };
    maxH: {
        default: number;
        type: NumberConstructor;
    };
    maxRows: {
        required: true;
        type: NumberConstructor;
    };
    maxW: {
        default: number;
        type: NumberConstructor;
    };
    minH: {
        default: number;
        type: NumberConstructor;
    };
    minW: {
        default: number;
        type: NumberConstructor;
    };
    rowHeight: {
        required: true;
        type: NumberConstructor;
    };
    static: {
        default: boolean;
        type: BooleanConstructor;
    };
    useCssTransforms: {
        required: true;
        type: BooleanConstructor;
    };
    w: {
        required: true;
        type: NumberConstructor;
    };
    x: {
        required: true;
        type: NumberConstructor;
    };
    y: {
        required: true;
        type: NumberConstructor;
    };
}>> & {
    "onContainer-resized"?: (...args: any[]) => any;
    onResize?: (...args: any[]) => any;
    onResized?: (...args: any[]) => any;
    onMove?: (...args: any[]) => any;
    onMoved?: (...args: any[]) => any;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("container-resized" | "resize" | "resized" | "move" | "moved")[], "container-resized" | "resize" | "resized" | "move" | "moved", {
    maxH: number;
    maxW: number;
    minH: number;
    minW: number;
    static: boolean;
}> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default: (_: {}) => any;
    };
});
export default _default;
