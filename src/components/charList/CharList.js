import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [loadingBtn, setLoadingBtn] = useState(false);
	const [offset, setOffset] = useState(65);
	const [charEnded, setCharEnded] = useState(false);

	const { loading, error, getAllCharacters } = useMarvelService();

	useEffect(() => {
		getCharListReload(offset, true);
	}, [])

	const getCharListReload = (offset, initial) => {
		initial ? setLoadingBtn(false) : setLoadingBtn(true);
		getAllCharacters(offset)
			.then(onCharListLoaded)
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if(newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setLoadingBtn(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
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
	const spinner = loading && !loadingBtn ? <Spinner/> : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
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