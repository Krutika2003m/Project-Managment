import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard</h2>

                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="card p-3 mb-4">
                <h4>Welcome, {user?.name}</h4>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>

                {user?.imgPath && (
                    <img
                        src={user.imgPath}
                        alt="Profile"
                        width="100"
                        height="100"
                        style={{ borderRadius: "50%" }}
                    />
                )}
            </div>

            {user?.role === "admin" && (
                <div className="card p-3 bg-light">
                    <h3>Admin Dashboard</h3>
                    <p>You can manage users, projects, tasks, and approvals.</p>

                    <button className="btn btn-primary me-2">
                        Manage Users
                    </button>

                    <button className="btn btn-success me-2">
                        Manage Projects
                    </button>

                    <button className="btn btn-warning">
                        Manage Tasks
                    </button>
                </div>
            )}

            {user?.role === "HOD" && (
                <div className="card p-3 bg-light">
                    <h3>HOD Dashboard</h3>
                    <p>You can view assigned projects and manage department tasks.</p>

                    <button className="btn btn-primary me-2">
                        View Department Projects
                    </button>

                    <button className="btn btn-success">
                        View Tasks
                    </button>
                </div>
            )}

            {user?.role === "user" && (
                <div className="card p-3 bg-light">
                    <h3>User Dashboard</h3>
                    <p>You can view your assigned tasks and update task progress.</p>

                    <button className="btn btn-primary">
                        My Tasks
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;