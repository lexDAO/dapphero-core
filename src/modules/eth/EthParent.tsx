import React, { FunctionComponent, useState, Fragment } from "react";
import { Request, dappHeroConfig } from "../types";
import { EthStaticView } from "./EthStaticView";
import { EthContractParent } from "./EthContractParent";
import { EthereumContextConsumer } from "../../context/ethereum";
import { EthEnable } from "../eth/EthEnable";

interface EthParentProps {
  request: Request;
  config: dappHeroConfig;
}

export const EthParent: FunctionComponent<EthParentProps> = ({
  request,
  config
}) => {
  return (
    <EthereumContextConsumer>
      {({ connected, accounts, injected }) => {
        switch (
          request.requestString[2] //TODO Be explicit about the index
        ) {
          case "address": //TODO We shouldn't let this just fall through like this (I think) 
          case "getBalance": //TODO we should be explicit about how this works
          case "getProvider": //TODO and maybe we should not need to hard code this but rather build a function which takes from database
          case "getNetworkName":
          case "getNetworkId": {
            if (connected && accounts.length > 0) {
              return (
                <EthStaticView
                  request={request}
                  injected={injected}
                  accounts={accounts}
                />
              );
            }
            break;
          }

          case config.contractName: {
            if (connected && accounts.length > 0) {
              return (
                <EthContractParent
                  request={request}
                  injected={injected}
                  accounts={accounts}
                  config={config}
                />
              );
            }

            break;
          }
          case "enable": {
            return (
              <EthEnable
                request={request}
                injected={injected}
                accounts={accounts}
              />
            );
            break;
          }

          default:
            return null;
        }
      }}
    </EthereumContextConsumer>
  );
};
