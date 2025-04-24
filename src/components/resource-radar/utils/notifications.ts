import { toast, ToastOptions } from "react-toastify";

interface NotificationOptions extends ToastOptions {
    playSound?: boolean;
}

const defaultOptions: NotificationOptions = {
    position: "top-right",
    containerId: "global-notifications",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    playSound: true,
};

/**
 * Plays a notification sound
 * @param volume - Volume level between 0 and 1
 */
const playNotificationSound = (volume: number = 0.5) => {
    try {
        if (document.hasFocus() && document.visibilityState === "visible") {
            const audio = new Audio("/assets/sounds/notification.mp3");
            audio.volume = volume;
            audio.play().catch((error) => {
                if (error.name !== "NotAllowedError") {
                    console.error("Failed to play notification sound:", error);
                }
            });
        }
    } catch (error) {
        console.error("Failed to play notification sound:", error);
    }
};

/**
 * Shows a success toast notification with optional sound
 */
export const showSuccess = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options };
    if (finalOptions.playSound) {
        playNotificationSound(0.3);
    }
    toast.success(message, finalOptions);
};

/**
 * Shows an error toast notification with optional sound
 */
export const showError = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options, autoClose: 5000 };
    if (finalOptions.playSound) {
        playNotificationSound(0.4);
    }
    toast.error(message, finalOptions);
};

/**
 * Shows an info toast notification with optional sound
 */
export const showInfo = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options };
    if (finalOptions.playSound) {
        playNotificationSound(0.2);
    }
    toast.info(message, finalOptions);
};

/**
 * Shows a warning toast notification with optional sound
 */
export const showWarning = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options, autoClose: 4000 };
    if (finalOptions.playSound) {
        playNotificationSound(0.35);
    }
    toast.warning(message, finalOptions);
};
