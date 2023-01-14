
// пример как работать с файлами тз папки public. Но чаще всего это не исп-я
/* const ErrorMessage = () => {
    return (
        <img src={process.env.PUBLIC_URL + '/error.gif'} alt="" />
    )
} */

import img from "./error.gif";

import "./errorMessage.scss";

const ErrorMessage = () => {
    return (
        <img className="error_img" src={img} alt="error" />
    )
}

export default ErrorMessage;