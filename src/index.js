import * as $ from "jquery";
import "../scss/custom.scss";
import "bootstrap";
import * as defaultAuthorImage from "../images/default.jpg";
import generateAnimeQuote from "animequote";

let isImageLoading = false;

(function init() {
  addQuoteNewClickEvent();
  changeQuote();
})();

function addQuoteNewClickEvent() {
    $("#new-quote").on("click", event => {
        event.preventDefault();
        if (!isImageLoading) {
            changeQuote();
        }
    });
}

async function changeQuote() {
  let animeQuote = generateAnimeQuote();
  changeSentence(animeQuote.quotesentence);
  changeAuthor(animeQuote.quotecharacter);
  await changeAuthorImageBy(animeQuote.quoteanime, animeQuote.quotecharacter);
}

async function changeAuthorImageBy(anime, character) {
  $("#author-image").remove();
  addLoading();
  let imageUrl = undefined;
  try {
    imageUrl = await getCharacterImageUrlBy(anime, character);
  } catch (error) {
    console.warn("Could not get character image because:\n",error);
  } finally {
    removeLoading();
    addDefaultAuthorImage(imageUrl);
  }
}

function removeLoading() {
  $("#author-image-loading").remove();
  isImageLoading = false;
}

function changeAuthor(quotecharacter) {
  $("#author").text(`- ${quotecharacter}`);
}

function changeSentence(quotesentence) {
  $("#text").text(quotesentence);
}

function addDefaultAuthorImage(imageUrl) {
  let html =
    '<img id="author-image" class="author-image d-block mx-auto pr-3 oppacity-60" ' +
    `src = "${
      imageUrl ? imageUrl : defaultAuthorImage
    }" alt = "Author image" >`;
  $("#quote-box").prepend(html);
}

function addLoading() {
  let html =
    `<div id="author-image-loading" class="d-flex mx-auto author-image pr-3 oppacity-60 box-sizing-content" style="width: ${vhToPixels(
      45
    ) * 0.643759}px;">` +
    '<div class="spinner-grow mx-auto d-block align-self-center justify-self-center" role="status" >' +
    '<span class="sr-only">Loading...</span>' +
    "</div>" +
    "</div>";
  $("#quote-box").prepend(html);
  isImageLoading = true;
}

async function getCharacterImageUrlBy(anime, character) {
  let characterNameBits = character.split(" ");
  let animeData = await fetchSearchForAnime(anime);
  let characters = await fetchAnimeCharacters(animeData.mal_id);
  let matchingCharacters = characters.filter(
    e =>
      e.name.includes(characterNameBits[0]) &&
      e.name.includes(characterNameBits[characterNameBits.length - 1])
  );
  return matchingCharacters[0].image_url;
}

async function fetchAnimeCharacters(animeId) {
  let response = await $.ajax({
    url: `https://api.jikan.moe/v3/anime/${animeId}/characters_staff`,
    type: "GET"
  });
  return response.characters;
}

async function fetchSearchForAnime(anime) {
  let response = await $.ajax({
    url: "https://api.jikan.moe/v3/search/anime",
    type: "GET",
    data: {
      type: "anime",
      q: anime,
      limit: 1
    }
  });
  return response.results[0];
}

function vhToPixels(vh) {
  return Math.round(window.innerHeight / (100 / vh));
}
