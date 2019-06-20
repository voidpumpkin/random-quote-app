import * as $ from 'jquery';
import '../scss/custom.scss';
import 'bootstrap';
import * as image from '../images/default.jpg';
import generateAnimeQuoute from 'animequote';

let isImageLoading = false;

(function init() {
    $('#new-quote').on('click', (event) => {
        event.preventDefault();
        if (!isImageLoading) {
            changeQoute();
        }
    });
    changeQoute();
})();

async function changeQoute() {
    let animeQoute = generateAnimeQuoute();
    $('#text').text(animeQoute.quotesentence);
    $('#author').text(`- ${animeQoute.quotecharacter}`);

    $('#author-image').remove();
    addLoading();

    let imageUrl = undefined;
    try {
        imageUrl = await getCharacterImageUrl(animeQoute.quoteanime, animeQoute.quotecharacter);
    } catch (error) {
        console.log('there was an error');
    } finally {
        $('#author-image-loading').remove();
        isImageLoading = false;
        addDefaultAuthorImage();
        if (imageUrl) {
            $('#author-image').attr('src', imageUrl);
        }
        $('html').hide().show(0);
    }
}

function addDefaultAuthorImage() {
    let html = '<img id="author-image"class="oppacity-60 author-image img-fluid-dheight mx-auto pt-3 px-3 rounded" ' +
        `src = "${image}" alt = "Author image" >`;
    $('#quote-box').prepend(html);
}

function addLoading() {
    let html =
        '<div id="author-image-loading" class="oppacity-60 row sk-folding-cube-custom mx-auto pt-3 px-3">' +
        '<div class="sk-folding-cube">' +
        '<div class="sk-cube1 sk-cube"></div>' +
        '<div class="sk-cube2 sk-cube"></div>' +
        '<div class="sk-cube4 sk-cube"></div>' +
        '<div class="sk-cube3 sk-cube"></div>' +
        '</div>' +
        '</div>';
    $('.card-body').prepend(html);
    isImageLoading = true
}

async function getCharacterImageUrl(anime, character) {
    let characterNameBits = character.split(" ");
    console.log('characterNameBits', characterNameBits);
    let animeData = await searchForAnime(anime);
    //TODO: fix this
    if (animeData) {
        console.log('animeData', animeData);
        let characters = await fetchAnimeCharacters(animeData.results[0].mal_id);
        if (characters) {
            console.log('characterData', characters);
            let matchingCharacters = characters.characters.filter(
                e =>
                e.name.includes(characterNameBits[0]) &&
                e.name.includes(characterNameBits[characterNameBits.length - 1])
            );
            return matchingCharacters[0].image_url;
        }
    }
}

async function fetchAnimeCharacters(animeId) {
    let characters;
    characters = $.ajax({
        url: `https://api.jikan.moe/v3/anime/${animeId}/characters_staff`,
        type: 'GET'
    });
    return characters;
}

async function searchForAnime(anime) {
    let animeData;
    animeData = $.ajax({
        url: 'https://api.jikan.moe/v3/search/anime',
        type: 'GET',
        data: {
            type: 'anime',
            q: anime,
            limit: 1
        }
    });
    //TODO: should return.results[0]
    return animeData;
}