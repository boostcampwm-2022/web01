import api from '@utils/api';

interface SearchBooksApi {
  query: string;
  page: number;
  userId: number;
}

export const searchBooksApi = async (data: SearchBooksApi) => {
  const url = `/api/books/search`;
  const params = {
    query: data.query,
    page: data.page,
    userId: data.userId,
  };

  const response = await api({ url, method: 'GET', params });

  return response.data;
};

interface GetBooksApi {
  order: 'newest' | 'bookmark';
  take: number;
}

// NOTE: 서버에서 take가 없을 때 최대로

export const getBooksApi = async (data: GetBooksApi) => {
  const url = `/api/books?order=${data.order}&take=12`;

  const response = await api({ url, method: 'GET' });

  return response.data;
};

export const getOrderedBookListApi = async (order: string) => {
  const url = `/api/books?order=${order}&take=12`;

  const response = await api({ url, method: 'GET' });

  return response.data;
};

export const getBookApi = async (bookId: string) => {
  const url = `/api/books/${bookId}`;

  const response = await api({ url, method: 'GET' });

  return response.data;
};

export const getUserKnottedBooksApi = async (nickname: string) => {
  const url = `/api/books?editor=${nickname}&take=12`;

  const response = await api({ url, method: 'GET' });

  return response.data;
};
