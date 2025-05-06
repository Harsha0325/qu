import { useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import api from "../qutree/api"; // Import the axios instance

let stompClient = null;

const useNotificationSocket = (userId, onMessageReceived) => {
  useEffect(() => {
    // Extract the base URL from axios instance and remove "/api/quicky_net"
    const baseURL = api.defaults.baseURL.replace("/api/quicky_net", "");

    const socket = new SockJS(`${baseURL}/ws-notifications`);
    stompClient = over(socket);

    stompClient.connect(
      {},
      () => {
        console.log("WebSocket connected");
        if (stompClient && stompClient.connected) {
          stompClient.subscribe(`/topic/notifications/${userId}`, (msg) => {
            if (msg.body) {
              const payload = JSON.parse(msg.body);
              onMessageReceived(payload);
            }
          });
        }
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, [userId]);
};

export default useNotificationSocket;
