import { create } from 'zustand'

export type AppState = {
  $type: string
  locked: boolean
  appName: string
  cubeId: string
  isRunning: boolean
  volume: number
  mqttConnected: boolean
}

type UseStore = {
  appState: AppState[]
  addAppState: (appState: AppState) => void
  updateAppState: (appState: AppState) => void
  findAppState: (cubeId: string) => AppState | undefined
  existsAppState: (cubeId: string) => boolean
}

export const useStore = create<UseStore>((set, get) => ({
  appState: [],
  addAppState: (appState) => set((state) => ({ appState: [...state.appState, appState] })),
  updateAppState: (appState) =>
    set((state) => ({
      appState: state.appState.map((state) => (state.cubeId === appState.cubeId ? appState : state)),
    })),
  findAppState: (cubeId) => {
    const { appState } = get()
    return appState.find((state) => state.cubeId === cubeId)
  },
  existsAppState: (cubeId) => {
    const { appState } = get()
    return appState.some((state) => state.cubeId === cubeId)
  },
}))

export default useStore
