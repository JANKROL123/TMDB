import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
function UserSymbol({ user, setUser }) {
  return (
    <div id="userSymbol">
      <div id="user">{user[0].toUpperCase()}</div>
      <Button type="primary" danger onClick={() => setUser(null)}>
        Log out
      </Button>
    </div>
  );
}
UserSymbol.propTypes = {
  user: PropTypes.string,
  setUser: PropTypes.func
};
export default UserSymbol;
