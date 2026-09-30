import { 
  sendMessageFirestore, 
  subscribeToMessagesFirestore 
} from "../lib/firebase";
import { ChatMessage } from "../types";

export const messageService = {
  send: sendMessageFirestore,
  subscribe: subscribeToMessagesFirestore
};
