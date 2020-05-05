import { useState, useContext, useEffect, useReducer } from 'react'
import { useToasts } from 'react-toast-notifications'
import { logger } from 'logger/customLogger'
import Notify from 'bnc-notify'
import omit from 'lodash.omit'

import * as utils from 'utils'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'

import { useAddInvokeTrigger } from './useAddInvokeTrigger'
import { useAutoInvokeMethod } from './useAutoInvokeMethod'
import { useDisplayResults } from './useDisplayResults'
import { stateReducer, ACTION_TYPES } from './stateMachine'

import { sendTx } from './sendTx'
import { callMethod } from './callMethod'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API
const { AUTO_INVOKE_INTERVAL: POLLING_INTERVAL } = consts.global

// Utils
const notify = (apiKey, chainId) => Notify({ dappId: apiKey, networkId: chainId })

const getAbiMethodInputs = (abi, methodName, dispatch): Record<string, any> => {
  const emptyString = '$true'
  const parseName = (value: string): string => (value === '' ? emptyString : value)

  const method = abi.find(({ name }) => name === methodName)

  if (!method) {
    dispatch({
      type: ACTION_TYPES.malformedInputName,
      status: {
        error: true,
        msg: `The method name: { ${methodName} } is incorrect. Perhaps a typo in your html?`,
      },
    })
    return null
  }

  const parsedMethod = Object.assign(method, { inputs: method.inputs.map((input) => ({ ...input, name: parseName(input.name) })) })

  const output = parsedMethod.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
  return output
}

// Reducer Component
export const Reducer = ({ info, readContract, writeContract, readEnabled, readChainId, writeEnabled }) => {

  const [ state, dispatch ] = useReducer(stateReducer, {})
  // if (!(state.isPolling || !state.msg)) {
  //   console.log('State Change: (omitting polling)', state)
  // }

  const {
    childrenElements,
    properties,
    hasInputs,
    isTransaction,
  } = info

  // TODO Check for Overloaded Functions
  const autoClearKey = properties.find(({ key }) => key === 'autoClear')
  const autoInvokeKey = properties.find(({ key }) => key === 'autoInvoke')
  const methodNameKey = properties.find(({ key }) => key === 'methodName')
  const ethValueKey = properties.find((property) => property.key === 'ethValue')

  let ethValue = ethValueKey?.value
  const { value: methodName } = methodNameKey

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Create a write Provider from the injected ethereum context
  const { provider, isEnabled, chainId, address } = useContext(contexts.EthereumContext)

  // Toast Notifications
  const { addToast } = useToasts()

  // React hooks
  const [ result, setResult ] = useState(null)
  const [ autoInterval, setAutoInterval ] = useState(null)

  // Stop AutoInvoke if the call is not working
  useEffect(() => {
    if (autoInterval && state.error) {
      clearInterval(autoInterval)
      emitToEvent(EVENT_NAMES.contract.statusChange, { value: state.error, step: 'Auto invoke method', status: EVENT_STATUS.rejected })
    }
  }, [ autoInterval, state.error ])

  useEffect(() => {
    const { msg, error, info: stateInfo } = state

    if (error) {
      logger.error(msg, error)
      addToast(msg, { appearance: 'error', autoDismiss: true, autoDismissTimeout: consts.global.REACT_TOAST_AUTODISMISS_INTERVAL })
    }

    if (stateInfo) {
      logger.info(msg, stateInfo)
      addToast(msg, { appearance: 'info', autoDismiss: true, autoDismissTimeout: consts.global.REACT_TOAST_AUTODISMISS_INTERVAL })
    }
  }, [ state.error ])

  // Helpers - Get parameters values
  const getParametersFromInputValues = (): Record<string, any> => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
    const abiMethodInputs = getAbiMethodInputs(info.contract.contractAbi, methodName, dispatch)

    if (!inputChildrens.length ) return { parameterValues: [] }
    const [ inputs ] = inputChildrens

    inputs.element.forEach(({ element, argumentName }) => {
      const rawValue = element.value
      const value = address ? (rawValue.replace(consts.clientSide.currentUser, address) ?? rawValue) : rawValue

      try {
        const displayUnits = element.getAttribute('data-dh-modifier-display-units')
        const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
        const convertedValue = value && (displayUnits || contractUnits) ? utils.convertUnits(displayUnits, contractUnits, value) : value

        if (convertedValue) {
          Object.assign(abiMethodInputs, { [argumentName]: convertedValue })
        }
      } catch (err) {
        dispatch({
          type: ACTION_TYPES.malformedInputs,
          status: {
            error: true,
            fetching: false,
            msg: `There seems to be an error with your inputs? Argument Name: ${argumentName}`,
          },
        })
      }

      // TODO: Check if we need to re-assign the input value (with Drake)
      element.value = value
    })

    if (abiMethodInputs?.EthValue) {
      ethValue = abiMethodInputs?.EthValue
    }

    const parsedParameters = omit(abiMethodInputs, 'EthValue')
    const parametersValues = Object.values(parsedParameters)

    return { parametersValues }
  }

  // Return values to their orignal value when unmounted
  // TODO: Do we want to do this also for all HTML?
  useEffect(() => {
    let rawValues = []

    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
    const getOriginalValues = () => {
      const [ inputs ] = inputChildrens
      rawValues = inputs.element.map(({ element }) => ({ element, rawValue: element.value }))
    }

    if (inputChildrens.length) getOriginalValues()
    return (): void => {
      for (const el of rawValues) {
        el.element.value = el.rawValue
      }
      return null
    }

  }, [])

  // -> Handlers
  const handleRunMethod = async (event = null, shouldClearInput = false, isPolling = false): Promise<void> => {
    if (event) {
      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (err) {}
    }

    // Return early if the read and write instances aren't ready
    // if (!readEnabled && !writeEnabled) return null

    emitToEvent(EVENT_NAMES.contract.statusChange, { value: null, step: 'Getting and parsing parameters.', status: EVENT_STATUS.pending })
    const { parametersValues } = getParametersFromInputValues()
    emitToEvent(EVENT_NAMES.contract.statusChange, { value: parametersValues, step: 'Getting and parsing parameters.', status: EVENT_STATUS.resolved })

    if (hasInputs) {
      const isParametersFilled = Boolean(parametersValues.filter(Boolean).join(''))
      if (!isParametersFilled) {
        dispatch({
          type: ACTION_TYPES.parametersUndefined,
          status: {
            error: false,
            fetching: false,
            msg: `There appear to be no parameters provided.`,
          },
        })
      } // TODO: Add Dispatch for State instead of Console.error
    }

    try {
      let value = '0'
      const methodParams = [ ...(hasInputs ? parametersValues : []) ]

      if (ethValue) {
        value = ethValue
      }

      if (writeEnabled && isTransaction) {
        emitToEvent(EVENT_NAMES.contract.statusChange, { value: null, step: 'Triggering write transaction.', status: EVENT_STATUS.pending })

        const methodHash = await sendTx({
          writeContract,
          provider,
          methodName,
          methodParams,
          value,
          notify: notify(blockNativeApiKey, chainId),
          dispatch,
          emitToEvent,
        })
        setResult(methodHash)

        emitToEvent(EVENT_NAMES.contract.statusChange, { value: methodHash, step: 'Triggering write transaction.', status: EVENT_STATUS.resolved })
      } else if (readEnabled && !isTransaction && !state.error ) {
        emitToEvent(EVENT_NAMES.contract.statusChange, { value: null, step: 'Triggering read transaction.', status: EVENT_STATUS.pending })

        const methodResult = await callMethod({ readContract, methodName, methodParams, dispatch, isPolling })
        setResult(methodResult)

        emitToEvent(EVENT_NAMES.contract.statusChange, { value: methodResult, step: 'Triggering read transaction.', status: EVENT_STATUS.resolved })
      }

      const [ input ] = childrenElements.filter(({ id }) => id.includes('input'))
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }
      const shouldAutoInvoke = autoInvokeValue === 'true'
      const shouldClearAllInputValues = input?.element && !shouldAutoInvoke && shouldClearInput

      if (shouldClearAllInputValues) {
        input.element.forEach(({ element }) => Object.assign(element, { value: '' }))
      }
    } catch (err) {
      emitToEvent(EVENT_NAMES.contract.statusChange, { value: err, step: 'Triggering read/write transaction.', status: EVENT_STATUS.rejected })
      dispatch({
        type: ACTION_TYPES.confirmed,
        status: {
          msg: 'An error has occured when interacting with your contract.',
          error: err,
          fetching: false,
          inFlight: false,
        },
      })
    }
  }

  // Add trigger to invoke buttons
  useAddInvokeTrigger({ info, autoClearKey, handleRunMethod, emitToEvent })

  // Auto invoke method
  useAutoInvokeMethod({
    info,
    autoInvokeKey,
    autoClearKey,
    isTransaction,
    handleRunMethod,
    readEnabled,
    readContract,
    readChainId,
    POLLING_INTERVAL,
    writeAddress: address,
    setAutoInterval,
    emitToEvent,
  })

  // Display new results in the UI
  useDisplayResults({ childrenElements, result, emitToEvent })

  return null
}
