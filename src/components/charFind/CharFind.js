import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charFind.scss';

const CharFind = () => {
	const [char, setChar] = useState(null);
	const { loading, error, clearError, getCharByName } = useMarvelService();

	const onCharLoaded = (char) => {
		setChar(char);
	}

	const updateChar = (name) => {
		clearError();
		getCharByName(name)
			.then(onCharLoaded)
	}

	const errorMessage = error ? <div className="char__find-critical-error"><ErrorMessage /></div> : null;
	const results = !char ? null : char.length > 0 ?
					<div className="char__find-wrapper">
						<div className='char__find-success'>There is! Visit {char[0].name} page?</div>
						<Link to={`/characters/${char[0].id}`} className="button button__secondary">
							<div className="inner">To page</div>
						</Link>
					</div> : 
					<div className="char__find-error">
						The character was not found. Check the name and try again
					</div>

	return (
		<div className="char__find">
			<Formik
				initialValues={{ charName: ''}}
				validationSchema = {Yup.object({
					charName: Yup.string().required('This field is required')
				})}
				onSubmit={ ({charName}) => {
					updateChar(charName);
				}}
			>
				<Form>
					<label className="char__find-label">Or find a character by name:</label>
					<div className="char__find-wrapper">
						<Field
							placeholder="Enter name"
							name="charName"
							type="text"
							/>
						<button 
							className="button button__main" 
							type="submit"
							disabled={loading}>
							<div className="inner">Find</div>
						</button>
					</div>
					<FormikErrorMessage className='char__find-error' name="charName" component="div" />
				</Form>
			</Formik>
			{results}
			{errorMessage}
		</div>
	)
}

export default CharFind;