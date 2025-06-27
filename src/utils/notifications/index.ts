/**
 * Notification System Utilities
 * 
 * Provides a centralized system for displaying toast notifications with:
 * - Consistent styling and behavior
 * - Optional sound effects
 * - Different types (success, error, info, warning)
 * - Customizable options
 */

import { toast, ToastOptions } from "react-toastify";

/**
 * Extended options for notifications
 * Adds sound playback option to standard toast options
 */
interface NotificationOptions extends ToastOptions {
    /** Whether to play a sound when showing the notification */
    playSound?: boolean;
}

/**
 * Default configuration for all notifications
 * Ensures consistent behavior and appearance
 */
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
 * Plays a notification sound if the page is visible
 * 
 * @param volume - Volume level between 0 and 1 (default: 0.5)
 * 
 * Sound is only played if:
 * - Document is focused
 * - Page is visible
 * - Audio playback is allowed by the browser
 */
const playNotificationSound = (volume: number = 0.5) => {
    try {
        if (document.hasFocus() && document.visibilityState === "visible") {
            const audio = new Audio("/assets/sounds/notification.mp3");
            audio.volume = volume;
            audio.play().catch((error) => {
                // Ignore user interaction errors (common and expected)
                if (error.name !== "NotAllowedError") {
                    // Log other errors silently without affecting the UI
                    console.warn("Notification sound playback failed:", error);
                }
            });
        }
    } catch (error) {
        // Log audio initialization errors silently
        console.warn("Notification sound initialization failed:", error);
    }
};

/**
 * Shows a success notification
 * 
 * @param message - The message to display
 * @param options - Optional configuration overrides
 * 
 * Used for:
 * - Successful operations
 * - Positive feedback
 * - Completion notifications
 */
export const showSuccess = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options };
    if (finalOptions.playSound) {
        playNotificationSound(0.3);
    }
    toast.success(message, finalOptions);
};

/**
 * Shows an error notification
 * 
 * @param message - The error message to display
 * @param options - Optional configuration overrides
 * 
 * Used for:
 * - Operation failures
 * - Error conditions
 * - Important warnings
 * 
 * Note: Automatically sets a longer display duration (5 seconds)
 */
export const showError = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options, autoClose: 5000 };
    if (finalOptions.playSound) {
        playNotificationSound(0.4);
    }
    toast.error(message, finalOptions);
};

/**
 * Shows an info notification
 * 
 * @param message - The informational message to display
 * @param options - Optional configuration overrides
 * 
 * Used for:
 * - General information
 * - Status updates
 * - Non-critical notifications
 */
export const showInfo = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options };
    if (finalOptions.playSound) {
        playNotificationSound(0.2);
    }
    toast.info(message, finalOptions);
};

/**
 * Shows a warning notification
 * 
 * @param message - The warning message to display
 * @param options - Optional configuration overrides
 * 
 * Used for:
 * - Potential issues
 * - Important notices
 * - Non-error alerts
 * 
 * Note: Sets a medium display duration (4 seconds)
 */
export const showWarning = (message: string, options?: NotificationOptions) => {
    const finalOptions = { ...defaultOptions, ...options, autoClose: 4000 };
    if (finalOptions.playSound) {
        playNotificationSound(0.35);
    }
    toast.warning(message, finalOptions);
};
