import React from "react";
import styled from "styled-components";

const tokens = [
  { name: "FARM", url: "https://harvestfi.github.io/add-farm/" },
  { name: "fUSDC", url: "https://harvestfi.github.io/add-fusdc/" },
  { name: "fUSDT", url: "https://harvestfi.github.io/add-fusdt/" },
  { name: "fDAI", url: "https://harvestfi.github.io/add-fdai/" },
  { name: "fwBTC", url: "https://harvestfi.github.io/add-fwbtc/" },
  { name: "frenBTC", url: "https://harvestfi.github.io/add-frenbtc/" },
  { name: "fcrvRenWBTC", url: "https://harvestfi.github.io/add-fcrvrenwbtc/" },
];

const Container = styled.div`
  margin-top: 16px;
`;

const Footer = () => (
  <Container>
    <div>
      Add assets to wallet: &nbsp;
      {tokens.map(({ name, url }) => (
        <>
          <a target="_blank" rel="noopener noreferrer" href={url}>
            {name}
          </a>
          &nbsp;
        </>
      ))}
    </div>
    <div>
      Contribute to&nbsp;
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://farm.chainwiki.dev"
      >
        Harvest Wiki
      </a>
      &nbsp; or 0x84BB14595Fd30a53cbE18e68085D42645901D8B6
    </div>
  </Container>
);

export default Footer;
