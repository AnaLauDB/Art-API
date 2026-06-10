import styled, { css } from "styled-components";

const variants = {
  profile: {
    hover: "#5B7DB1",
  },

  logout: {
    hover: "#B56B5A",
  },

  login: {
    hover: "#7A9B76",
  },
};

const ButtonsHeader = styled.button`
  ${({ variant = "profile" }) => css`
    --hover-color: ${variants[variant].hover};
  `}

  border: none;

  min-width: 150px;
  height: 48px;

  border-radius: 14px;

  cursor: pointer;

  background: #f3efe8;

  padding: 0 1rem;

  transition: all 0.25s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.75rem;

  color: #6d4c41;

  font-weight: 600;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    color: var(--hover-color);

    transform: translateY(-2px);

    box-shadow:
      0 8px 18px rgba(0, 0, 0, 0.1),
      0 0 10px color-mix(in srgb, var(--hover-color) 35%, transparent);
  }

  img {
    width: 18px;
    height: 18px;
  }
`;

export default ButtonsHeader;
