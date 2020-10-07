import styled from "styled-components";

const Alert = styled.div`
  width: 100%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  font-weight: bold;
  -webkit-box-align: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 2px solid black;
  text-align: left;
  background-color: rgb(255, 252, 230);
  height: 40px;
  box-shadow: black 3px 3px;

  & button {
    font-weight: bold;
    margin-left: 20px;
    background-color: rgb(238, 191, 101);
  }
`;

export default Alert;
