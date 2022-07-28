import { Emitter } from 'mitt'
import { Events } from '@/types/globals'
import { InjectionKey } from 'vue'

export const emitterKey: InjectionKey<Emitter<Events>> = Symbol('$emitter')
