import { 
  createNotificationFirestore, 
  subscribeToUserNotificationsFirestore, 
  markNotificationReadFirestore 
} from "../lib/firebase";
import { AppNotification } from "../types";

export const notificationService = {
  create: createNotificationFirestore,
  subscribe: subscribeToUserNotificationsFirestore,
  markRead: markNotificationReadFirestore
};
