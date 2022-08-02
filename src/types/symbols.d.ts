import { Emitter } from 'mitt';
import { Events } from '@/types/globals';
import { InjectionKey } from 'vue';
export declare const emitterKey: InjectionKey<Emitter<Events>>;
