// файл для работы с сервером

// отдельный класс на чистом JS - поэтому без наследования Components
class MarvelService {
    // неизменяемые (по договоренности по _ ) св-ва класса
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=fe9d1cb89c0c944017049cc745da12ef';

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // метод для получения массива с объектами содерж. инф-ю о персонажах
    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);  //  в метод map будет приходить с сервера каждый объект с данными о персонаже и отсеиваться с помощью метода _transformCharacter в чистый объект
    }

    // метод для получения объекта содерж. инф-ю о персонаже
    //  когда метод будет запускаться он будет ждать ответа и результат запишет в res
    getCharacter = async (id) => {
        //  придет асинхронный результат от этой ф-ции
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        //  прогоняем через отсеивание и получаем в результате этой ф-ции чистый объект
        return this._transformCharacter(res.data.results[0]);
    }

    //  метод для отсеивания ненужных св-в в приходящем от сервера объекте c данными об одном персонаже
    _transformCharacter = (char) =>{
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }
}

export default MarvelService;