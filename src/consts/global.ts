export const POLLING_INTERVAL = 4000
export const ethNetworkName = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  60: 'GoChain',
  77: 'Sokol',
  99: 'Core',
  100: 'Xdai',
}
const apiKeyElement = document.getElementById('dh-apiKey')
export const apiKey = apiKeyElement.getAttribute('data-api')

