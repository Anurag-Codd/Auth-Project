import React, { useState } from "react";
import { motion } from "framer-motion";
import { RectangleEllipsis } from "lucide-react";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";

function ResetPass() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Check your Password");
      return;
    }
    try {
      await resetPassword(token, newPassword);
      alert("Password Reset Successful");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
      }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-red-300 text-transparent bg-clip-text">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword}>
          <Input
            Icon={RectangleEllipsis}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            Icon={RectangleEllipsis}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <p className="text-white font-semibold m-2 text-sm">{error}</p>
          )}
          <motion.button
            className="w-full py-3 px-4 text-center bg-gradient-to-r from-red-800 to-pink-900 text-white font-bold rounded-lg shadow-lg hover:from-pink-900 hover:to-red-800 focus:outline-none transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            SET NEW PASSWORD
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default ResetPass;
