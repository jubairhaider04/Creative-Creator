import { 
  createClientProjectFirestore, 
  subscribeToClientProjects, 
  subscribeToAllClientProjects, 
  updateProjectProgressFirestore,
  deleteClientProjectFirestore 
} from "../lib/firebase";
import { ClientProject } from "../types";

export const projectService = {
  create: createClientProjectFirestore,
  subscribeClient: subscribeToClientProjects,
  subscribeAll: subscribeToAllClientProjects,
  updateProgress: updateProjectProgressFirestore,
  delete: deleteClientProjectFirestore
};
