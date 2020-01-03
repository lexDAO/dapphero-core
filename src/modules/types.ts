export interface Request {
  requestString: string[];
  element: HTMLElement;
  arg: string;
  index: number;
}

export interface Network {
  networkId?: number;
  address?: string;
  abi?: {[key: string]: any};
}

export interface DappHeroConfig {
  contractName?: string,
  network?: Network;
};

export type EthContractProps = {
  method: any; // add type
  element: HTMLElement;
  request: Request;
  injected: { [key: string]: any };
  instance: any; // build this type
}