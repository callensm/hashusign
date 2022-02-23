import { Program, Provider } from '@project-serum/anchor'
import { type AnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { createContext, type FunctionComponent, useContext, useMemo } from 'react'
import { type Hashusign, IDL } from '../idl'
const { metadata } = require('../idl/hashusign.json')

export const PROGRAM_ID = new PublicKey(metadata.address)

export interface ProgramContextState {
  program: Program<Hashusign>
}

export const ProgramContext = createContext<ProgramContextState>({} as ProgramContextState)

export const ProgramProvider: FunctionComponent = ({ children }) => {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  const anchorWallet = useMemo(
    () => ({
      publicKey,
      signTransaction,
      signAllTransactions
    }),
    [publicKey, signTransaction, signAllTransactions]
  )

  const program = useMemo(() => {
    const provider = new Provider(connection, anchorWallet as AnchorWallet, {})
    return new Program<Hashusign>(IDL, PROGRAM_ID, provider)
  }, [connection, anchorWallet])

  return <ProgramContext.Provider value={{ program }}>{children}</ProgramContext.Provider>
}

/**
 * Custom React hook for the `Program` context state
 * @returns {ProgramContextState}
 */
export const useProgram = (): ProgramContextState => {
  return useContext(ProgramContext)
}
