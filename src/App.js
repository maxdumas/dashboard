import detectEthereumProvider from "@metamask/detect-provider";
import styled from "styled-components";
import harvest from "./lib/index.js";

import React from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Footer from "./components/Footer";
import { MainTable, UnderlyingTable } from "./components/MainTable.js";

const { ethers, utils } = harvest;

const Header = styled.header`
  font-size 24px;
  font-weight: bold;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.main`
  max-width: 750px;
  margin: 0px auto;
  text-align: center;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: undefined,
      signer: undefined,
      address: "",
      manager: undefined,
      summaries: [],
      underlyings: [],
      usdValue: 0,
    };
  }

  setProvider(provider) {
    provider = new ethers.providers.Web3Provider(provider);

    let signer;
    try {
      signer = provider.getSigner();
    } catch (e) {
      console.log(e);
    }
    const manager = harvest.manager.PoolManager.allPastPools(
      signer ? signer : provider
    );

    this.setState({ provider, signer, manager });

    window.ethereum.on("accountsChanged", () => {
      this.setState({
        provider: undefined,
        signer: undefined,
        address: "",
        manager: undefined,
        summaries: [],
        underlyings: [],
        usdValue: 0,
      });
    });

    console.log({ provider, signer, manager });

    // get the user address
    signer.getAddress().then((address) => this.setState({ address }));
  }

  connectMetamask() {
    detectEthereumProvider().then((provider) => {
      window.ethereum.enable().then(() => this.setProvider(provider));
    });
  }

  refreshButtonAction() {
    console.log("refreshing");
    this.state.manager
      .aggregateUnderlyings(this.state.address)
      .then((underlying) =>
        underlying.toList().filter((u) => !u.balance.isZero())
      )
      .then((underlyings) => {
        this.setState({ underlyings });
        return underlyings;
      });

    this.state.manager
      .summary(this.state.address)
      .then((summaries) =>
        summaries.filter(
          (p) =>
            !p.summary.earnedRewards.isZero() ||
            !p.summary.stakedBalance.isZero() ||
            (p.summary.isActive && !p.summary.unstakedBalance.isZero())
        )
      )
      .then((summaries) => {
        let total = ethers.BigNumber.from(0);
        summaries.forEach((pos) => {
          total = total.add(pos.summary.usdValueOf);
        });
        this.setState({ summaries, usdValue: total });
        return summaries;
      });
  }

  harvestButtonAction() {
    console.log("harvesting");
    const minHarvestInput = document.getElementById("minHarvest").value;
    const minHarvest = minHarvestInput
      ? ethers.utils.parseUnits(minHarvestInput, 18)
      : ethers.constants.WeiPerEther.div(10);
    this.state.manager.getRewards(minHarvest);
  }

  exitInactiveButtonAction() {
    console.log("exiting inactive");
    this.state.manager.exitInactive();
  }

  render() {
    const connectBtn = this.renderConnectStatus();
    const refreshBtn = this.renderRefreshButton();
    const harvestAll = this.renderHarvestAll();
    const navMessage = this.renderNAV();
    const exitInactive = this.renderExitInactiveButton();
    const table = this.renderMainTable();
    const underlyingTable = this.renderUnderlyingTable();
    return (
      <>
        <Header>
          <h1>Harvest Finance Dashboard</h1>
        </Header>
        <Container>
          {connectBtn}
          {refreshBtn}
          {table}
          <div>
            {navMessage}
            {harvestAll}
            {exitInactive}
          </div>
          {underlyingTable}
          <Footer />
        </Container>
      </>
    );
  }

  renderNAV() {
    if (this.state.summaries.length !== 0) {
      const formatted = utils.prettyMoney(this.state.usdValue);
      return (
        <p>
          Your staked assets and earned rewards are worth about{" "}
          <strong>{formatted}</strong>
        </p>
      );
    }
    return <div></div>;
  }

  renderMainTable() {
    if (this.state.summaries.length !== 0) {
      return <MainTable data={this.state.summaries}></MainTable>;
    }
    return <div></div>;
  }

  renderUnderlyingTable() {
    if (this.state.underlyings.length !== 0) {
      return (
        <div>
          <p>
            Your position includes LP tokens that can be redeemed for the
            following:
          </p>
          <UnderlyingTable data={this.state.underlyings}></UnderlyingTable>
        </div>
      );
    }
    return <div></div>;
  }

  renderConnectStatus() {
    if (!this.state.provider) {
      return (
        <Alert>
          You haven't connected a wallet.
          <Button onClick={this.connectMetamask.bind(this)}>
            Connect Wallet
          </Button>
        </Alert>
      );
    }
    return (
      <p>
        Your wallet address is:{" "}
        <span id="address">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={
              this.state.address
                ? "https://etherscan.io/address/" + this.state.address
                : "#"
            }
          >
            {this.state.address || "not connected"}
          </a>
        </span>
      </p>
    );
  }

  renderHarvestAll() {
    if (this.state.summaries.length !== 0) {
      const harvestBtn = this.renderHarvestButton();
      return (
        <p>
          Harvest all farms with at least{" "}
          <input type="text" id="minHarvest" placeholder="min"></input> FARM
          rewards {harvestBtn}
        </p>
      );
    }
    return <div></div>;
  }

  renderRefreshButton() {
    if (!this.state.provider) {
      return null;
    }

    const buttonText =
      this.state.summaries.length === 0
        ? "Click to load the table!"
        : "Refresh Table";

    return (
      <div>
        <Button
          disabled={!this.state.provider}
          onClick={this.refreshButtonAction.bind(this)}
        >
          {buttonText}
        </Button>
      </div>
    );
  }

  renderHarvestButton() {
    return (
      <Button
        disabled={!this.state.provider}
        onClick={this.harvestButtonAction.bind(this)}
      >
        Harvest All
      </Button>
    );
  }

  renderExitInactiveButton() {
    let inactivePools = this.state.summaries.filter(
      (sum) => sum.stakedBalance && !sum.isActive
    );
    if (inactivePools.length !== 0) {
      return (
        <div>
          <Button
            disabled={!this.state.provider}
            onClick={this.exitInactiveButtonAction.bind(this)}
          >
            Exit inactive pools
          </Button>
        </div>
      );
    }
    return <div></div>;
  }
}

export default App;
