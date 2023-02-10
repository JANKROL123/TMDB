import { Routes, Route, Link } from "react-router-dom";
import Layout from "antd/es/layout/layout";
import List from "./components/List";
import MovieForm from "./components/MovieForm";
import Movie from "./components/Movie";
import { connect } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import setMovies from "./redux/actions/setMovies";
import setAllGenres from "./redux/actions/setAllGenres";
import fetchMovies from "./functions/fetchMovies";
import fetchGenres from "./functions/fetchGenres";
import LoginForm from "./components/LoginForm";
import UserSymbol from "./components/UserSymbol";
import UpdateMovie from "./components/UpdateMovie";
import Statistics from "./components/Statistics";
import AdminPanel from "./components/AdminPanel";
import UserContext from "./context/UserContext";
import { Header, Footer } from "antd/es/layout/layout";
import { Affix } from "antd";
function App({setAllGenres, setMovies}) {
  const [error, setError] = useState({movies: null, genres: null});
  const [user, setUser] = useState(null);
  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);
  useEffect(() => {
    fetchMovies().then(res => {
      setMovies(res);
    }).catch(err => setError({...error, movies: err.message}));
    
    fetchGenres().then(res => {
      setAllGenres(res.data.genres);
    }).catch(err => setError({...error, genres: err.message}));
  }, []);
  return (
    <Layout>
      <Affix offsetTop={0}>
        <Header id="header">
          <nav mode="horizontal" id="menu">
            <Link to="/">Main list</Link>
            {user && user.isAdmin ? <Link to="/form">Add movie</Link> : null}
            {!user ? <Link to="/login">Log in</Link> : null}
          </nav>
          {user && !user.isAdmin ? <UserSymbol user={user.login} setUser={setUser} /> : null}
          {user && user.isAdmin ? <Link to="/admin"><UserSymbol user={user.login} setUser={setUser} /></Link> : null}
        </Header>
      </Affix>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/:id" element={<Movie isPrivate={false} />} />
          <Route path="/private/:id" element={<Movie isPrivate={true} />} />
          <Route path="/form" element={<MovieForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/update/:id" element={<UpdateMovie />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </UserContext.Provider>
      <Footer id="footer">
        &copy; Frontend Development TMDB Project
      </Footer>
    </Layout>
  )
}
const mapStateToProps = state => ({
  movies: state.movies
});
const mapDispatchToProps = {
  setMovies,
  setAllGenres,
}
export default connect(mapStateToProps, mapDispatchToProps)(App);