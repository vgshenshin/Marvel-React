import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

	const [char, setChar] = useState(null);

	const { loading, error, clearError, getCharacter } = useMarvelService();

	useEffect(() => {
		updateChar();
	}, [props.charId])

	const onCharLoaded = (charSelected) => {
		setChar(charSelected);
	}

	const updateChar = () => {
		const {charId} = props;
		if (!charId) {
			return;
		}

		clearError();
		getCharacter(charId)
			.then(onCharLoaded)
	}

	const skeleton = error || loading || char ? null : <Skeleton/>;
	const errorMessage = error ? <ErrorMessage/> : null;
	const spinner = loading ? <Spinner/> : null;
	const content = !(loading || error || !char) ? <View char={char}/> : null;

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	)  
}


const View = ({char}) => {

	const {name, description, thumbnail, homepage, wiki, comics} = char;
	let contain = {};
	if (thumbnail.search(/not/)+1) {
		contain = {objectFit: 'contain'};
	}
	let comicsRender = [];
	if (comics.length) {
		comicsRender = comics.map((elem, id) => {
			return (
				<li key={id}
					className="char__comics-item">
					{elem.name}
				</li>
			)
		});
	} else {
		comicsRender = 'There is no comics with this character';
	}

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} style={contain} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
			{ comicsRender }
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;