import * as $ from 'jquery';
import '../scss/custom.scss';
import 'bootstrap';
import generateAnimeQuoute from 'animequote';
(function init() {
    $('#new-quote').on('click', (event) => {
        event.preventDefault();
        changeQoute();
    });
})();

async function changeQoute() {
    let animeQoute = generateAnimeQuoute();
    $('#text').text(animeQoute.quotesentence);
    $('#author').text(`- ${animeQoute.quotecharacter}`);
    let imageUrl = await getCharacterImageUrl(animeQoute.quoteanime, animeQoute.quotecharacter);
    $('#author-image').attr('src', imageUrl);

}
async function getCharacterImageUrl(anime, character) {
    let characterNameBits = character.split(" ");
    console.log(characterNameBits);
    let animeData = await searchForAnime(anime);
    //TODO: fix this
    if (animeData) {
        console.log(animeData);
        let characters = await fetchAnimeCharacters(animeData.results[0].mal_id);
        if (characters) {
            console.log('characterData', characters);
            let matchingCharacters = characters.characters.filter(
                e =>
                e.name.includes(characterNameBits[0]) &&
                e.name.includes(characterNameBits[characterNameBits.length-1])
            );
            return matchingCharacters[0].image_url;
        }
    }
}

async function fetchAnimeCharacters(animeId) {
    let characters;
    try {
        characters = $.ajax({
            url: `https://api.jikan.moe/v3/anime/${animeId}/characters_staff`,
            type: 'GET'
        });
    } catch (error) {
        console.log(error)
    }
    return characters;
}
async function searchForAnime(anime) {
    let animeData;
    try {
        animeData = $.ajax({
            url: 'https://api.jikan.moe/v3/search/anime',
            type: 'GET',
            data: {
                type: 'anime',
                q: anime,
                limit: 1
            }
        });
    } catch (error) {
        console.log(error)
    }
    //TODO: should return.results[0]
    return animeData;
}