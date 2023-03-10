import React from "react";
import Title from "antd/es/typography/Title";
import { Button } from "antd";
import PropTypes from "prop-types";
function Sorter({ sortMainListByProperty }) {
  return (
    <div id="sort">
      <Title level={5}>Sort</Title>
      <div id="btn">
        <Button
          type="primary"
          size="small"
          onClick={() => sortMainListByProperty("title")}
        >
          Title
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => sortMainListByProperty("release_date")}
        >
          Release date
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => sortMainListByProperty("vote_average")}
        >
          Average vote
        </Button>
      </div>
    </div>
  );
}
Sorter.propTypes = {
  sortMainListByProperty: PropTypes.func
};
export default Sorter;
