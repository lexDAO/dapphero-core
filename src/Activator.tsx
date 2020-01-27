import React, { useEffect, useState } from 'react'
import * as api from 'api'
import { InjectedConnector } from '@web3-react/injected-connector'
// import * as hooks from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { FeatureReducer } from './protocol/ethereum/featureReducer'
import { useEagerConnect } from './hooks'

const elements = Array.from(document.querySelectorAll(`[id^=dh]`))

export const Activator = () => {
  const { active, error, activate, ...rest } = useWeb3React()
  const [ configuration, setConfig ] = useState(null)
  console.log('useweb3react obj', { active, error, activate, ...rest })

  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectUrl('test.com/dev') }
      setConfig(newConfig)
    })()
  }, [])

  const triedEager = useEagerConnect()

  if (true) {
    const newConfig = JSON.parse(`{"contracts":[{"contractName":"DappHeroTest","contractAddress":"0x665605c40EECc83B51B56ad59bbEeaeF1aFE3330","contractAbi":[{"constant":false,"inputs":[],"name":"sendEthNoArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"message","type":"bytes32"}],"name":"sendEthWithArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"sendVariableEthNoArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"message","type":"bytes32"}],"name":"sendVariableEthWithArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"triggerEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"EventTrigger","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"}],"name":"ValueSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"message","type":"bytes32"}],"name":"ValueSentWithMessage","type":"event"},{"constant":true,"inputs":[{"name":"from","type":"address"},{"name":"multiplier","type":"uint256"}],"name":"viewMultipleArgsMultipleReturn","outputs":[{"name":"_balanceMultiplied","type":"uint256"},{"name":"_hello","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"},{"name":"multiplier","type":"uint256"}],"name":"viewMultipleArgsSingleReturn","outputs":[{"name":"_balanceMultiplied","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewNoArgsMultipleReturn","outputs":[{"name":"_important","type":"uint256"},{"name":"_hello","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}],"networkId":3,"projectId":"1579651663909x332548696284125300"},{"contractName":"dappheroSkale","contractAddress":"0x257406C8679a5e0cD6CE3D52052B902B30ac890E","contractAbi":[{"constant":false,"inputs":[],"name":"sendEthNoArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"message","type":"bytes32"}],"name":"sendEthWithArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"sendVariableEthNoArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"message","type":"bytes32"}],"name":"sendVariableEthWithArgs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"triggerEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"EventTrigger","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"}],"name":"ValueSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"message","type":"bytes32"}],"name":"ValueSentWithMessage","type":"event"},{"constant":true,"inputs":[{"name":"from","type":"address"},{"name":"multiplier","type":"uint256"}],"name":"viewMultipleArgsMultipleReturn","outputs":[{"name":"_balanceMultiplied","type":"uint256"},{"name":"_hello","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"},{"name":"multiplier","type":"uint256"}],"name":"viewMultipleArgsSingleReturn","outputs":[{"name":"_balanceMultiplied","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewNoArgsMultipleReturn","outputs":[{"name":"_important","type":"uint256"},{"name":"_hello","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}],"networkId":5,"projectId":"1579651663909x332548696284125300"},{"contractName":"daiOnRopsten","contractAddress":"0xad6d458402f60fd3bd25163575031acdce07538d","contractAbi":[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],"networkId":3,"projectId":"1579651663909x332548696284125300"}]}`)
    // return (
    //   elements.map((element, index) => (<FeatureReducer element={element} configuration={newConfig} index={index} />))
    // )
  }
  return null
}