import usePerformanceBotStore from '../../stores/useStore.ts'
import { useCubeStateStore, useMqttStore } from '@mirevi/puzzlecube-core'

const CubeMode = () => {
  const { cubeState } = useCubeStateStore()
  const { findAppState } = usePerformanceBotStore()

  return (
    <div className='p-10 block w-full h-full'>
      <div className='text-white flex flex-wrap gap-8 font-sourceSansPro font-bold'>
        {cubeState.map((cube, index) => {
          let appState = findAppState(cube.id)

          return (
            <div
              key={index}
              className='w-[320px] h-[320px] bg-cubestate-grey/10'
            >
              {findAppState(cube.id)?.isRunning == true ? (
                <p className='h-full w-full flex justify-center items-center flex-col tracking-wider uppercase text-2xl'>
                  <p>{cube.id}</p>
                  <p>ACTIVE</p>
                </p>
              ) : (
                <div className='h-full w-full flex justify-center items-center flex-col tracking-wider uppercase text-2xl'>
                  <p>{cube.id}</p>
                  <p>INACTIVE</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CubeMode
