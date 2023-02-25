import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false,
		loadingBtn: false,
		offset: 1548,
		charEnded: false
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.getCharListReload();
	}

	getCharListReload = (offset) => {
		this.onCharListLoading();
		this.marvelService.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError)
	}

	onCharListLoading = () => {
		this.setState({
			loadingBtn: true
		})
	}

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if(newCharList.length < 9) {
			ended = true;
		}

		this.setState(({charList, offset}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			loadingBtn: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}

	onError = () => {
		this.setState({
			error: true,
			loading: false
		})
	}

	// Этот метод создан для оптимизации, 
	// чтобы не помещать такую конструкцию в метод render
	renderItems(arr) {
		const items =  arr.map((item) => {
			let imgStyle = {'objectFit' : 'cover'};
			if (item.thumbnail.search(/not/)+1) {
				imgStyle = {'objectFit' : 'unset'};
			}
			
			return (
				<li 
					className="char__item"
					key={item.id}
					onClick={() => this.props.onCharSelected(item.id)} >
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

	render() {

		const {charList, loading, error, loadingBtn, offset, charEnded} = this.state;
		
		const items = this.renderItems(charList);

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
					onClick={() => this.getCharListReload(offset)} 
					className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

export default CharList;