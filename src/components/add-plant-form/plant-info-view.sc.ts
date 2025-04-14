// src/components/add-plant-form/plant-info-view.sc.ts
import { theme } from "@/styles/theme";
import styled from "styled-components";

export const InfoContainer = styled.div`
  margin-bottom: 2rem;
`;

export const PlantInfoBox = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid ${theme.colors.palette.morningBlue};
  margin-bottom: 1.5rem;
`;

export const PlantInfoHeader = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.2rem;
`;

export const PlantInfoText = styled.div`
  line-height: 1.6;
`;

export const MarkdownContent = styled.div`
  /* Styling for the markdown content */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${theme.colors.palette.darkCharcoal};
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    border-left: 3px solid ${theme.colors.palette.morningBlue};
    padding-left: 1rem;
    margin-left: 0;
    color: ${theme.colors.palette.darkCharcoal}cc;
    font-style: italic;
  }

  code {
    background-color: #f0f0f0;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  a {
    color: ${theme.colors.palette.morningBlue};
    text-decoration: underline;

    &:hover {
      color: ${theme.colors.palette.darkCharcoal};
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
  }

  hr {
    border: 0;
    height: 1px;
    background-color: #e0e0e0;
    margin: 1.5rem 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;

    th,
    td {
      border: 1px solid #e0e0e0;
      padding: 0.5rem;
    }

    th {
      background-color: #f0f0f0;
    }
  }
`;

export const CollapsedMarkdownContent = styled(MarkdownContent)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 4.8rem; /* Line height * 3 lines */
`;

export const CollapsedText = styled.p`
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
`;

export const ExpandableButton = styled.button`
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: ${theme.colors.palette.morningBlue};
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${theme.colors.palette.darkCharcoal};
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const LoadingText = styled.p`
  color: ${theme.colors.palette.darkCharcoal};
  margin: 0;
`;
