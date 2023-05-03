import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom/cjs/react-router-dom.min";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

import decoration from '../../resources/img/vision.png';

const App = () => {

	const [selectedChar, setSelectedChar] = useState(null);

	// метод для записи в стэйт id персонажа из компонента CharList
	const onCharSelected = (id) => {
		setSelectedChar(id)
	}

	return (
		<Router>
			<div className="app">
				<AppHeader/>
				<main>
					<Switch>
						<Route exact path="/">
							<ErrorBoundary>
								<RandomChar/>
							</ErrorBoundary>
							<div className="char__content">
								<ErrorBoundary>
									<CharList onCharSelected={onCharSelected} />
								</ErrorBoundary>
								<ErrorBoundary>
									<CharInfo charId={selectedChar} />
								</ErrorBoundary>
							</div>
							<img className="bg-decoration" src={decoration} alt="vision"/>
						</Route>
						<Route exact path="/comics">
							<AppBanner/>
							<ComicsList/>
						</Route>
					</Switch>
				</main>
			</div>
		</Router>
	)
}

export default App;