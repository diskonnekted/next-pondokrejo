import { env } from "process";

/**
 * WebSocket Utilities for Real-time Features
 * Handles real-time data synchronization for statistics, notifications, and live updates
 */

// WebSocket connection states
export enum WebSocketState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

// Message types for real-time updates
export enum MessageType {
    STATISTICS_UPDATE = "statistics_update",
    EMERGENCY_ALERT = "emergency_alert",
    NOTIFICATION = "notification",
    WEATHER_UPDATE = "weather_update",
    COMMUNITY_UPDATE = "community_update",
    SDGS_UPDATE = "sdgs_update",
    HEARTBEAT = "heartbeat",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error",
}

// Base message interface
export interface WebSocketMessage {
    type: MessageType;
    timestamp: number;
    data: unknown;
    id?: string;
}

// Statistics update message
export interface StatisticsUpdateMessage extends WebSocketMessage {
    type: MessageType.STATISTICS_UPDATE;
    data: {
        category: "population" | "finance" | "infrastructure" | "services";
        metrics: Record<string, number>;
        trends?: Record<string, number>;
        lastUpdate: string;
    };
}

// Emergency alert message
export interface EmergencyAlertMessage extends WebSocketMessage {
    type: MessageType.EMERGENCY_ALERT;
    data: {
        severity: "low" | "medium" | "high" | "critical";
        title: string;
        message: string;
        location?: string;
        affectedAreas?: string[];
        expiresAt?: string;
        actions?: string[];
    };
}

// Notification message
export interface NotificationMessage extends WebSocketMessage {
    type: MessageType.NOTIFICATION;
    data: {
        title: string;
        message: string;
        category: "info" | "success" | "warning" | "error";
        priority: "low" | "normal" | "high";
        actions?: Array<{
            label: string;
            action: string;
        }>;
        expiresAt?: string;
    };
}

// Weather update message
export interface WeatherUpdateMessage extends WebSocketMessage {
    type: MessageType.WEATHER_UPDATE;
    data: {
        temperature: number;
        humidity: number;
        condition: string;
        windSpeed: number;
        windDirection: string;
        forecast?: Array<{
            date: string;
            condition: string;
            temperature: {
                min: number;
                max: number;
            };
        }>;
    };
}

// Community update message
export interface CommunityUpdateMessage extends WebSocketMessage {
    type: MessageType.COMMUNITY_UPDATE;
    data: {
        type: "poll" | "suggestion" | "complaint" | "volunteer";
        action: "created" | "updated" | "resolved" | "closed";
        item: {
            id: string;
            title: string;
            description?: string;
            author?: string;
        };
        metadata?: Record<string, unknown>;
    };
}

// SDGs update message
export interface SDGsUpdateMessage extends WebSocketMessage {
    type: MessageType.SDGS_UPDATE;
    data: {
        goalNumber: number;
        progress: number;
        achievement?: string;
        newProgram?: {
            id: string;
            name: string;
            description: string;
            target: number;
        };
    };
}

// WebSocket connection configuration
export interface WebSocketConfig {
    url: string;
    protocols?: string[];
    reconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatInterval?: number;
    debug?: boolean;
}

// Event handlers interface
export interface WebSocketEventHandlers {
    onOpen?: () => void;
    onClose?: (event: CloseEvent) => void;
    onMessage?: (message: WebSocketMessage) => void;
    onError?: (error: Event) => void;
    onStatisticsUpdate?: (data: StatisticsUpdateMessage["data"]) => void;
    onEmergencyAlert?: (data: EmergencyAlertMessage["data"]) => void;
    onNotification?: (data: NotificationMessage["data"]) => void;
    onWeatherUpdate?: (data: WeatherUpdateMessage["data"]) => void;
    onCommunityUpdate?: (data: CommunityUpdateMessage["data"]) => void;
    onSDGsUpdate?: (data: SDGsUpdateMessage["data"]) => void;
}

// Main WebSocket class
export class RealtimeWebSocket {
    private ws: WebSocket | null = null;
    private config: WebSocketConfig;
    private handlers: WebSocketEventHandlers;
    private reconnectAttempts = 0;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private isManualClose = false;

    constructor(config: WebSocketConfig, handlers: WebSocketEventHandlers = {}) {
        this.config = {
            reconnectAttempts: 5,
            reconnectInterval: 3000,
            heartbeatInterval: 30000,
            debug: false,
            ...config,
        };

        this.handlers = handlers;
    }

    /**
     * Connect to WebSocket server
     */
    connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.debug("WebSocket already connected");
            return;
        }

        this.isManualClose = false;
        this.debug("Connecting to WebSocket:", this.config.url);

        try {
            this.ws = new WebSocket(this.config.url, this.config.protocols);
            this.setupEventListeners();
        } catch (error) {
            this.debug("WebSocket connection error:", error);
            this.handleError(error as Event);
        }
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        this.isManualClose = true;
        this.clearTimers();

        if (this.ws) {
            this.debug("Manually disconnecting WebSocket");
            this.ws.close(1000, "Manual disconnect");
            this.ws = null;
        }
    }

    /**
     * Send message to WebSocket server
     */
    send(message: Partial<WebSocketMessage>): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.debug("Cannot send message - WebSocket not connected");
            return;
        }

        const fullMessage: WebSocketMessage = {
            type: MessageType.NOTIFICATION,
            timestamp: Date.now(),
            data: {},
            ...message,
        };

        try {
            this.ws.send(JSON.stringify(fullMessage));
            this.debug("Message sent:", fullMessage);
        } catch (error) {
            this.debug("Error sending message:", error);
        }
    }

    /**
     * Get current connection state
     */
    get readyState(): WebSocketState {
        return this.ws?.readyState ?? WebSocketState.CLOSED;
    }

    /**
     * Check if WebSocket is connected
     */
    get isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    /**
     * Setup WebSocket event listeners
     */
    private setupEventListeners(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            this.debug("WebSocket connected");
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.handlers.onOpen?.();
        };

        this.ws.onclose = (event) => {
            this.debug("WebSocket disconnected:", event.code, event.reason);
            this.clearTimers();
            this.handlers.onClose?.(event);

            if (!this.isManualClose && this.reconnectAttempts < (this.config.reconnectAttempts ?? 5)) {
                this.scheduleReconnect();
            }
        };

        this.ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                this.debug("Message received:", message);
                this.handleMessage(message);
            } catch (error) {
                this.debug("Error parsing message:", error);
            }
        };

        this.ws.onerror = (event) => {
            this.debug("WebSocket error:", event);
            this.handleError(event);
        };
    }

    /**
     * Handle incoming messages
     */
    private handleMessage(message: WebSocketMessage): void {
        this.handlers.onMessage?.(message);

        switch (message.type) {
            case MessageType.STATISTICS_UPDATE:
                this.handlers.onStatisticsUpdate?.(message.data as StatisticsUpdateMessage["data"]);
                break;

            case MessageType.EMERGENCY_ALERT:
                this.handlers.onEmergencyAlert?.(message.data as EmergencyAlertMessage["data"]);
                break;

            case MessageType.NOTIFICATION:
                this.handlers.onNotification?.(message.data as NotificationMessage["data"]);
                break;

            case MessageType.WEATHER_UPDATE:
                this.handlers.onWeatherUpdate?.(message.data as WeatherUpdateMessage["data"]);
                break;

            case MessageType.COMMUNITY_UPDATE:
                this.handlers.onCommunityUpdate?.(message.data as CommunityUpdateMessage["data"]);
                break;

            case MessageType.SDGS_UPDATE:
                this.handlers.onSDGsUpdate?.(message.data as SDGsUpdateMessage["data"]);
                break;

            case MessageType.HEARTBEAT:
                this.debug("Heartbeat received");
                this.sendHeartbeatResponse();
                break;

            case MessageType.CONNECTED:
                this.debug("Server confirmation of connection");
                break;

            case MessageType.DISCONNECTED:
                this.debug("Server initiated disconnect");
                break;

            case MessageType.ERROR:
                this.debug("Server error:", message.data);
                break;

            default:
                this.debug("Unknown message type:", message.type);
        }
    }

    /**
     * Handle WebSocket errors
     */
    private handleError(error: Event): void {
        this.handlers.onError?.(error);
    }

    /**
     * Schedule reconnection attempt
     */
    private scheduleReconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        const delay = (this.config.reconnectInterval ?? 3000) * Math.pow(2, this.reconnectAttempts);
        this.debug(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    /**
     * Start heartbeat interval
     */
    private startHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }

        this.heartbeatTimer = setInterval(() => {
            this.sendHeartbeat();
        }, this.config.heartbeatInterval);
    }

    /**
     * Send heartbeat message
     */
    private sendHeartbeat(): void {
        this.send({
            type: MessageType.HEARTBEAT,
            data: { timestamp: Date.now() },
        });
    }

    /**
     * Send heartbeat response
     */
    private sendHeartbeatResponse(): void {
        this.send({
            type: MessageType.HEARTBEAT,
            data: {
                timestamp: Date.now(),
                response: true,
            },
        });
    }

    /**
     * Clear all timers
     */
    private clearTimers(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    /**
     * Debug logging
     */
    private debug(...args: unknown[]): void {
        if (this.config.debug) {
            console.log("[WebSocket]", ...args);
        }
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        this.disconnect();
        this.clearTimers();
        this.ws = null;
    }
}

/**
 * Hook for using WebSocket in React components
 */
export function useWebSocket(config: WebSocketConfig, handlers: WebSocketEventHandlers = {}) {
    const [connectionState, setConnectionState] = useState<WebSocketState>(WebSocketState.CLOSED);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const wsRef = useRef<RealtimeWebSocket | null>(null);

    // Update handlers
    const updateHandlers = (newHandlers: WebSocketEventHandlers) => {
        if (wsRef.current) {
            // Create new instance with updated handlers
            wsRef.current.destroy();
            wsRef.current = new RealtimeWebSocket(config, {
                ...handlers,
                ...newHandlers,
                onOpen: () => {
                    setConnectionState(WebSocketState.OPEN);
                    handlers.onOpen?.();
                    newHandlers.onOpen?.();
                },
                onClose: (event) => {
                    setConnectionState(WebSocketState.CLOSED);
                    handlers.onClose?.(event);
                    newHandlers.onClose?.(event);
                },
                onMessage: (message) => {
                    setLastMessage(message);
                    handlers.onMessage?.(message);
                    newHandlers.onMessage?.(message);
                },
            });
        }
    };

    // Initialize WebSocket
    useEffect(() => {
        wsRef.current = new RealtimeWebSocket(config, {
            ...handlers,
            onOpen: () => {
                setConnectionState(WebSocketState.OPEN);
                handlers.onOpen?.();
            },
            onClose: (event) => {
                setConnectionState(WebSocketState.CLOSED);
                handlers.onClose?.(event);
            },
            onMessage: (message) => {
                setLastMessage(message);
                handlers.onMessage?.(message);
            },
        });

        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.url, handlers]);

    return {
        connectionState,
        isConnected: connectionState === WebSocketState.OPEN,
        lastMessage,
        sendMessage: (message: Partial<WebSocketMessage>) => {
            wsRef.current?.send(message);
        },
        disconnect: () => {
            wsRef.current?.disconnect();
        },
        reconnect: () => {
            wsRef.current?.connect();
        },
        updateHandlers,
    };
}

/**
 * Default WebSocket configuration for development
 */
export const DEFAULT_WEBSOCKET_CONFIG: WebSocketConfig = {
    url: env.NEXT_PUBLIC_WS_URL ?? "wss://devoneclickpondokrejo.slemankab.go.id/ws",
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    heartbeatInterval: 30000,
    debug: env.NODE_ENV === "development",
};

/**
 * WebSocket configuration for production
 */
export const PRODUCTION_WEBSOCKET_CONFIG: WebSocketConfig = {
    url: env.NEXT_PUBLIC_WS_URL ?? "wss://devoneclickpondokrejo.slemankab.go.id/ws",
    reconnectAttempts: 10,
    reconnectInterval: 5000,
    heartbeatInterval: 60000,
    debug: false,
};

/**
 * Factory function to create WebSocket instance with proper configuration
 */
export function createWebSocket(
    handlers: WebSocketEventHandlers = {},
    isProduction = env.NODE_ENV === "production"
): RealtimeWebSocket {
    const config = isProduction ? PRODUCTION_WEBSOCKET_CONFIG : DEFAULT_WEBSOCKET_CONFIG;
    return new RealtimeWebSocket(config, handlers);
}

// React hook import
import { useState, useEffect, useRef } from "react";
