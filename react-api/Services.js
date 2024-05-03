import axios from 'axios';


export const fetchQuestions = async (difficulty, category) => {
  let url = `https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986`;
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
    console.error('Erreur:', error);
    return [];
  }
};
