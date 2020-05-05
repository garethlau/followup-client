import React, { useState, useEffect } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import utils from "../utils";

export default function Admin() {
  const { orgName } = useParams();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const config = utils.getJWTConfig();
    axios
      .get(`${BASE_URL}/api/v1/organization/${orgName}/users`, config)
      .then((response) => {
        setUsers(response.data.users);
        setAdmins(response.data.admins);
      });
  }, [orgName]);

  return (
    <div>

      Admins: 
      {admins.map((user) => (
        <div>{user.firstName}</div>
      ))}
      Users:
      {users.map((user) => (
        <div>{user.firstName}</div>
      ))}
    </div>
  );
}
