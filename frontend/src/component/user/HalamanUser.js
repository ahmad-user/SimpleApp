import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const HalamanUser = () => {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshToken();
        await getUsers();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      const newToken = response.data.accessToken;
      localStorage.setItem("token", newToken);
      const decoded = jwtDecode(newToken);
      setEmail(decoded.email);
    } catch (error) {
      if (error.response) {
        navigate("/");
      } else {
        console.error("Error refreshing token:", error);
      }
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token yang digunakan:", token);

      const response = await axios.get("http://localhost:5000/usersPage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  return (
    <div className="container mt-5">
      <h1>
        <strong>Welcome Back User : </strong> {email}
      </h1>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>NO</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
              </tr>
            ))
       
          ) : (
            <tr>
              <td colSpan="3">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HalamanUser;
