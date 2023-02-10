import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import schemaObject from "../validation/schemaObject";
import setMovies from "../redux/actions/setMovies";
import axios from "axios";
import { connect } from "react-redux";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Button } from "antd";
import { Form, SubmitButton, Input, DatePicker, InputNumber } from "formik-antd";
import dateToString from "../functions/dateToString";
function MovieForm({genres, movies, setMovies}) {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const schema = Yup.object().shape(schemaObject);
    const initialValues = {
        title: "",
        poster_path: "",
        overview: "",
        main_roles: [],
        release_date: "",
        director: "",
        genre_ids: [],
        vote_average: 0,
        vote_count: 0,
        trailer: "",
        popularity: 0
    }
    async function handleSubmit(values) {
        try {
            const obj = {
                ...values, 
                genre_ids: values.genre_ids.map(n => parseInt(n))
            };
            const result = await axios.post("http://localhost:5000/movies", obj);
            const newMovieObj = {
                ...result.data,
                genre_ids: obj.genre_ids,
                vote_average: values.vote_average,
                release_date: dateToString(new Date(values.release_date))
            }
            setMovies([...movies, newMovieObj]);
            navigate(`/private/${newMovieObj.id}`, {replace: true});
        } catch (err) {
            console.log(err);
        } 
    }
    return (
        <div id="form">
            {user && user.isAdmin ? <Formik initialValues={initialValues} validationSchema={schema} onSubmit={(values, {resetForm}) => {handleSubmit(values); resetForm()}}>
                {props => {
                    return (
                        <Form>
                            <div>
                                <Form.Item name="title" label="Title">
                                    <Input name="title" />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item name="poster_path" label="Poster path">
                                    <Input name="poster_path" />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item name="overview" label="Overview">
                                    <Input.TextArea name="overview" />
                                </Form.Item>
                            </div>
                            <div>
                                <label>Main roles: </label>
                                <FieldArray name="main_roles" render={arrayHelpers => <div>
                                    {props.values.main_roles.map((_role, idx) => <div key={idx} className="pair">
                                        <label>Actor name: </label>
                                        <Input name={`main_roles[${idx}].name`} />
                                        <label>Role: </label>
                                        <Input name={`main_roles[${idx}].character`} />
                                        <Button className="minus" type="primary" size="small" onClick={() => arrayHelpers.remove(idx)}>-</Button>
                                    </div>)}
                                    <ErrorMessage name="main_roles"
                                    render={msg => <div style={{color: "red"}}>{typeof msg === "string" ? msg : "There are some errors in the roles"}</div>} />   
                                    <Button className="plus" size="small" type="primary" onClick={() => arrayHelpers.push({name: "", character: ""})}>+</Button>
                                </div>} />
                            </div>
                            <div>
                                <label>Release date: </label>
                                <Form.Item name="release_date">
                                    <DatePicker name="release_date" />
                                </Form.Item>
                            </div>
                            <div>
                                <label>Director: </label>
                                <Form.Item name="director">
                                    <Input name="director" />
                                </Form.Item>    
                            </div>
                            <div>
                                <Form.Item name="genre_ids" label="Genres">
                                    {genres ? <div className="genreForm">
                                        {genres.map(genre => <div key={genre.id}>
                                            <label>{genre.name}</label>
                                            <Field type="checkbox" name="genre_ids" value={`${genre.id}`} />
                                        </div>)}
                                    </div> : null}
                                </Form.Item>
                            </div>
                            <div>
                                <label>Vote average: </label>
                                <Form.Item name="vote_average">
                                    <InputNumber min={0} max={10} step={0.1} name="vote_average" />        
                                </Form.Item>
                            </div>
                            <div>
                                <label>Vote count: </label>
                                <Form.Item name="vote_count">
                                    <InputNumber min={0} name="vote_count" />        
                                </Form.Item>
                            </div>
                            <div>
                                <label>Trailer: </label>
                                <Form.Item name="trailer">
                                    <Input name="trailer" />        
                                </Form.Item>    
                            </div>
                            <div>
                                <label>Popularity: </label>
                                <Form.Item name="popularity">
                                    <InputNumber min={0} name="popularity" />
                                </Form.Item>
                            </div>
                            <div>
                                <SubmitButton>Submit</SubmitButton>
                            </div>
                        </Form>
                    )
                }}
            </Formik> : <div>Permission denied</div>}
        </div>
    )
}
const mapStateToProps = state => ({
    genres: state.genres,
    movies: state.movies
});
const mapDispatchToProps = {
    setMovies
};
export default connect(mapStateToProps, mapDispatchToProps)(MovieForm);
