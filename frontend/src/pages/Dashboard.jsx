import { useAuthStore } from "../store/AuthStore";
import { motion } from "framer-motion";

function Home() {
  const { user, Logout } = useAuthStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleLogout = () => {
    Logout();
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
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-900 to-red-300 text-transparent bg-clip-text">
          Dashboard
        </h2>
        <div className="space-y-6">
          <motion.div
            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-rose-400 mb-3">
              Profile Information
            </h3>
            <p className="text-gray-300">Name: {user.username}</p>
            <p className="text-gray-300">Email: {user.email}</p>
            <hr className="my-8" />
            <h3 className="text-xl font-semibold text-rose-400 mb-3 ">
              Account Activity
            </h3>
            <p className="text-gray-300">
              <span className="font-bold">Joined: </span>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-300">
              <span className="font-bold">Last Login: </span>

              {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-5 w-full py-3 px-4 text-center bg-gradient-to-r from-red-800 to-pink-900 text-white font-bold rounded-lg shadow-lg hover:from-pink-900 hover:to-red-800 focus:outline-none transition duration-200"
        >
          Log Out
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Home;
