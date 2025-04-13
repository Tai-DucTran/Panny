import { styled } from "styled-components";

export const ListOfItems = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  max-width: auto;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 0 16px;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
`;
