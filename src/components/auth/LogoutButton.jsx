import { useNavigate } from "react-router-dom";
import { signOut } from "../../services/auth";

function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700 transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;