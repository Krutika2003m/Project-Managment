import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getUserInfo } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginUser(formData));

        if (result.meta.requestStatus === "fulfilled") {
            await dispatch(getUserInfo());
            navigate("/dashboard");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="form-control mb-3"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    className="form-control mb-3"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button className="btn btn-success" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <Link to='/register'>If not Registered</Link>
            </form>
        </div>
    );
};

export default Login;