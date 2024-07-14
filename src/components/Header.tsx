import { useMqttStore } from '@mirevi/puzzlecube-core'

// The useMQTTStore hook provides access to the MQTT store that holds the client and connection status.
// In this component it is used to display the connection status in the header.

const Header = () => {
  const { connectionStatus } = useMqttStore()

  return (
    <>
      <div className='border-b-white border-b-4'>
        <div className='py-4 flex items-center justify-between  '>
          {/* LOGO */}
          <div className='flex items-center gap-x-1 md:gap-x-2'>
            <p className='text-4xl md:text-6xl header-text'>CUBES PROJECT</p>
          </div>

          {/* Connection, Mute & Settings */}
          <div className='flex items-center gap-x-2 md:gap-x-3'>
            {/* Connection Anzeige */}
            <div className='w-30 h-30 border-4 border-black rounded px-2'>{connectionStatus}</div>
          </div>
        </div>
        <hr></hr>
      </div>
    </>
  )
}

export default Header
