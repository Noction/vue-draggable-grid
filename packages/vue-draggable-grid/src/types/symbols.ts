import { Emitter } from 'mitt'
import { InjectionKey } from 'vue'
import { MittEvents } from '@/types/mitt'

export const emitterKey: InjectionKey<Emitter<MittEvents>> = Symbol('$emitter')
