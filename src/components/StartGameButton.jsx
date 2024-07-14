import { MqttCommunication } from './MqttCommunication';

/**
 * Test button component
 * @returns JSX.Element
 */
const StartGameButton = () => {
	const mqttCommunication = MqttCommunication();

	/**
	 * Handle the click event on the button
	 * @returns
	 */
	const handleStart = () => mqttCommunication.startGame();

	return (
		<div className='flex flex-col justify-center items-center h-80vh gap-10'>
			<div className='flex flex-col items-center text-8xl'>
				<p className='text-lg italic m-0 p-0'>Press me</p>
				<button
					className='w-52 border-8 border-black rounded px-2 font-martin tracking-wide active:bg-white active:transition-all duration-1000'
					onClick={handleStart}
				>
					START GAME
				</button>
			</div>
		</div>
	);
};

export default StartGameButton;
