import { 
  saveInquiryToFirestore, 
  subscribeToLeadsFirestore, 
  updateLeadStatusFirestore 
} from "../lib/firebase";

export const leadService = {
  create: saveInquiryToFirestore,
  subscribe: subscribeToLeadsFirestore,
  updateStatus: updateLeadStatusFirestore
};
