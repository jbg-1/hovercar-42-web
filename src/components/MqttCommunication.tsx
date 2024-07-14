import { useEffect, useState, useRef } from 'react';
import { useMqttStore } from '@mirevi/puzzlecube-core';
import useStore from '../stores/useStore';

const clients = [];

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
					console.log('Received client registration message:', parsedMessage);
					registerClient(parsedMessage.payload.clientId); // Ensure correct path to clientId
				} else if (topic === 'puzzleCubes/app/setHostIP') {
					console.log('Received hostIP message:', parsedMessage);
					setHostIPClients(parsedMessage);
				}
			};

			client.on('message', messageHandler);
		}
	};

	const registerClient = (clientId) => {
		console.log('Received client registration message:', clientId);
		console.log('Registered clients:', clients || 'No clients registered.');

		// Check if the clientId is already in the state
		if (!clients.includes(clientId)) {
			clients.push(clientId);
		} else {
			console.log('Client ID', clientId, 'is already registered.');
		}
	};

	const sendDesignateHost = () => {
		console.log('Sending designateHost command...');
		console.log('Registered clients:' + clients || 'No clients registered.');
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

	const setHostIPClients = (parsedMessage) => {
		if (parsedMessage.setHostIP) {
			const hostIP = parsedMessage.setHostIP.hostIP;
			console.log('Received hostIP:', hostIP);

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

	const startGame = () => {
		console.log('Sending startGame command...');

		const payload = '';

		if (!client) return;

		client.publish(
			'puzzleCubes/app/allConnectedEvent',
			JSON.stringify(payload)
		);
	};

	return {
		subscribeAndListenToAppState,
		sendDesignateHost,
		startGame,
	};
};

export default MqttCommunication;
