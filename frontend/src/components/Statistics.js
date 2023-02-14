import React from "react";
import fetchPrivateStatistics from "../functions/fetchPrivateStatistics";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { connect } from "react-redux";
import PropTypes from "prop-types";
function Statistics({ genres }) {
  const [roles, setRoles] = useState([]);
  const [commented, setCommented] = useState([]);
  const [genreStats, setGenreStats] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await fetchPrivateStatistics();
      setRoles(data[0]);
      setCommented(data[1]);
      setGenreStats(data[2]);
    })();
  }, []);
  const getGenreName = (genreId) => {
    return genres.find((n) => n.id === genreId).name;
  };
  return (
    <div id="statsContent">
      <div>
        <Title level={3}>Roles played in: </Title>
        {roles
          ? roles.map((elem, idx) => (
              <div key={elem.id}>
                <p>
                  <strong>{idx + 1}. </strong>
                  {elem.name}: {elem.roles}
                </p>
              </div>
            ))
          : null}
      </div>
      <div>
        <Title level={3}>Number of given comments: </Title>
        {commented
          ? commented.map((elem, idx) => (
              <div key={elem.id}>
                <p>
                  <strong>{idx + 1}. </strong>
                  {elem.login}: {elem.comments}
                </p>
              </div>
            ))
          : null}
      </div>
      <div>
        <Title level={3}>Number of movies by genre: </Title>
        {genreStats
          ? genreStats.map((elem, idx) => (
              <div key={elem.id}>
                <p>
                  <strong>{idx + 1}. </strong>
                  {getGenreName(elem.genreId)}: {elem.amount}
                </p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
Statistics.propTypes = {
  genres: PropTypes.array
};
const mapStateToProps = (state) => ({
  genres: state.genres
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
