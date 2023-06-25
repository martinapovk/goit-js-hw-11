import axios from 'axios';
export default class PicturesApi {
  constructor() {
    this.topic = '';
    this.page = 1;
  }

  async fetchPics() {
    const URL = 'https://pixabay.com/api/';
    const KEY = '37811543-b06f280f3d7e7be97e6295a75';

    const response = await axios.get(`${URL}`, {
      params: {
        q: this.topic,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        key: KEY,
      },
    });
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }
}
