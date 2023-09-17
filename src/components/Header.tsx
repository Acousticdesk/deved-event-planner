import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo";

export function Header() {
  const navigate = useNavigate();
  return (
    <div className="border-b border-black">
      <div className="flex justify-between">
        <Link to="/" className="text-3xl">
          {" "}
          <Logo></Logo>{" "}
        </Link>
        <Button onClick={() => navigate("/create-event")}>Create Event</Button>
      </div>
    </div>
  );
}
