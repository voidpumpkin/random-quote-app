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
    $('#quote-text').text(animeQoute.quotesentence);
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
    }
}

function addDefaultAuthorImage() {
    let html = '<img id="author-image" class="author-image d-block mx-auto pr-3 oppacity-60" ' +
        `src = "${image}" alt = "Author image" >`;
    $('#quote').prepend(html);
}

function addLoading() {
    let html =
      `<div id="author-image-loading" class="d-flex mx-auto author-image pr-3 oppacity-60 box-sizing-content" style="width: ${vhToPixels(45) * 0.643759}px;">`+
      '<div class="spinner-grow mx-auto d-block align-self-center justify-self-center" role="status" >' +
      '<span class="sr-only">Loading...</span>' +
      "</div>"+
      "</div>";
    $("#quote").prepend(html);
    isImageLoading = true;
    }

async function getCharacterImageUrl(anime, character) {
    let characterNameBits = character.split(" ");
    let animeData = await searchForAnime(anime);
    //TODO: fix this
    if (animeData) {
        let characters = await fetchAnimeCharacters(animeData.results[0].mal_id);
        if (characters) {
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

function vhToPixels (vh) {
    return Math.round(window.innerHeight / (100 / vh));
  }