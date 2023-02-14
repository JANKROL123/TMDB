import React from "react";
import { connect } from "react-redux";
import UserContext from "../context/UserContext";
import { useContext } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import deleteMovie from "../redux/actions/deleteMovie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
function AdminPanel({ movies, deleteMovie }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [data, setData] = useState(
    movies.reduce((acum, item) => {
      return item.private === true
        ? [...acum, { ...item, key: item.id }]
        : acum;
    }, [])
  );
  async function deletePrivateMovie(id) {
    try {
      await axios.delete(`http://localhost:5000/movies/${id}`);
      deleteMovie(id);
      setData(data.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error(err);
    }
  }
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Update",
      dataIndex: "update",
      key: "update",
      render: (_, record) => (
        <Button
          onClick={() => navigate(`/update/${record.id}`, { replace: true })}
          type="primary"
        >
          Update
        </Button>
      )
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <Button
          onClick={() => deletePrivateMovie(record.id)}
          type="primary"
          danger
        >
          Delete
        </Button>
      )
    }
  ];
  return (
    <div style={{ height: "90vh" }} id="adminPanel">
      {user && user.isAdmin ? (
        <Table dataSource={data} columns={columns} />
      ) : (
        <div>Permission denied</div>
      )}
    </div>
  );
}
AdminPanel.propTypes = {
  movies: PropTypes.array,
  deleteMovie: PropTypes.func
};
const mapStateToProps = (state) => ({
  movies: state.movies
});
const mapDispatchToProps = {
  deleteMovie
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
