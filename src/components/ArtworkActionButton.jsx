import styled from "styled-components";

const colorMap = {
  favorite: {
    color: "#BF9C73",
    border: "rgba(191, 156, 115, 0.35)",
    hoverBg: "rgba(191, 156, 115, 0.18)",
    hoverBorder: "#BF9C73",
  },

  share: {
    color: "#4D99A6",
    border: "rgba(77, 153, 166, 0.35)",
    hoverBg: "rgba(77, 153, 166, 0.18)",
    hoverBorder: "#4D99A6",
  },

  delete: {
    color: "#C46A5A",
    border: "rgba(196, 106, 90, 0.35)",
    hoverBg: "rgba(196, 106, 90, 0.18)",
    hoverBorder: "#C46A5A",
  },
};

const StyledButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 80px;
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ variant }) => colorMap[variant]?.border || colorMap.favorite.border};
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);

  color: ${({ variant }) =>
    colorMap[variant]?.color || colorMap.favorite.color};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ variant }) =>
      colorMap[variant]?.hoverBg || colorMap.favorite.hoverBg};
    border-color: ${({ variant }) =>
      colorMap[variant]?.hoverBorder || colorMap.favorite.hoverBorder};
    box-shadow: 0 6px 14px
      ${({ variant }) =>
        colorMap[variant]?.hoverBg || colorMap.favorite.hoverBg};
  }

  img {
    width: 18px;
    height: 18px;
    transition: transform 0.25s ease;
  }

  &:hover img {
    transform: scale(1.12);
  }

  &::before {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    white-space: nowrap;
    padding: 8px 12px;
    border-radius: 8px;
    background: #1f1f1f;
    color: white;
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.25s ease;
    border-left: 3px solid
      ${({ variant }) => colorMap[variant]?.color || colorMap.favorite.color};
    z-index: 100;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #1f1f1f;
    opacity: 0;
    transition: all 0.25s ease;
  }

  &:hover::before,
  &:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

export default StyledButton;
