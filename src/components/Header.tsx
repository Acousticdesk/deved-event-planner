import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo";

export function Header() {
  const navigate = useNavigate();
  return (
    <div className="border-b border-black mx-5">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl">
          {" "}
          <Logo></Logo>{" "}
        </Link>
        <p className="text-2xl">Edmonton Event EndPoint</p>
        <Button onClick={() => navigate("/create-event")}>Create Event</Button>
      </div>
    </div>
  );
}
