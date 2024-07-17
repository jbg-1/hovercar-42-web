import { useState } from 'react';
import MqttCommunication from '../MqttCommunication';

const Button = ({ type }) => {
	const mqttCommunication = MqttCommunication();
	const [level, setLevel] = useState('');
	const [ipAddress, setIpAddress] = useState('');
	const [buttonStatus, setButtonStatus] = useState('');
	const [buttonStatusHide, setButtonStatusHide] = useState('');

	const handleClick = () => {
		if (type === 'connect') {
			mqttCommunication.sendDesignateHost();
			setButtonStatus('Connected✅');
		} else if (type === 'level') {
			if (level === '') {
				setButtonStatus('Please enter a level ID');
				return;
			}

			mqttCommunication.sendLevel(level);
			setButtonStatus('Level selected✅');

			toggleButtonStatusVisibility();
		} else if (type === 'start') {
			mqttCommunication.startGame();
			setButtonStatus('Game started✅');

			toggleButtonStatusVisibility();
		} else if (type === 'emergency') {
			mqttCommunication.sendEmergency(ipAddress);
			setButtonStatus('IP address sent✅');

			toggleButtonStatusVisibility();
		} else if (type === 'restart') {
			mqttCommunication.restartGame();
			setButtonStatus('Game restarted✅');

			toggleButtonStatusVisibility();
		}
	};

	let text = '';
	if (type === 'connect') {
		text = 'Setup connection';
	} else if (type === 'level') {
		text = 'Send level';
	} else if (type === 'start') {
		text = 'Start game';
	} else if (type === 'emergency') {
		text = 'Emergency';
	} else if (type === 'restart') {
		text = 'Restart game';
	}

	const toggleButtonStatusVisibility = () => {
		setButtonStatusHide('visible');

		setTimeout(() => {
			setButtonStatusHide('hidden');
		}, 2000);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{type === 'level' && (
				<input
					className='number-input'
					type='text'
					id='levelId'
					placeholder='Level ID'
					onChange={(e) => setLevel(e.target.value)}
				/>
			)}
			{type === 'emergency' && (
				<input
					className='text-input'
					type='text'
					id='emergencyId'
					placeholder='IP Address'
					onChange={(e) => setIpAddress(e.target.value)}
				/>
			)}
			<button
				disabled={buttonStatus !== '' && type === 'connect' ? true : false}
				className={`button button--${type}`}
				onClick={handleClick}
			>
				{text}
			</button>
			<p className={`button-status button-status--${buttonStatusHide}`}>{buttonStatus}</p>
		</div>
	);
};

export default Button;
