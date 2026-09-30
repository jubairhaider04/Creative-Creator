import React from "react";
import { AuthModal } from "./AuthModal";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthPageProps {
  initialMode: "login" | "register" | "forgot-password";
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Render the full Auth dialog directly on page */}
      <AuthModal
        isOpen={true}
        onClose={handleClose}
        initialMode={initialMode}
      />
    </div>
  );
};
