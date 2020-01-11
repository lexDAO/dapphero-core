import React, { useEffect, useState, FunctionComponent, useMemo } from 'react'; //eslint-disable-line
import $ from 'jquery'
import { EthContractProps, FunctionTypes } from '../types'
import {
  getTriggerElement,
  getUserLoadedElements,
  addClickHandlerToTriggerElement,
  sendTransactionWrapper,
  getUserCustomTxStateNotification
} from './utils'
import { HTMLContextConsumer } from '../../context/html'

type EthContractSendTxProps = EthContractProps & {
  // any more?
};
// 0x885583955F14970CbC0046B91297e9915f4DE6E4 //test addr
export const EthContractSendTx: FunctionComponent<EthContractSendTxProps> = ({
  instance,
  method,
  request,
  injected,
  element,
  signifiers
}: EthContractSendTxProps) => {
  const defaultState = {
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null
  }
  const [ txState, setTxState ] = useState(defaultState)

  const position = request.requestString.indexOf(method.name)

  const { txProcessingElement, txConfirmedElement } = getUserLoadedElements()

  useEffect(() => {
    getUserCustomTxStateNotification(
      txState,
      setTxState,
      defaultState,
      txProcessingElement,
      txConfirmedElement,
      element
    )
  }, [ txState ])

  return (
    <HTMLContextConsumer>
      {({ requests }) => {
        const { signature } = method

        // This will send the transaction and clear the input fields.
        const sendTransaction = () => {
          sendTransactionWrapper(
            requests,
            position,
            method,
            injected,
            instance,
            signature,
            setTxState,
            signifiers
          )
        }

        const triggerElement = getTriggerElement(
          requests,
          method.name,
          position
        )

        addClickHandlerToTriggerElement(triggerElement, sendTransaction)

        return null
      }}
    </HTMLContextConsumer>
  )
}
