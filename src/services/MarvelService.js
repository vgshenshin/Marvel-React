// файл для работы с сервером

import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const { loading, error, onRequest, clearError } = useHttp();

	// неизменяемые (по договоренности по _ ) св-ва класса

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=fe9d1cb89c0c944017049cc745da12ef';
	const _apiOffset = 65;

	// метод для получения массива с объектами содерж. инф-ю о персонажах
	const getAllCharacters = async (offset = _apiOffset) => {
		const res = await onRequest(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);  //  в метод map будет приходить с сервера каждый объект с данными о персонаже и отсеиваться с помощью метода _transformCharacter в чистый объект
	}

	// метод для получения объекта содерж. инф-ю о персонаже
	//  когда метод будет запускаться он будет ждать ответа и результат запишет в res
	const getCharacter = async (id) => {
		//  придет асинхронный результат от этой ф-ции
		const res = await onRequest(`${_apiBase}characters/${id}?${_apiKey}`);
		//  прогоняем через отсеивание и получаем в результате этой ф-ции чистый объект
		return _transformCharacter(res.data.results[0]);
	}

	const getCharByName = async (name) => {
		const res = await onRequest(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	}

	const getAllComics = async (offset = _apiOffset) => {
		const res = await onRequest(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformComics);  //  в метод map будет приходить с сервера каждый объект с данными о персонаже и отсеиваться с помощью метода _transformCharacter в чистый объект
	}

	const getComic = async (id) => {
		const res = await onRequest(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	}

	//  метод для отсеивания ненужных св-в в приходящем от сервера объекте c данными об одном персонаже
	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description,
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items.splice(0, 10)
		}
	}

	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount ? `${comics.pageCount} pages` : "No information about the number of pages",
			language: comics.textObjects[0]?.language || "en-us",
			price: comics.prices[0].price ? `${comics.prices[0].price}$` : "not available",
			thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
		}
	}

	return { loading, error, clearError, getAllCharacters, getCharacter, getCharByName, getAllComics, getComic }
}

export default useMarvelService;