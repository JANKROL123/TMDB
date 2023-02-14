import React from "react";
import { useContext } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Form, Button, Input } from "antd";
import Title from "antd/es/typography/Title";
import PropTypes from "prop-types";
function CommentForm({ id, setComments, comments }) {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();
  async function addComment(data) {
    try {
      const newCommentRequest = await axios.post(
        `http://localhost:5000/comments/${id}`,
        { ...data, date: new Date(), userId: user.userId }
      );
      const comment = newCommentRequest.data;
      setComments([...comments, { ...comment, login: user.login }]);
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <Title level={4}>Add comment</Title>
      <Form form={form} onFinish={(e) => addComment(e)}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Comment title required!" }]}
        >
          <Input style={{ width: "70%" }} />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Comment content required!" }]}
        >
          <Input.TextArea style={{ width: "70%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
CommentForm.propTypes = {
  id: PropTypes.number,
  setComments: PropTypes.func,
  comments: PropTypes.array
};
export default CommentForm;
