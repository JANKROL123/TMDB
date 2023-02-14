import React from "react";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { connect } from "react-redux";
import deleteMovie from "../redux/actions/deleteMovie";
import fetchPublicDetails from "../functions/fetchPublicDetails";
import fetchPrivateDetails from "../functions/fetchPrivateDetails";
import voteOnPublic from "../functions/voteOnPublic";
import voteOnPrivate from "../functions/voteOnPrivate";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import axios from "axios";
import { Content } from "antd/es/layout/layout";
import { Image } from "antd";
import Title from "antd/es/typography/Title";
import { Rate, Spin } from "antd";
import PropTypes from "prop-types";
function Movie({ genres, isPrivate }) {
  const { user } = useContext(UserContext);
  const params = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    try {
      isPrivate
        ? fetchPrivateDetails(params.id).then((res) => {
            const { comments, ...details } = res;
            setDetails(details);
            setComments(comments);
          })
        : fetchPublicDetails(params.id).then((res) => setDetails(res));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  async function deleteComment(commentId) {
    try {
      await axios.delete(`http://localhost:5000/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }
  async function vote(value) {
    isPrivate
      ? voteOnPrivate(2 * value, params.id)
      : voteOnPublic(2 * value, params.id);
  }
  return (
    <Content>
      {details ? (
        <div>
          <div className="movieDetailsTop">
            <img
              alt=""
              width={300}
              height={400}
              src={
                isPrivate
                  ? details.poster_path
                  : `https://image.tmdb.org/t/p/w500/${details.poster_path}`
              }
            />
            <div className="movieInfo">
              <Title level={3}>
                {details.title}{" "}
                <span>({details.release_date.slice(0, 4)})</span>
              </Title>
              <div className="inlineData">
                <span>{details.release_date}</span>
                <span>
                  {isPrivate
                    ? details.genre_ids.map((genreId) => (
                        <span key={genreId}>
                          {
                            genres.find(
                              (genre) => genre.id === parseInt(genreId)
                            ).name
                          }{" "}
                        </span>
                      ))
                    : details.genres.map((genre) => (
                        <span key={genre.id}>{genre.name} </span>
                      ))}
                </span>
                {isPrivate ? null : (
                  <a
                    href={`https://www.themoviedb.org/movie/${params.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    See in TMDB
                  </a>
                )}
              </div>
              <div className="flex">
                <div className="avgDetails">
                  {details.vote_average.toFixed(1)}
                </div>
                <Rate onChange={(e) => vote(e)} />
              </div>
              <div>Vote count: {details.vote_count}</div>
              <div>Popularity: {details.popularity}</div>
              <div className="overview">
                <Title level={4}>Description: </Title>
                <div>{details.overview}</div>
              </div>
              <div>
                <Title level={4}>Director: </Title>
                <div>{details.director}</div>
              </div>
            </div>
          </div>
          <div className="movieDetailsBottom">
            <div className="gallery">
              {isPrivate ? null : <Title level={3}>Gallery: </Title>}
              {isPrivate ? null : (
                <div>
                  {details.backdrops
                    .filter((n) => n.iso_639_1 === null)
                    .map((n, idx) => (
                      <Image
                        width={200}
                        key={idx}
                        src={`https://image.tmdb.org/t/p/w500/${n.file_path}`}
                      />
                    ))
                    .slice(0, 18)}
                </div>
              )}
            </div>
            <div className="trailer">
              <Title level={3}>Trailer: </Title>
              {details ? (
                <iframe
                  key={
                    isPrivate ? `${details.title}-trailer` : details.video_id
                  }
                  width="853"
                  height="480"
                  src={
                    isPrivate
                      ? `https://www.youtube.com/embed/${details.trailer.substr(
                          details.trailer.lastIndexOf("v=") + 2,
                          11
                        )}`
                      : `https://www.youtube.com/embed/${details.key}`
                  }
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              ) : null}
            </div>
            <div className="cast">
              <Title level={3}>Cast: </Title>
              <ul>
                {isPrivate
                  ? details.main_roles.map((actor, idx) => (
                      <li key={idx}>
                        {actor.name} - <i>{actor.character}</i>
                      </li>
                    ))
                  : details.main_roles.map((actor) => (
                      <li key={actor.cast_id}>
                        {actor.name} - <i>{actor.character}</i>
                      </li>
                    ))}
              </ul>
            </div>
            {isPrivate ? (
              <Title className="commentTitle" level={3}>
                Comments:{" "}
              </Title>
            ) : null}
            <div className="handleComments">
              <ul>
                {comments
                  ? comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        deleteComment={deleteComment}
                        setComments={setComments}
                        comments={comments}
                      />
                    ))
                  : null}
              </ul>
              {isPrivate && user ? (
                <CommentForm
                  id={params.id}
                  setComments={setComments}
                  comments={comments}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {loading ? <Spin size="large" /> : null}
      {error ? <div>Error</div> : null}
    </Content>
  );
}
Movie.propTypes = {
  genres: PropTypes.array,
  isPrivate: PropTypes.bool
};
const mapStateToProps = (state) => ({
  genres: state.genres
});
const mapDispatchToProps = {
  deleteMovie
};
export default connect(mapStateToProps, mapDispatchToProps)(Movie);
