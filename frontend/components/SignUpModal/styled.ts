import { TextSmall } from '@styles/common';
import styled from 'styled-components';

export const SignUpModalWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
`;

export const SignUpModalErrorMessage = styled(TextSmall)`
  color: var(--red-color);
`;
