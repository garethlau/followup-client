import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  HTMLTable,
  Intent,
  Spinner,
  Callout,
  Code,
} from "@blueprintjs/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import { store } from "../store";
import { useHistory } from "react-router-dom";

export default function Admin() {
  const history = useHistory();
  const { state } = useContext(store);
  const { orgName } = useParams();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    (async function () {
      // Check if user is an admin
      try {
        let { isAdmin } = (
          await axios.get(`${BASE_URL}/api/v1/organization/${orgName}/isAdmin`)
        ).data;

        if (!isAdmin) {
          setLoading(false);
          return;
        } else {
          // User is an admin, authorized to see this page
          setAuthorized(true);
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setLoading(false);
          }
        }
      }

      // Fetch members of this organization
      axios
        .get(`${BASE_URL}/api/v1/organization/${orgName}/users`)
        .then((res) => {
          setUsers(res.data.users);
          setAdmins(res.data.admins);
        });

      setLoading(false);
    })();
  }, [orgName]);

  const goto = (destination) => () => {
    history.push(destination);
  };
  if (loading) {
    return (
      <div
        style={{
          width: "min-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spinner intent={Intent.PRIMARY} />
      </div>
    );
  }
  if (!authorized) {
    return (
      <div
        style={{
          width: "min-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Callout icon="disable" title="Not authorized">
          <div style={{ width: "350px" }}>
            {state.user ? (
              <>
                <p>
                  You're not an admin of this organization. If you beleive you
                  should be, please request permissions from a current admin.
                </p>
                <p>
                  Currently logged in as:{" "}
                  <Code style={{ marginLeft: "5px" }}>
                    {state.user.username}
                  </Code>
                </p>
                <Button
                  intent={Intent.PRIMARY}
                  text="Request Access"
                  disabled
                />
              </>
            ) : (
              <>
                <p style={{ width: "350px" }}>
                  You're currently not logged in. You must be logged in to
                  continue.{" "}
                </p>
                <Button
                  intent={Intent.PRIMARY}
                  onClick={goto(`/login?redirect=/${orgName}/dashboard`)}
                  text="Log in"
                />
              </>
            )}
          </div>
        </Callout>
      </div>
    );
  }
  return (
    <div style={{padding: "20px"}}>
      <h1>Members</h1>
      <HTMLTable>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((user) => (
            <tr>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>Admin</td>
            </tr>
          ))}
          {users.map((user) => (
            <tr>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>Member</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
