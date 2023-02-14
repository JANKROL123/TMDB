import * as Yup from "yup";
const schemaObject = {
  title: Yup.string().required("Required!"),
  poster_path: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Incorrect URL"
    )
    .required("Required!"),
  overview: Yup.string().required("Required!"),
  main_roles: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        character: Yup.string().required()
      })
    )
    .min(3, "At least 3 roles required!")
    .required("Required!"),
  release_date: Yup.date("Incorrect date!").required("Required!"),
  director: Yup.string().required("Required!"),
  genre_ids: Yup.array().required("Required!").min(1, "Min 1 genre required!"),
  vote_average: Yup.number()
    .min(0, "Vote average cannot be less than 0")
    .max(10, "Vote average cannot be higher than 10")
    .required("Required!"),
  vote_count: Yup.number()
    .min(0, "Vote count cannot be less than 0")
    .required("Required!"),
  trailer: Yup.string()
    .matches(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/,
      "Incorrect youtube URL"
    )
    .required("Required!"),
  popularity: Yup.number()
    .min(0, "Popularity cannot be less than 0")
    .required("Required!")
};

export default schemaObject;
