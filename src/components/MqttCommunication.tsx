import { useEffect, useState, useRef } from 'react';
import { useMqttStore } from '@mirevi/puzzlecube-core';
import useStore from '../stores/useStore';

const clients = [];
let hostIP = '';

export const MqttCommunication = () => {
	const { client } = useMqttStore();
	const { addAppState, existsAppState, updateAppState } = useStore();

	useEffect(() => {
		subscribeAndListenToAppState();
	}, [clients]);

	const subscribeAndListenToAppState = () => {
		if (client) {
			client.subscribe('puzzleCubes/+/app/state');
			client.subscribe('puzzleCubes/app/registerClient');
			client.subscribe('puzzleCubes/app/setHostIP');
			client.subscribe('puzzleCubes/app/notifyConnection');

			const messageHandler = (topic, message) => {
				const parsedMessage = JSON.parse(message.toString());

				if (topic.startsWith('puzzleCubes/') && topic.endsWith('/app/state')) {
					const cubeId = topic.split('/')[1];
					const appState = parsedMessage;
					const exists = existsAppState(cubeId);

					if (exists) {
						updateAppState(appState);
					} else {
						addAppState(appState);
					}
				} else if (topic === 'puzzleCubes/app/registerClient') {
					registerClient(parsedMessage.payload.clientId); // Ensure correct path to clientId
				} else if (topic === 'puzzleCubes/app/setHostIP') {
					setHostIPForClients(parsedMessage);
				}
			};

			client.on('message', messageHandler);
		}
	};

	const registerClient = (clientId) => {
		// Check if the clientId is already in the state
		if (!clients.includes(clientId)) {
			clients.push(clientId);
		}
	};

	const sendDesignateHost = () => {
		const hostClientId = clients[0];
		const payload = {
			command: 'designateHost',
			clientId: hostClientId,
			timestamp: new Date().toISOString(),
		};

		if (!client) return;
		client.publish(
			'puzzleCubes/app/designateHostCommand',
			JSON.stringify(payload)
		);
	};

	const setHostIPForClients = (parsedMessage) => {
		if (parsedMessage.setHostIP) {
			hostIP = parsedMessage.setHostIP.hostIP;

			// Now publish the extracted hostIP
			const payload = {
				command: 'setHostIPForClients',
				hostIP,
				timestamp: new Date().toISOString(),
			};

			if (!client) return;
			client.publish(
				'puzzleCubes/app/setHostIPForClients',
				JSON.stringify(payload)
			);
		}
	};

	const sendLevel = (levelId: string) => {
		const payload = {
			command: 'setLevel',
			levelId,
			timestamp: new Date().toISOString(),
		};

		if (!client) return;

		client.publish('puzzleCubes/app/sendLevel', JSON.stringify(payload));
	};

	const sendEmergency = (ipAddress: string) => {
		let ipAddressForPayload: string;

		if (!ipAddress) {
			ipAddressForPayload = hostIP;
		} else {
			ipAddressForPayload = ipAddress;
		}

		const payload = {
			command: 'setHostIPForClients',
			hostIP: ipAddressForPayload,
			timestamp: new Date().toISOString(),
		};

		if (!client) return;

		client.publish(
			'puzzleCubes/app/emergencyConnection',
			JSON.stringify(payload)
		);
	};

	const startGame = () => {
		const payload = '';

		if (!client) return;

		client.publish('puzzleCubes/app/startGameEvent', JSON.stringify(payload));
	};

	const restartGame = () => {
		const payload = '';

		if (!client) return;

		client.publish('puzzleCubes/app/restartGameEvent', JSON.stringify(payload));
	};

	return {
		subscribeAndListenToAppState,
		sendDesignateHost,
		sendLevel,
		sendEmergency,
		startGame,
		restartGame
	};
};

export default MqttCommunication;
