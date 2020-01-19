import { logger } from 'logger/logger'
import { useEffect, FunctionComponent } from 'react'
import { Request } from '../../types/types'

interface EthEnableProps {
  request: Request;
  injected: {[key: string]: any}; // come back to type
  accounts: string[]; // come back to type
}
/**
 * This function attaches a click handler to any element that a user wants to be responsbile for
 * "enabling metamask".
 * @param props From props we use only injected and request.
 */
export const EthEnable: FunctionComponent<EthEnableProps> = (props) => {
  const { injected, request } = props

  //TODO: [DEV-95] Be sure that we don't crash if there is no injected provider
  const web3Enable = async () => {
    await request.injected.requestAuth()
  }

  useEffect(() => {
    try {
      const el = document.getElementById(request.element.id)
      el.addEventListener('click', web3Enable, false)
    } catch (e) {
      console.log(e)
    }
  }, [ props ])
  return null
}

