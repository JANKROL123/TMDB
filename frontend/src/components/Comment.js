import Title from "antd/es/typography/Title";
import UserContext from "../context/UserContext";
import { useContext } from "react";
import UpdateComment from "./UpdateComment";
import { Button } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { useState } from "react";
function Comment({comment, deleteComment, setComments, comments}) {
    const {user} = useContext(UserContext);
    const {title, login, content, date, id} = comment;
    const [commentUpd, setCommentUpd] = useState(false);
    return (
        <div className="comment">
            <Title level={5}>{title}</Title>
            <p className="commentInfo"><i>{date}</i> {login}</p>
            <div>{content}</div>
            {user && user.isAdmin ? <div className="adminCommentButtons">
                <Button size="small" type="primary" danger onClick={() => deleteComment(id)}>X</Button>
                <Button size="small" type="primary" onClick={() => setCommentUpd(!commentUpd)}><ToolOutlined /></Button>
            </div> : null}
            {commentUpd ? <UpdateComment setComments={setComments} comments={comments} id={id} title={title} content={content} date={date} login={login} /> : null}
        </div>
    )
}
export default Comment;