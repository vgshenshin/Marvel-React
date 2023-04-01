import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    //  ловит ошибку в дочернем компоненте и изменяет стэйт на true
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    // то же что и componentDidCatch(), но он только обновляет стэйт
    // По факту это как setState, только этот работает с ошибкой
    // static getDerivedStateFromError(error) {
    //     return {error: true}
    // }

    render() {
        // условие для рендера запасного интерфейса
        if (this.state.error) {
            // return <h2>Something went wrong</h2>
            return <ErrorMessage/>
        }

        // если все ок - грузим дочерний компонент
        return this.props.children;
    }
}

export default ErrorBoundary;