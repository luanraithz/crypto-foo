import React, { Component } from "react";
import { Drawer, Divider, Avatar } from "antd";
import styled from "styled-components";
import { Exchanges } from "../exchanges/Exchanges";
import { CryptoInfo } from '../cryptoInfo/CryptoInfo';

const StyledCoinAvatarAndTitle = styled.div `
  padding-top: 5px;
  display: flex;
  align-items: center;
`

const Title = styled.span`
  padding-left: 20px;
  font-size: 25px;
`

const ExchangesTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 22px;
  padding: 5px 0px 20px 0px;
`

export class CryptoCurrencyDrawer extends Component {
  render() {
    return (
      <Drawer
        visible={this.props.visible}
        width={800}
        placement="right"
        onClose={this.props.onClose}> 
        { this.props.cryptocurrencyInfo && (
          <>
            <StyledCoinAvatarAndTitle>
              <Avatar size="large" src={this.props.cryptocurrencyInfo.imageUrl} />
              <Title>
                {this.props.cryptocurrencyInfo.displayName}
              </Title>
            </StyledCoinAvatarAndTitle>
            <Divider />
            <CryptoInfo
                totalCoinsMined={this.props.cryptocurrencyInfo.totalCoinsMined}
                overviewUrl={this.props.cryptocurrencyInfo.overviewUrl}
                />
          </>
        )}
        { this.props.exchanges && (
          <>
            <ExchangesTitle>Exchanges trading this cryptocurrency</ExchangesTitle>
              <Exchanges 
              loading={!this.props.loading && this.props.exchangesLoading} 
              exchanges={this.props.exchanges}
              onClick={this.props.onOpenExchange}
              onLoadMore={this.props.onLoadMoreExchanges}
              hasMoreExchanges={this.props.hasMoreExchanges}/>
          </>
        )}
        { this.props.errorMessage && (
          <> { this.props.errorMessage } </>
        )

        }
      </Drawer>
    );
  }
}

CryptoCurrencyDrawer.defaultProps = {
  visible: false,
  exchangesLoading: false,
  exchanges: [],
  cryptocurrencyInfo: {},
  onClose: () => {}
};
