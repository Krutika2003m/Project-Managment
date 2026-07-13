import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, registrationStatus } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
    });

    const [imgPath, setImgPath] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setImgPath(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("contactNumber", formData.contactNumber);
        data.append("imgPath", imgPath);

        const result = await dispatch(registerUser(data));

        if (result.meta.requestStatus === "fulfilled") {
            navigate("/");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>

            {error && <p className="text-danger">{error}</p>}

            {registrationStatus === "success" && (
                <p className="text-success">Registration successful</p>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="form-control mb-3"
                    value={formData.name}
                    onChange={handleChange}
                />

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
                {/* write code for retype password  */}

                <input
                    type="text"
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    className="form-control mb-3"
                    value={formData.contactNumber}
                    onChange={handleChange}
                />

                <input
                    type="file"
                    name="imgPath"
                    className="form-control mb-3"
                    onChange={handleFileChange}
                />

                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                <Link to='/'>If Already Registered</Link>

            </form>
        </div>
    );
};

export default Register;