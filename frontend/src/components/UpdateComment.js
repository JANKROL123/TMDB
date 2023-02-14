import React from "react";
import UserContext from "../context/UserContext";
import { useContext } from "react";
import axios from "axios";
import { Form, Input, Button } from "antd";
import dateToString from "../functions/dateToString";
import PropTypes from "prop-types";
function UpdateComment({ id, setComments, comments, title, content, login }) {
  const { user } = useContext(UserContext);
  async function updateComment(id, data) {
    try {
      const currentDate = new Date();
      const stringifyDate = dateToString(currentDate);
      await axios.put(`http://localhost:5000/comments/${id}`, {
        date: currentDate,
        ...data,
        userId: user.userId
      });
      const updated = {
        id,
        ...data,
        stringifyDate,
        login
      };
      setComments([...comments.filter((n) => n.id !== id), updated]);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <Form onFinish={(e) => updateComment(id, e)}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Comment title required!" }]}
        >
          <Input value={title} />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Comment content required!" }]}
        >
          <Input.TextArea value={content} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="small" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
UpdateComment.propTypes = {
  id: PropTypes.number,
  setComments: PropTypes.func,
  comments: PropTypes.array,
  title: PropTypes.string,
  content: PropTypes.string,
  login: PropTypes.string
};
export default UpdateComment;
