import { motion } from "framer-motion";
import Input from "../components/Input";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

function ForgetPass() {
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  const handlePassReset = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [redirect, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.0,
      }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-xl shadow-xl overflow-hidden"
    >
      {redirect ? (
        <div className="bg-gradient-to-r from-gray-600 to-gray-400 text-transparent bg-clip-text my-20 mx-12 text-xl text-center font-semibold">
          If your email is correct, you will receive a reset link in your inbox
          shortly. For now, you will be redirected to the login page.
        </div>
      ) : (
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-pink-500 to-red-300 text-transparent bg-clip-text">
            Reset Password
          </h2>
          <form onSubmit={handlePassReset}>
            <Input
              Icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <motion.button
              className="w-full py-3 px-4 text-center bg-gradient-to-r from-red-800 to-pink-900 text-white font-bold rounded-lg shadow-lg hover:from-pink-900 hover:to-red-800 focus:outline-none transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              RESET PASSWORD
            </motion.button>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export default ForgetPass;
