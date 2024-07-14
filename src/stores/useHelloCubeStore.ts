import { create } from 'zustand'

export type HelloCubeMessage = {
  
  message: string
  timestamp: string
}

type HelloCubeStore = {
  helloCubes: HelloCubeMessage[]
  addHelloCube: (helloCube: HelloCubeMessage) => void
}

export const useHelloCubeStore = create<HelloCubeStore>((set, get) => ({
  helloCubes: [],
  addHelloCube: (helloCube) => set((state) => ({ helloCubes: [helloCube, ...state.helloCubes ] })),
}))

export default useHelloCubeStore
