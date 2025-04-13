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

// Styled components for the empty state
export const EmptyGarden = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

export const EmptyTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #333;
`;

export const EmptyMessage = styled.p`
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.6;
`;

export const AddPlantButton = styled.div`
  display: inline-block;
  background-color: #2e7d32;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1b5e20;
  }
`;
