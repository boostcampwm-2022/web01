import Image from 'next/image';

import { useEffect, useRef } from 'react';

import { createImageApi } from '@apis/imageApi';
import Edit from '@assets/ico_edit.svg';
import useFetch from '@hooks/useFetch';
import useInput from '@hooks/useInput';
import { IUser } from '@interfaces';
import { TextLinkMedium } from '@styles/common';

import {
  ButtonGroup,
  EditUsername,
  ProfileEditButton,
  EditUserDescription,
  UserDetailGroup,
  UserProfileWrapper,
  UserThumbnail,
  EditThumbnailIcon,
} from './styled';

interface EditUserProfileProps {
  curUserProfile: IUser;
  setCurUserProfile: (userProfile: IUser) => void;
  handleEditFinishBtnClick: () => void;
}

export default function EditUserProfile({
  curUserProfile,
  setCurUserProfile,
  handleEditFinishBtnClick,
}: EditUserProfileProps) {
  const { data: imgFile, execute: createImage } = useFetch(createImageApi);
  const { value: nicknameValue, onChange: onNicknameChange } = useInput(curUserProfile.nickname);
  const { value: descriptionValue, onChange: onDescriptionChange } = useInput(
    curUserProfile.description
  );
  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleEditThumbnailClick = () => {
    if (!inputFile.current) return;
    inputFile.current.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!event.target.files) return;

    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    createImage(formData);
  };

  useEffect(() => {
    setCurUserProfile({
      ...curUserProfile,
      nickname: nicknameValue,
      description: descriptionValue,
    });
  }, [nicknameValue, descriptionValue]);

  useEffect(() => {
    if (!imgFile) return;

    setCurUserProfile({
      ...curUserProfile,
      profile_image: imgFile.imagePath,
    });
  }, [imgFile]);

  return (
    <UserProfileWrapper>
      <div>
        <UserThumbnail src={curUserProfile.profile_image} alt="User1" width={200} height={200} />
        <EditThumbnailIcon onClick={handleEditThumbnailClick}>
          <Image src={Edit} alt="profile_edit" width={20} />
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </EditThumbnailIcon>
      </div>

      <UserDetailGroup>
        <EditUsername defaultValue={curUserProfile.nickname} onChange={onNicknameChange} />
        <EditUserDescription
          defaultValue={curUserProfile.description}
          onChange={onDescriptionChange}
        />

        <ButtonGroup isVisible>
          <ProfileEditButton type="button" onClick={handleEditFinishBtnClick}>
            <TextLinkMedium>수정 완료</TextLinkMedium>
          </ProfileEditButton>
        </ButtonGroup>
      </UserDetailGroup>
    </UserProfileWrapper>
  );
}
