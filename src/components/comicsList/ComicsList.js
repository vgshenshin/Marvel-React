import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';


const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);


    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
		getComicsListReload(true);
	}, [])

    const getComicsListReload = (initial) => {
		initial ? setLoadingBtn(false) : setLoadingBtn(true);
        getAllComics()
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
		if(newComicsList.length < 8) {
			ended = true;
		}
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setLoadingBtn(false);
		setComicsEnded(ended);
    }


    function renderItems(arr) {
		const items =  arr.map((item, i) => {
			
			return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
			)
		});
		// А эта конструкция вынесена для центровки спиннера/ошибки
		return (
			<ul className="comics__grid">
				{items}
			</ul>
		)
	}

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
	const spinner = loading && !loadingBtn ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
			{spinner}
            {items}
            <button
                disabled={loadingBtn}
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                onClick={() => getComicsListReload()}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;