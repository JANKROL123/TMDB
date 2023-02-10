import { Button } from "antd";
function UserSymbol({user, setUser}) {
    return (
        <div id="userSymbol">
            <div id="user">{user[0].toUpperCase()}</div>
            <Button type="primary" danger onClick={() => setUser(null)}>Log out</Button>
        </div>
    )
}
export default UserSymbol;