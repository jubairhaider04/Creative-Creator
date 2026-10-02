import { 
  createClientProjectFirestore, 
  subscribeToClientProjects, 
  subscribeToAllClientProjects, 
  getCachedClientProjects,
  updateProjectProgressFirestore,
  deleteClientProjectFirestore 
} from "../lib/firebase";
import { ClientProject } from "../types";

export const projectService = {
  create: createClientProjectFirestore,
  subscribeClient: subscribeToClientProjects,
  subscribeAll: subscribeToAllClientProjects,
  getCachedClient: getCachedClientProjects,
  updateProgress: updateProjectProgressFirestore,
  delete: deleteClientProjectFirestore
};
