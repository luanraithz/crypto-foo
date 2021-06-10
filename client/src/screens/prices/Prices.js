import React, { Component } from "react";
import {
  getTopListBy24Hours,
  getCryptoInfoAndExchanges,
} from '../../services/crypto/crypto-service';
import { List, Avatar } from 'antd';
import styled from 'styled-components';
import { CryptoCurrencyDrawer } from "./components/drawer/CryptocurrencyDrawer";
import { LoadMore } from '../../shared/components/loadMore/LoadMore';
import RouteWrapper from '../../shared/components/routeWrapper/RouteWrapper';

const ListWrapper = styled.div`
  width: 70%;
  margin: 0 auto;
  border: 1px solid #ebedf0;
  border-radius: 4px;
  padding: 10px 15px;
`

const Price = styled.div`
  user-select: none;
`
const StyledListItem = styled(List.Item)`
  padding: 10px !important;
  cursor: pointer;
  & > div > .ant-list-item-meta-avatar{
    justify-content: center;
  }
  &:hover {
    background-color: #f1f3f5;
  }
`;

export class Prices extends Component {
  state = { 
    cryptos: [], 
    loading: true, 
    searchInfo: {
      limit: 10,
      symbol: 'USD',
      page: 0 
    },
    activeCoin: {},
    drawerVisible: false,
    exchangesLimit: 10,
    exchangesLoading: false,
    exchanges: [],
    priceHistory: [],
    loadingPriceHistory: false
  };

  constructor(props) {
    super(props);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onLoadMoreExchanges = this.onLoadMoreExchanges.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  componentDidMount() {
    this.search()
  }

  async search() {
    const cryptos = await getTopListBy24Hours(this.state.searchInfo)
    this.setState({
      cryptos: this.state.cryptos.concat(cryptos),
      loading: false
    })
    
  }

  onLoadMore() {
    this.setState({ 
      searchInfo: { ...this.state.searchInfo, page: this.state.searchInfo.page + 1 },
      loading: true
    }, this.search);
  }
  
  itemClicked(item) {
    this.setState({
      drawerVisible: true, activeCoin: item,
      exchangesLoading: true, errorMessage: '', loadingPriceHistory: true
    }, this.loadExchanges);
  }

  async loadExchanges() {
    const { coinInfo, exchanges, error, errorType, message } = await getCryptoInfoAndExchanges(this.state.activeCoin.name, 'USD', this.state.exchangesLimit);
    if (!error) { 
      this.setState({      
        exchangesLoading: false,
        selectedCoinInfo: coinInfo,
        loadingPriceHistory: true,
        exchanges,
        hasMoreExchanges: this.state.exchangesLimit === exchanges.length
      });
    } else {
      switch (errorType) {
        case 'INFO_NOT_FOUND':
          this.setState({      
            exchangesLoading: false,
            selectedCoinInfo: null,
            exchanges: null,
            hasMoreExchanges: false,
            errorMessage: message,
            loadingPriceHistory: false
          })
          break;
        case 'NONE_EXCHANGE_FOUND': 
          this.setState({  
            exchangesLoading: false,
            selectedCoinInfo: coinInfo,
            exchanges: null,
            hasMoreExchanges: false,
            errorMessage: message,
            loadingPriceHistory: true
          }, this.loadPriceHistory);
          break;
        default:
          console.log(`NEW ERROR TYPE ${errorType}`)
      }
    }
  }
  
  closeDrawer() {
    this.setState({
      drawerVisible: false, exchangesLimit: 10, 
      activeCoin: {}, selectedCoinInfo: {}, 
      exchanges: [], priceHistory: []
    });
  }

  renderItem(item) {
    return (
      <StyledListItem key={item.id} item={item} onClick={() => this.itemClicked(item)}>
       <List.Item.Meta
          avatar={<Avatar src={item.imageUrl} />}
          title={<a href={item.href}>{item.displayName}</a> }/>
        <Price> {item.price} </Price>
      </StyledListItem>
    )
  }

  loadMore() {
    return this.state.cryptos.length && <LoadMore loading={this.state.loading} onClick={this.onLoadMore} />;
  }

  onLoadMoreExchanges() {
    this.setState({ exchangesLimit: this.state.exchangesLimit + 10, exchangesLoading: true }, this.loadExchanges);
  }
  
  render() {
    return (
      <RouteWrapper>
        <CryptoCurrencyDrawer 
          visible={this.state.drawerVisible} 
          cryptocurrencyInfo={this.state.selectedCoinInfo} 
          onClose={this.closeDrawer}
          exchangesLoading={this.state.exchangesLoading}
          exchanges={this.state.exchanges}
          onLoadMoreExchanges={this.onLoadMoreExchanges}
          hasMoreExchanges={this.state.hasMoreExchanges}
          errorMessage={this.state.errorMessage}
          onOpenExchange={console.log}
          />
        <ListWrapper>
          <List
            loadMore={this.loadMore()}
            loading={this.state.loading && !this.state.cryptos.length}
            size="small"
            itemLayout="horizontal"
            dataSource={this.state.cryptos}
            renderItem={this.renderItem}
          />
        </ListWrapper>
      </RouteWrapper>
    )
  }

}