import { GENERAL_WALLETS, MIN_API_URL, CRYPTOCOMPARE_WEBSITE } from '../../config';
import { get } from '../get';

const walletsFilters = {
  coinsIncludes: coin => ({ coins }) => coins.map(supportedCoin => supportedCoin.toLowerCase()).includes(coin.toLowerCase()),
  anonymityIs: walletAnonymity => ({ anonymity }) => anonymity === walletAnonymity
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * @description Supports two filters, coinIncludes and security.
 */
const allWallets = async (req, res) => {
  const { coinsIncludes, anonymity } = req.query;

  const { Data: walletsWithKeyValue } = await get(GENERAL_WALLETS)
  
  /**
   * 
   * The Goal here was not performance, this could be reduced to just one loop.
   */
  const securityFilter = anonymity ? walletsFilters.anonymityIs(anonymity) : () => true;
  const coinsFilter = coinsIncludes ? walletsFilters.coinsIncludes(coinsIncludes) : () => true;

  const allWallets = Object.entries(walletsWithKeyValue)
    .map(([_key, wallet]) => wallet)
    .map(wallet => ({
      id: wallet.Id,
      name: wallet.Name,
      anonymity: wallet.Anonymity,
      security: wallet.Security,
      logoUrl: `${CRYPTOCOMPARE_WEBSITE}${wallet.LogoUrl}`,
      coins: wallet.Coins,
      platforms: wallet.Platforms,
      sourceCodeUrl: wallet.SourceCodeUrl,
      url: wallet.AffiliateURL,
      recommended: wallet.Recommended,
    }));
  
  res.send({ wallets: allWallets.filter(securityFilter).filter(coinsFilter) })
}

export { allWallets }