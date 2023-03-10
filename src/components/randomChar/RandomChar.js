import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';


class RandomChar extends Component {

    // записываем в стэйт объект с необх. парам персонажа. null потому что изначально мы не храним данные ни одного из первсонажей
    // синтаксис стэйта без this и конструктора, потому что исп-ем возможности полей класса
    state = {
        char: {},
        loading: true,
        error: false
    }

    // получаем сюда экземпляр класса MarvelService со всеми методами и св-вами прописанныами в MarvelService.js
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }
    //  метод для вкл спиннера загрузки при смене персонажа по клику на Try It
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    //  ф-ция для обновления карточки случайного персонажа
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);  // рандомно выбираем id персонажа из диапазона
        this.onCharLoading();  // когда запускается обновл персонажа, перед запросом на сервер вкл спиннер загрузки
        this.marvelService
            .getCharacter(id)  //  по определенному id находим нужного персонажа
            .then(this.onCharLoaded)  // обрабатывая промис получаем чистый объект с данными с сайта марвел
            //  записываем в стэйт данный объект отсеянный от ненужных св-в с помощью метода _transformCharacter внутри метода getCharacter
            .catch(this.onError);
    }


    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;
        
        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button 
                        className="button button__main"
                        onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}


//  простой рендерящий компонент
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let altDescription = description;

    if (description && description.length > 200) {
        altDescription = description.slice(0, 200) + "..."
    } else if (!description) {
        altDescription = 'There is no description for this character...'
    }

    let contain;
    if (thumbnail.search(/not/)+1) {
        contain = {objectFit: 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={contain}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{altDescription}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;