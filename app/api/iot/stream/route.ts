import { fetchAllIoTData } from "@/lib/thingspeak";
import { CORS_HEADERS } from "@/lib/api-service";

const activeConnections: Set<ReadableStreamDefaultController> = new Set();

export async function GET() {
    const encoder = new TextEncoder();

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
        start(controller) {
            activeConnections.add(controller);

            // Send initial connection message
            const connectionMessage = {
                type: "connection",
                message: "Connected to IoT data stream",
                timestamp: new Date().toISOString(),
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(connectionMessage)}\n\n`));

            // Start the polling interval
            startPolling(controller, encoder);
        },

        cancel() {
            // Cleanup when client disconnects
            for (const controller of activeConnections) {
                if (controller.desiredSize === 0) {
                    activeConnections.delete(controller);
                }
            }
        },
    });

    // Stop polling when the last client disconnects
    if (activeConnections.size === 0) {
        stopPolling();
    }

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": CORS_HEADERS["Access-Control-Allow-Origin"],
            "Access-Control-Allow-Headers": "Cache-Control",
        },
    });
}

let pollingInterval: NodeJS.Timeout | null = null;

function startPolling(controller: ReadableStreamDefaultController, encoder: TextEncoder) {
    if (pollingInterval) return;

    console.log("Starting IoT data polling...");

    const poll = async () => {
        try {
            const startTime = Date.now();
            const data = await fetchAllIoTData();
            const fetchDuration = Date.now() - startTime;

            console.log(`IoT data fetched in ${fetchDuration}ms`);

            const message = {
                type: "iot-update",
                data: data,
                timestamp: new Date().toISOString(),
            };

            // Send to all active connections
            const encodedMessage = encoder.encode(`data: ${JSON.stringify(message)}\n\n`);

            for (const conn of activeConnections) {
                try {
                    conn.enqueue(encodedMessage);
                } catch (error) {
                    console.error("Error sending to client:", error);
                    activeConnections.delete(conn);
                }
            }
        } catch (error) {
            console.error("Error polling IoT data:", error);

            // Send error message to clients
            const errorMessage = {
                type: "error",
                message: "Failed to fetch IoT data",
                timestamp: new Date().toISOString(),
            };

            try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorMessage)}\n\n`));
            } catch (e) {
                console.error("Error sending error message:", e);
            }
        }
    };

    // Initial poll - run immediately (will use cache if available)
    poll();

    // Poll every 15 seconds (matching cache duration)
    pollingInterval = setInterval(poll, 15000);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log("IoT data polling stopped");
    }
}

// Cleanup on server shutdown
process.on("SIGTERM", stopPolling);
process.on("SIGINT", stopPolling);
