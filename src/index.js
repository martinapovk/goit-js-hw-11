import axios from 'axios';
import Notiflix from 'notiflix';
import PicturesApi from './js/PicturesApi';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37811543-b06f280f3d7e7be97e6295a75';

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
    if (100 * picsApi.page > totalHits) {
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

// async function loadMoreHendle() {
//   page += 1;
//   showLoadMore(false);
//   try {
//     const { totalHits, hits } = await picsApi.fetchPics();
//     if (100 * picsApi.page > totalHits) {
//       return Notiflix.Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     showLoadMore(true);
//     rendermarkup(hits);
//     autoScroll(2);
//   } catch (error) {
//     Notiflix.Notify.failure('Oops something gone wrong..');
//     console.log(error);
//   }
// }

// function loadMoreHendle() {
//   page += 1;
//   showLoadMore(false);
//   makeGallery();
//   getHitsArr();
// .then(res => {
//   if (!res.data.hits.length) {
//     throw new Error(
//       '"Sorry, there are no images matching your search query. Please try again."'
//     );
//   }
//   Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
//   //   console.log(res.data);
//   makeGallery(res.data.hits);
//   showLoadMore(true);
// })
// .catch(err => {
//   galleryRef.innerHTML = '';
//   Notiflix.Report.failure('Error', `${err}`, 'OK');
// });
// }

// async function getHitsArr() {
//   try {
//     const get = await axios.get(BASE_URL, {
//       params: {
//         key: API_KEY,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         q: 'cat',
//         page: page,
//         per_page: 3,
//       },
//     });
//     // const arr = await
//     console.log(get);
//   } catch {
//     console.log('errr');
//   }
// }
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
    // Notiflix.Notify.failure('Oops something gone wrong..');
    // console.log(error);
  }
}

// function submitSearchFormHendle(e) {
//   e.preventDefault();
//   galleryRef.innerHTML = '';

//   showLoadMore(false);
//   const searchWord = e.currentTarget.elements.searchQuery.value.trim();
//   getData(searchWord);
//   formRef.reset();
// }

// function getData(searchWord) {
//   axios
//     .get(BASE_URL, {
//       params: {
//         key: API_KEY,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         q: `${searchWord}`,
//         page: page,
//         per_page: 3,
//       },
//     })
//     .then(res => {
//       if (!res.data.hits.length) {
//         throw new Error(
//           '"Sorry, there are no images matching your search query. Please try again."'
//         );
//       }
//       Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
//       //   console.log(res.data);
//       makeGallery(res.data.hits);
//       showLoadMore(true);
//     })
//     .catch(err => {
//       galleryRef.innerHTML = '';
//       Notiflix.Report.failure('Error', `${err}`, 'OK');
//     });
// }

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

// function makeGallery(arrGalleryItems) {
//   let markup = arrGalleryItems
//     .map(item => makeGalleryItemMarkup(item))
//     .join('');
//   galleryRef.insertAdjacentHTML('beforeend', markup);
// }

// function resetMarkup() {
//   galleryRef.innerHTML = '';
// }

// function showLoadMore(isShow) {
//   loadMoreBtnRef.style.display = isShow ? 'block' : 'none ';
// }
