import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [loadingBtn, setLoadingBtn] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		getCharListReload();
	}, [])

	const getCharListReload = (offset) => {
		onCharListLoading();
		marvelService.getAllCharacters(offset)
			.then(onCharListLoaded)
			.catch(onError)
	}

	const onCharListLoading = () => {
		setLoadingBtn(true);
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if(newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setLoading(false);
		setLoadingBtn(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	}

	const onError = () => {
		setError(true);
		setLoading(false);
	}

	// исп-е рефов для назначения красного фокуса на карточку

	const charsRefs = useRef([]);

	const focusCard = id => {
		charsRefs.current.forEach(el => el.classList.remove('char__item_selected'));
		charsRefs.current[id].classList.add('char__item_selected');
		charsRefs.current[id].focus();
	}

	// Этот метод создан для оптимизации, 
	// чтобы не помещать такую конструкцию в метод render
	function renderItems(arr) {
		const items =  arr.map((item, i) => {
			let imgStyle = {'objectFit' : 'cover'};
			if (item.thumbnail.search(/not/)+1) {
				imgStyle = {'objectFit' : 'unset'};
			}
			
			return (
				<li 
					tabIndex={0}
					className="char__item"
					key={item.id}
					onClick={() => { 
						props.onCharSelected(item.id);
						focusCard(i);
					}}
					onKeyDown={(e) => {
					    if (e.key === ' ' || e.key === "Enter") {
							props.onCharSelected(item.id); 
							focusCard(i);
						}
					}}
					ref={el => charsRefs.current[i] = el}>
						<img src={item.thumbnail} alt={item.name} style={imgStyle}/>
						<div className="char__name">{item.name}</div>
				</li>
			)
		});
		// А эта конструкция вынесена для центровки спиннера/ошибки
		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}
		
	const items = renderItems(charList);

	const errorMessage = error ? <ErrorMessage/> : null;
	const spinner = loading ? <Spinner/> : null;
	const content = !(loading || error) ? items : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{content}
			<button
				disabled={loadingBtn}
				style={{'display' : charEnded ? 'none' : 'block'}}
				onClick={() => getCharListReload(offset)} 
				className="button button__main button__long">
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}


export default CharList;