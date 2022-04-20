const FETCH_URL =
  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=dad3237e22d2e3871f8074686cbf47a1&tags=%27summer%27&format=json&nojsoncallback=1";

const thumbnailsBuffering = document.getElementsByClassName(
  "thumbnails--buffering"
)[0];
const thumbnailsContainer = document.getElementsByClassName(
  "thumbnails--container"
)[0];
const modalContainer = document.getElementsByClassName("modal--container")[0];
const body = document.getElementsByTagName("body")[0];

const photosPerPage = 10;

let nrOfPhotos = 0;
let pageNumber = 1;
let data = [];

async function loadData() {
  body.removeChild(modalContainer);
  const res = await fetch(FETCH_URL);
  data = await res.json();
  nrOfPhotos = data.photos.photo.length;

  updateThumbnails();
}

function openModal(url) {
  body.appendChild(modalContainer);
  const modalImg = document.getElementsByClassName("modal--image")[0];
  modalImg.src = url;
}

function closeModal() {
  body.removeChild(modalContainer);
}

function updateThumbnails() {
  thumbnailsContainer.innerHTML = "";
  thumbnailsContainer.appendChild(thumbnailsBuffering);

  for (
    let index = (pageNumber - 1) * photosPerPage;
    index < Math.min(nrOfPhotos, pageNumber * photosPerPage);
    index++
  ) {
    let thumbnail = document.createElement("div");
    let thumbnailData = data.photos.photo[index];
    const url =
      (onclick = `https://farm${thumbnailData.farm}.staticflickr.com/${thumbnailData.server}/${thumbnailData.id}_${thumbnailData.secret}.jpg`);
    thumbnail.innerHTML = `<img class="thumbnails--thumbnail" src="${url}" />`;
    thumbnail.onclick = () => openModal(url);
    thumbnailsContainer.appendChild(thumbnail);
  }

  thumbnailsContainer.removeChild(thumbnailsBuffering);
}

function changePage(direction) {
  if (
    1 <= pageNumber + direction &&
    pageNumber + direction <= nrOfPhotos / photosPerPage
  ) {
    pageNumber += direction;
    updateThumbnails();
  }
}

loadData();
