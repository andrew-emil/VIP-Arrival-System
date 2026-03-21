import { useEffect, useRef } from 'react';
import { useAlertStore } from '@/stores/alertStore';
import { generateRealtimeTicket, connectRealtimeStream } from '@/services/realtime/mutation';
import { Alert } from '@/types';

export function useSSE() {
  const addAlert = useAlertStore((s) => s.addAlert);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initStreaming() {
      try {
        const ticket = await generateRealtimeTicket();
        if (!mounted) return;

        const eventSource = connectRealtimeStream(ticket);
        eventSourceRef.current = eventSource;

        // Listen to custom alert events if needed, depending on how backend sends them.
        // Assuming the backend sends them as the default "message" event or "ALERT_CREATED"
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Realtime event received:", data);

            // Map the event payload to our Alert type
            // Assuming the event payload contains the session/alert info
            const incomingState = data.session || data;

            if (incomingState && incomingState.id) {
              const newAlert: Alert = {
                id: incomingState.id,
                vipId: incomingState.vip?.id || incomingState.vipId,
                vipName: incomingState.vip?.name || 'Unknown VIP',
                plateNumber: (incomingState.vip as unknown as { plate?: string })?.plate || incomingState.plateNumber || 'N/A',
                protocolLevel: (incomingState.vip?.protocolLevel as Alert['protocolLevel']) || incomingState.protocolLevel || 'C',
                cameraName: incomingState.camera?.name,
                cameraId: incomingState.camera?.id,
                status: incomingState.status as Alert['status'],
                timestamp: (incomingState.approachAt || incomingState.arrivedAt || incomingState.createdAt || new Date()).toString(),
                company: incomingState.vip?.company || incomingState.company || 'N/A',
                vipPhoto: incomingState.vip?.photoUrl || incomingState.vipPhoto || undefined,
              };
              addAlert(newAlert);
              playAlertSound(newAlert.status === 'ARRIVED');
            }
          } catch (e) {
            console.error("Error parsing realtime event", e);
          }
        };

      } catch (err) {
        console.error("Failed to initialize SSE", err);
      }
    }

    initStreaming();

    return () => {
      mounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [addAlert]);
}

function playAlertSound(isArrived: boolean) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = isArrived ? 880 : 660;
    osc.type = isArrived ? 'sine' : 'triangle';
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(ctx.currentTime + (isArrived ? 0.3 : 0.15));
    setTimeout(() => ctx.close(), 500);
  } catch {
    // Audio not available
  }
}
