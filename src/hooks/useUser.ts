import { useAuth } from "../context/AuthContext";

export const useUser = () => {
  const { user, profile, loading, isAuthenticated, updateProfile } = useAuth();
  return {
    user,
    profile,
    loading,
    isAuthenticated,
    updateProfile
  };
};

export default useUser;
