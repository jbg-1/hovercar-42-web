import {
	Connector,
	useMqttStore,
	useNeighbourhoodStore,
	CubeConnection,
} from '@mirevi/puzzlecube-core';
import Header from './components/Header';
import Button from './components/Button/Button';
import CubeWindow from './components/cubedisplay/CubeWindow';
import { MqttCommunication } from './components/MqttCommunication';
import { useState } from 'react';

import { useHelloCubeStore } from './stores/useHelloCubeStore';

// The Connector component is the entry point for the puzzlecube-core library.
// It connects to the MQTT broker and handles the communication for the cube state.
// It also provides default functions to send and receive messages.
// The Connector connects to the default broker at 192.168.111.1 on the production server in the puzzlecube network.
// It can be configured to connect to a different broker by passing the brokerUrl as a prop.
// Example: <Connector brokerUrl='localhost:9001' />y

function App() {
	const { connectionStatus } = useMqttStore();
	const mqttCommunication = MqttCommunication();
	const [mqttInitialized, setMqttInitialized] = useState(false);

	const { connectionPairSubject } = useNeighbourhoodStore();

	const { addHelloCube } = useHelloCubeStore();

	// Check the connection status and subscribe to the app state topic and helloCubes topic and listen for messages
	// This is done only once when the connection status changes to connected
	if (connectionStatus === 'connected' && !mqttInitialized) {
		mqttCommunication.subscribeAndListenToAppState();
		setMqttInitialized(true);

		// Subscribe to connectiopn pairs receivedc over MQTT - CAUTION: just subscribe once (here done by check for MQTT initialized)
		const subscription = connectionPairSubject.subscribe(
			(cp: CubeConnection) => {
				console.log('connectionPair:' + JSON.stringify(cp));
				addHelloCube({
					message: 'got connection pair [' + JSON.stringify(cp) + ']',
					timestamp: Date.now().toString(),
				});
			}
		);
	}

	return (
		<div className='flex relative'>
			<div className='px-7 min-h-screen h-fit bg-fft-yellow flex-1'>
				<Connector
					brokerUrl={
						'ws://' +
						import.meta.env.VITE_MQTT_HOST +
						':' +
						import.meta.env.VITE_MQTT_PORT
					}
				/>
				<Header />
				<div className='button-container'>
					<div className='button-wrapper button-wrapper--connect'>
						<p>1.</p>
						<Button type='connect' />
					</div>
					<div className='button-wrapper button-wrapper--level'>
						<p>2.</p>
						<Button type='level' />
					</div>
					<div className='button-wrapper button-wrapper--start'>
						<p>3.</p>
						<Button type='start' />
					</div>
					<div className="button-wrapper button-wrapper--restart">
						<Button type='restart' />
					</div>
					<div className='button-wrapper button-wrapper--emergency'>
						<p>(only use when cube can't host or you want to reconnect)</p>
						<Button type='emergency' />
					</div>
				</div>
				<CubeWindow />
			</div>
		</div>
	);
}

export default App;
