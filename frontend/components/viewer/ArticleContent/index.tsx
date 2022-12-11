import Image from 'next/image';
import { useRouter } from 'next/router';

import { useEffect } from 'react';

import { useRecoilValue } from 'recoil';

import { deleteArticleApi } from '@apis/articleApi';
import { deleteScrapApi, updateScrapsOrderApi } from '@apis/scrapApi';
import LeftBtnIcon from '@assets/ico_leftBtn.svg';
import Original from '@assets/ico_original.svg';
import RightBtnIcon from '@assets/ico_rightBtn.svg';
import Scrap from '@assets/ico_scrap.svg';
import signInStatusState from '@atoms/signInStatus';
import Content from '@components/common/Content';
import useFetch from '@hooks/useFetch';
import { IArticleBook, IScrap } from '@interfaces';
import { TextLarge } from '@styles/common';

import ArticleButton from './Button';
import {
  ArticleContainer,
  ArticleLeftBtn,
  ArticleMain,
  ArticleRightBtn,
  ArticleTitle,
  ArticleTitleBtnBox,
  ArticleContentsWrapper,
} from './styled';

interface ArticleProps {
  article: IArticleBook;
  scraps: IScrap[];
  bookId: number;
  bookAuthor: string;
  handleScrapBtnClick: () => void;
}

export default function Article({
  article,
  scraps,
  bookId,
  bookAuthor,
  handleScrapBtnClick,
}: ArticleProps) {
  const user = useRecoilValue(signInStatusState);

  const { data: deleteArticleData, execute: deleteArticle } = useFetch(deleteArticleApi);
  const { execute: deleteScrap } = useFetch(deleteScrapApi);
  const { data: updateScrapsData, execute: updateScrapsOrder } = useFetch(updateScrapsOrderApi);

  const router = useRouter();

  const handleOriginalBtnOnClick = () => {
    router.push(`/viewer/${article.book_id}/${article.id}`);
  };

  const handleLeftBtnOnClick = () => {
    const prevOrder = scraps.filter((scrap) => scrap.article.id === article.id)[0].order - 1;
    const prevArticleId = scraps.filter((scrap) => scrap.order === prevOrder)[0].article.id;
    router.push(`/viewer/${bookId}/${prevArticleId}`);
  };

  const handleRightBtnOnClick = () => {
    const nextOrder = scraps.filter((scrap) => scrap.article.id === article.id)[0].order + 1;
    const nextArticleId = scraps.filter((scrap) => scrap.order === nextOrder)[0].article.id;
    router.push(`/viewer/${bookId}/${nextArticleId}`);
  };

  const handleDeleteBtnOnClick = () => {
    if (window.confirm('해당 글을 삭제하시겠습니까?')) {
      const curScrap = scraps.find((scrap) => scrap.article.id === article.id);
      deleteScrap(curScrap?.id);
      deleteArticle(article.id);
    }
  };

  const handleScrapDeleteBtnOnClick = () => {
    if (window.confirm('해당 글을 책에서 삭제하시겠습니까?')) {
      const curScrap = scraps.find((scrap) => scrap.article.id === article.id);
      if (!curScrap) return;
      const newScraps = scraps
        .filter((scrap) => scrap.id !== curScrap.id)
        .map((v, i) => ({ ...v, order: i + 1 }));
      updateScrapsOrder(newScraps);
      deleteScrap(curScrap.id);
    }
  };

  const handleModifyBtnOnClick = () => {
    router.push(`/editor?id=${article.id}`);
  };

  useEffect(() => {
    if (deleteArticleData !== undefined) router.push('/');
  }, [deleteArticleData]);

  useEffect(() => {
    if (updateScrapsData === undefined) return;

    if (updateScrapsData.length !== 0) {
      router.push(`/viewer/${bookId}/${updateScrapsData[0].article.id}`);
      return;
    }
    router.push('/');
  }, [updateScrapsData]);

  return (
    <ArticleContainer>
      {article.id === scraps.at(0)?.article.id ? null : (
        <ArticleLeftBtn onClick={handleLeftBtnOnClick}>
          <Image src={LeftBtnIcon} width={24} height={24} alt="Left Arrow Icon" />
        </ArticleLeftBtn>
      )}
      {!article.deleted_at ? (
        <ArticleMain>
          <ArticleContentsWrapper>
            <ArticleTitle>{article.title}</ArticleTitle>
            <Content content={article.content} />
          </ArticleContentsWrapper>

          <ArticleTitleBtnBox>
            {article.book_id !== bookId && (
              <ArticleButton onClick={handleOriginalBtnOnClick}>
                <Image src={Original} alt="Original Icon" width={20} height={15} />
                원본 글 보기
              </ArticleButton>
            )}
            {article.book_id === bookId && article.book.user.nickname === user.nickname && (
              <>
                <ArticleButton onClick={handleDeleteBtnOnClick}>글 삭제</ArticleButton>
                <ArticleButton onClick={handleModifyBtnOnClick}>글 수정</ArticleButton>
              </>
            )}
            {article.book_id !== bookId && bookAuthor === user.nickname && (
              <ArticleButton onClick={handleScrapDeleteBtnOnClick}>스크랩 삭제</ArticleButton>
            )}
            {user.id !== 0 && (
              <ArticleButton onClick={handleScrapBtnClick}>
                <Image src={Scrap} alt="Scrap Icon" width={20} height={15} />
                스크랩
              </ArticleButton>
            )}
          </ArticleTitleBtnBox>
        </ArticleMain>
      ) : (
        <ArticleMain>삭제된 글입니다.</ArticleMain>
      )}

      {article.id === scraps.at(-1)?.article.id ? null : (
        <ArticleRightBtn onClick={handleRightBtnOnClick}>
          <Image src={RightBtnIcon} width={24} height={24} alt="Right Arrow Icon" />
        </ArticleRightBtn>
      )}
    </ArticleContainer>
  );
}
