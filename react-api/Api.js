import axios from 'axios';

const BASE_URL = 'https://opentdb.com/api.php';

export const fetchQuestions = async (difficulty, category) => {
  let url = `${BASE_URL}?amount=10&type=multiple&encode=url3986`;
  if (difficulty !== 'all') {
    url += `&difficulty=${difficulty}`;
  }
  if (category !== 'all') {
    url += `&category=${category}`;
  }

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return []; 
  }
};
