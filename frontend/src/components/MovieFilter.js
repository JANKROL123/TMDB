import React from "react";
import Title from "antd/es/typography/Title";
import Search from "antd/es/transfer/search";
import { Select } from "antd";
import { Affix } from "antd";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
function MovieFilter({ genres, handleClick, setQuery }) {
  return (
    <div id="movieFilter">
      <div className="relative">
        <div className="cover">
          <Title className="title" id="welcome">
            Welcome to TMDB copy
          </Title>
        </div>
        <div id="photo1"></div>
      </div>
      <div className="relative">
        <div className="cover">
          <div id="searchMovies">
            <Button type="primary" size="large" id="stats">
              <Link to="/statistics">
                View private statistics <ArrowRightOutlined />
              </Link>
            </Button>
            <Title className="title" level={2}>
              Search movies
            </Title>
            <Affix offsetTop={17} style={{ left: "15em" }}>
              <Search
                id="titleSearch"
                placeholder="Please select title"
                enterButton="Search"
                size="large"
                onChange={(e) => setQuery(e.target.value)}
              />
            </Affix>
          </div>
          <div id="searchGenres">
            <Title className="title" level={4}>
              Choose genres
            </Title>
            <div id="select">
              {genres ? (
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Please select genre"
                  style={{ width: "100%" }}
                  options={genres.map((genre) => ({
                    label: genre.name,
                    value: genre.id
                  }))}
                  onChange={(arr) => handleClick(arr)}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div id="photo2"></div>
      </div>
    </div>
  );
}
MovieFilter.propTypes = {
  genres: PropTypes.array,
  handleClick: PropTypes.func,
  setQuery: PropTypes.func
};
export default MovieFilter;
