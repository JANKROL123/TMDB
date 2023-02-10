import UserContext from "../context/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Input } from "antd";
import Title from "antd/es/typography/Title";
import {message} from "antd";
function LoginForm() {
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const [exists, setExists] = useState(true);
    async function handleUser(data) {
        if (exists) {
            const checkUser = await axios.post("http://localhost:5000/users/login", data);
            if (checkUser.data.result === false) {
                message.error("Incorrect login or password");
                return;
            }
            setUser(checkUser.data);
            navigate("/", {replace: true});
        } else {
            const addUser = await axios.post("http://localhost:5000/users", data);
            if (addUser.data.result === false) {
                message.error("User already exists");
                return;
            }
            setUser(addUser.data);
            navigate("/", {replace: true});
        }
    } 
    return (
        <div id="loginForm">
            <Title level={2}>{exists ? "Log in" : "Create account"}</Title>
            <Button 
                type="primary"
                id="createLoginBtn" 
                onClick={() => setExists(!exists)}
                style={exists ? {"backgroundColor": "#7cb305"} : {"backgrounColor": "#cf1322"}}
            >
                {exists ? "Create account" : "Already have"}
            </Button>
            <Form onFinish={(data) => handleUser(data)}>
                <Form.Item label="Login" name="login" rules={[{required: true, message: "User login required!"}]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{required: true, message: "User password required!"}]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default LoginForm;