import { useEffect, useState, useRef } from "react";
import { useMqttStore } from "@mirevi/puzzlecube-core";
import useStore from "../stores/useStore";

export const MqttCommunication = () => {
  const { client } = useMqttStore();
  const { addAppState, existsAppState, updateAppState } = useStore();
  const [clients, setClients] = useState([]);
  const [connectedClients, setConnectedClients] = useState([]);
  const isSubscribed = useRef(false); 

  useEffect(() => {
    if (!isSubscribed.current && client) {
      subscribeAndListenToAppState();
      isSubscribed.current = true;
    }
  }, [client]);

  const subscribeAndListenToAppState = () => {
    if (client) {
      client.subscribe("puzzleCubes/+/app/state");
      client.subscribe("puzzleCubes/app/registerClient");
      client.subscribe("puzzleCubes/app/setHostIP");
      client.subscribe("puzzleCubes/app/notifyConnection");

      const messageHandler = (topic, message) => {
        const parsedMessage = JSON.parse(message.toString());

        if (topic.startsWith("puzzleCubes/") && topic.endsWith("/app/state")) {
          const cubeId = topic.split("/")[1];
          const appState = parsedMessage;
          const exists = existsAppState(cubeId);

          if (exists) {
            updateAppState(appState);
          } else {
            addAppState(appState);
          }
        } else if (topic === "puzzleCubes/app/registerClient") {
          console.log("Received client registration message:", parsedMessage);
          registerClient(parsedMessage.payload.clientId); // Ensure correct path to clientId
        } else if (topic === "puzzleCubes/app/setHostIP") {
          console.log("Received hostIP message:", parsedMessage);
          setHostIPClients(parsedMessage);
        } else if (topic === "puzzleCubes/app/notifyConnection") {
          console.log("Received notifyConnection message:", parsedMessage);
          notifyConnection(parsedMessage);
        }
      };

      client.on("message", messageHandler);

      // Cleanup function to remove event listeners when the component unmounts
      return () => {
        client.off("message", messageHandler);
        isSubscribed.current = false;
      };
    }
  };

  const registerClient = (clientId) => {
    console.log("Received client registration message:", clientId);

    // Check if the clientId is already in the state
    if (!clients.includes(clientId)) {
      setClients((prevClients) => [clientId, ...prevClients]);
    } else {
      console.log("Client ID", clientId, "is already registered.");
    }
  };

  const sendDesignateHost = () => {
    console.log("Sending designateHost command...");
    console.log("Registered clients:" + clients || "No clients registered.");
    const hostClientId = clients[0];
    const payload = {
      command: "designateHost",
      clientId: hostClientId,
      timestamp: new Date().toISOString(),
    };

    if (!client) return;
    client.publish(
      "puzzleCubes/app/designateHostCommand",
      JSON.stringify(payload)
    );
  };

  const setHostIPClients = (parsedMessage) => {
    if (parsedMessage.setHostIP) {
      const hostIP = parsedMessage.setHostIP.hostIP;
      console.log("Received hostIP:", hostIP);

      // Now publish the extracted hostIP
      const payload = {
        command: "setHostIPForClients",
        hostIP,
        timestamp: new Date().toISOString(),
      };

      if (!client) return;
      client.publish(
        "puzzleCubes/app/setHostIPForClients",
        JSON.stringify(payload)
      );
    }
  };

  const notifyConnection = (parsedMessage) => {
    console.log("Received notifyConnection message:", parsedMessage);
    if (parsedMessage.notifyConnection) {
      const clientId = parsedMessage.clientId;
      console.log("Received clientId from notifyConnection:", clientId);

      // Add the clientId to the connectedClients array
      if (!connectedClients.includes(clientId)) {
        setConnectedClients((prevConnectedClients) => [
          ...prevConnectedClients,
          clientId,
        ]);
      }

      // Check if connectedClients matches clients
      setTimeout(() => {
        if (
          clients.length === connectedClients.length &&
          clients.every((clientId) => connectedClients.includes(clientId))
        ) {
          if (!client) return;
          client.publish(
            "puzzleCubes/app/allConnectedEvent",
            JSON.stringify("")
          );
        }
      }, 0);
    }
  };

  return {
    subscribeAndListenToAppState,
    sendDesignateHost,
  };
};

export default MqttCommunication;
