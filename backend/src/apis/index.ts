import { Router } from 'express';

import multer from 'multer';

import articlesController from '@apis/articles/articles.controller';
import authController from '@apis/auth/auth.controller';
import bookmarksController from '@apis/bookmarks/bookmarks.controller';
import booksController from '@apis/books/books.controller';
import imagesController from '@apis/images/images.controller';
import scrapsController from '@apis/scraps/scraps.controller';
import usersController from '@apis/users/users.controller';
import decoder from '@middlewares/tokenDecoder';
import guard from '@middlewares/tokenValidator';
import { catchAsync } from '@utils/catch-async';

const router = Router();

router.post('/auth/signin/local', catchAsync(authController.signIn));
router.post('/auth/signin/github', catchAsync(authController.signInGithub));
router.post('/auth/signup', catchAsync(authController.signUp));
router.get('/auth/signout', catchAsync(authController.signOut));
router.get('/auth', decoder, catchAsync(authController.checkSignInStatus));

router.get('/articles/temporary', guard, catchAsync(articlesController.getTemporaryArticle));
router.post('/articles/temporary', guard, catchAsync(articlesController.createTemporaryArticle));
router.get('/articles/search', catchAsync(articlesController.searchArticles));
router.get('/articles/:articleId', catchAsync(articlesController.getArticle));
router.post('/articles', catchAsync(articlesController.createArticle));
router.patch('/articles/:articleId', catchAsync(articlesController.updateArticle));
router.delete('/articles/:articleId', catchAsync(articlesController.deleteArticle));

router.post('/image', multer().single('image'), catchAsync(imagesController.createImage));

router.get('/books/search', catchAsync(booksController.searchBooks));
router.get('/books/:bookId', decoder, catchAsync(booksController.getBook));
router.get('/books', decoder, catchAsync(booksController.getBooks));
router.post('/books', guard, catchAsync(booksController.createBook));
router.patch('/books', guard, catchAsync(booksController.updateBook));
router.delete('/books/:bookId', guard, catchAsync(booksController.deleteBook));

router.post('/bookmarks', guard, catchAsync(bookmarksController.createBookmark));
router.delete('/bookmarks/:bookmarkId', catchAsync(bookmarksController.deleteBookmark));

router.get('/scraps', catchAsync(scrapsController.getScraps));
router.patch('/scraps', catchAsync(guard), catchAsync(scrapsController.updateScrapsOrder));
router.post('/scraps', catchAsync(scrapsController.createScrap));
router.delete('/scraps/:scrapId', guard, catchAsync(scrapsController.deleteScrap));

router.get('/users', catchAsync(usersController.getUserProfile));
router.patch('/users/:userId', catchAsync(usersController.editUserProfile));

export default router;
