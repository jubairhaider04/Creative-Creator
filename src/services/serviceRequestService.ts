import { 
  createServiceRequestFirestore, 
  subscribeToClientServiceRequests, 
  subscribeToAllServiceRequests, 
  updateServiceRequestStatusFirestore 
} from "../lib/firebase";
import { ServiceRequest } from "../types";

export const serviceRequestService = {
  create: createServiceRequestFirestore,
  subscribeClient: subscribeToClientServiceRequests,
  subscribeAll: subscribeToAllServiceRequests,
  updateStatus: updateServiceRequestStatusFirestore
};
