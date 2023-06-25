import axios from 'axios';
import Notiflix from 'notiflix';
import PicturesApi from './js/PicturesApi';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const loadMoreBtnRef = document.querySelector('.load-more');

const picsApi = new PicturesApi();
const loadMorebtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });

formRef.addEventListener('submit', submitSearchFormHendle);
loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onLoadMore() {
  picsApi.page += 1;
  loadMorebtn.disabled();
  try {
    const { totalHits, hits } = await picsApi.fetchPics();
    if (40 * (picsApi.page - 1) >= totalHits) {
      loadMorebtn.hide();
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    loadMorebtn.enable();
    renderMarkup(hits);
  } catch (error) {
    Notiflix.Notify.failure('Oops something gone wrong..');
    console.log(error);
  }
}

async function submitSearchFormHendle(e) {
  e.preventDefault();

  picsApi.topic = e.currentTarget.elements.searchQuery.value.trim();
  picsApi.resetPage();
  resetMarkup();

  if (picsApi.topic === '') {
    Notiflix.Report.failure('Error', 'Fill the search input', 'OK');
    return;
  }

  loadMorebtn.show();
  loadMorebtn.disabled();

  try {
    const { totalHits, hits } = await picsApi.fetchPics();

    if (hits.length === 0) {
      loadMorebtn.hide();
      Notiflix.Report.failure(
        'Error',
        'Sorry, there are no images matching your search query. Please try again.',
        'OK'
      );
      return;
    }

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    renderMarkup(hits);

    loadMorebtn.enable();
  } catch (err) {
    Notiflix.Report.failure('Error', `${err}`, 'OK');
  }
}

function renderMarkup(data) {
  let markup = data.map(item => makeGalleryItemMarkup(item)).join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function makeGalleryItemMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}"><img class = "card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
	</a>
 
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;
}

function resetMarkup() {
  galleryRef.innerHTML = '';
}
