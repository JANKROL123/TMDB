import schemaObject from "../validation/schemaObject";
import axios from "axios";
import { Formik } from "formik";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Form, Input, InputNumber } from "formik-antd";
import { Button } from "antd";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import setMovies from "../redux/actions/setMovies";
function UpdateMovie({movies, setMovies}) {
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        axios.get(`http://localhost:5000/movies/${params.id}`).then(res => {
            setMovie(res.data);
        });
    }, []);
    const {main_roles, genre_ids, ...updateObj} = schemaObject;
    const schema = Yup.object().shape(updateObj);
    const initialValues = movie;
    async function updateMovie(values) {
        try {
            const {genre_ids, main_roles, release_date, ...toSend} = values;
            await axios.put(`http://localhost:5000/movies/${params.id}`, {...toSend, release_date: new Date(release_date)});
            const movieOnFrontend = movies.find(movie => movie.id === parseInt(params.id));
            const updatedVersion = {
                ...movieOnFrontend,
                title: values.title,
                poster_path: values.poster_path,
                release_date: values.release_date,
                vote_average: values.vote_average
            }
            setMovies([...movies.filter(movie => movie.id !== parseInt(params.id)), updatedVersion]);
            navigate("/admin", {replace: true});
        } catch (err) {
            console.error(err);
        }
    }
    return (
         <div>
            {movie ? <Formik initialValues={initialValues} validationSchema={schema} onSubmit={(values, {resetForm}) => {updateMovie(values); resetForm()}}>
                <Form className="updateForm">
                    <div>
                        <Form.Item name="title" label="Title">
                            <Input name="title" defaultValue={movie.title} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="poster_path" label="Poster path">
                            <Input name="poster_path" defaultValue={movie.poster_path} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="overview" label="Overview">
                            <Input.TextArea name="overview" defaultValue={movie.overview} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="release_date" label="Release date">
                            <DatePicker name="release_date" />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="director" label="Director">
                            <Input name="director" defaultValue={movie.director} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="vote_average" label="Vote average">
                            <InputNumber name="vote_average" defaultValue={movie.vote_average} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="vote_count" label="Vote count">
                            <InputNumber name="vote_count" defaultValue={movie.vote_count} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="trailer" label="Trailer">
                            <Input name="trailer" defaultValue={movie.trailer} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="popularity" label="Popularity">
                            <InputNumber name="popularity" defaultValue={movie.popularity} />
                        </Form.Item>
                    </div>
                    <div>
                        <Button type="primary" htmlType="submit">Update</Button>
                    </div>
                </Form>
            </Formik> : null}
         </div>
    )
}
const mapStateToProps = state => ({
    movies: state.movies
});
const mapDispatchToProps = {
    setMovies
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateMovie);