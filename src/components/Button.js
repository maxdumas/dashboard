import styled from "styled-components";

const Button = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 3px;
  border: 2px solid rgb(53, 52, 47);
  background-color: rgb(255, 252, 230);
  font-weight: bold;
  cursor: pointer;
  outline: 0px;
  transition: all 0.25s ease 0s;

  &:hover {
    box-shadow: black 3px 3px;
  }
`;

export default Button;
