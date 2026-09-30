import { 
  fetchAllUsersFirestore, 
  updateUserProfileData, 
  updateUserRoleFirestore, 
  updateUserStatusFirestore,
  uploadFileToStorage
} from "../lib/firebase";
import { UserProfile } from "../types";

export const userService = {
  getAllUsers: fetchAllUsersFirestore,
  updateProfile: updateUserProfileData,
  updateRole: updateUserRoleFirestore,
  updateStatus: updateUserStatusFirestore,
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    const url = await uploadFileToStorage(file, `users/${userId}/profile`);
    await updateUserProfileData(userId, { photoURL: url, avatarUrl: url });
    return url;
  }
};
