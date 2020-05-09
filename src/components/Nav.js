import React, { useEffect, useContext, useState } from "react";
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
  Alignment,
  NavbarHeading,
  Classes,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Position,
  Divider,
} from "@blueprintjs/core";
import { store, actions } from "../store";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import { setAccessToken } from "../accessToken";

export default function Nav() {
  const { state, dispatch } = useContext(store);
  const history = useHistory();
  const { orgName } = useParams();
  const [organizations, setOrganizations] = useState([]);

  const goto = (destination) => () => {
    history.push(destination);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/user/organizations`)
      .then((response) => {
        setOrganizations(response.data.organizations);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  async function logout() {
    if (state.user) {
      try {
        await axios.post(`${BASE_URL}/api/v1/auth/logout`, null);
        dispatch({ type: actions.CLEAR_USER });
        setAccessToken(null);
        history.push("/");
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  async function logoutAll() {
    if (state.user) {
      try {
        await axios.post(`${BASE_URL}/api/v1/auth/logout-all`);
        dispatch({ type: actions.CLEAR_USER });
        setAccessToken(null);
        history.push("/");
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  async function createDraft() {
    try {
      let res = await axios.post(BASE_URL + "/api/v1/draft", {
        orgName,
      });
      let { draft } = res.data;
      let draftId = draft._id;
      history.push(`/${orgName}/compose?draftId=${draftId}`);
    } catch (err) {
      console.log(err.messsage);
    }
  }

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>
          <Popover
            modifiers={{ arrow: { enabled: false } }}
            content={
              <Menu>
                {organizations.map((organization) =>
                  organization.name === orgName ? null : (
                    <MenuItem
                      onClick={goto(`/${organization.name}/dashboard`)}
                      key={organization._id}
                      text={organization.name}
                    />
                  )
                )}
                <Divider />
                <MenuItem
                  onClick={goto("/create")}
                  icon="plus"
                  text="Create Organization"
                />
              </Menu>
            }
            position={Position.BOTTOM_RIGHT}
          >
            <Button text={orgName} rightIcon="double-caret-vertical" />
          </Popover>
        </NavbarHeading>
        <NavbarDivider />
        {state.user && (
          <>
            <Button
              onClick={goto(`/${orgName}/dashboard`)}
              className={Classes.MINIMAL}
              icon="dashboard"
              text="Dashboard"
            />
            <Button
              onClick={createDraft}
              className={Classes.MINIMAL}
              icon="application"
              text="Create Draft"
            />
          </>
        )}
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {state.user ? (
          <>
            <Button icon="notifications" className={Classes.MINIMAL} />
            <Popover
              content={
                <Menu>
                  <MenuItem onClick={logout} icon="log-out" text="Log out" />
                  <MenuItem
                    onClick={logoutAll}
                    icon="globe"
                    text="Log out of all devices"
                  />
                  <MenuItem icon="cog" text="Settings" />
                </Menu>
              }
              position={Position.BOTTOM_LEFT}
            >
              <Button icon="caret-down" className={Classes.MINIMAL} />
            </Popover>
          </>
        ) : (
          <>
            <Button
              onClick={goto("/signup")}
              className={Classes.MINIMAL}
              text="Sign up"
            />
            <Button
              onClick={goto("/login")}
              intent={Intent.PRIMARY}
              rightIcon="log-in"
              text="Log in"
            />
          </>
        )}
      </NavbarGroup>
    </Navbar>
  );
}
