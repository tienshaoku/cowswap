import { Dispatch, SetStateAction, useEffect } from 'react'

import { HookDappBase, HookDappType, HookDappWalletCompatibility } from '@cowprotocol/hook-dapp-lib'
import { useWalletInfo } from '@cowprotocol/wallet'

import { HookDappIframe } from '../../../types/hooks'
import { validateHookDappManifest } from '../../../validateHookDappManifest'

interface ExternalDappLoaderProps {
  input: string
  isPreHook: boolean
  walletType: HookDappWalletCompatibility
  setDappInfo: Dispatch<SetStateAction<HookDappIframe | null>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setManifestError: Dispatch<SetStateAction<string | React.ReactNode | null>>
}

export function ExternalDappLoader({
  input,
  setLoading,
  setManifestError,
  setDappInfo,
  walletType,
  isPreHook,
}: ExternalDappLoaderProps) {
  const { chainId } = useWalletInfo()

  useEffect(() => {
    let isRequestRelevant = true

    setLoading(true)

    fetch(`${input}/manifest.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!isRequestRelevant) return

        const dapp = data.cow_hook_dapp as HookDappBase

        const validationError = validateHookDappManifest(
          data.cow_hook_dapp as HookDappBase,
          chainId,
          isPreHook,
          walletType === HookDappWalletCompatibility.SMART_CONTRACT,
        )

        if (validationError) {
          setManifestError(validationError)
        } else {
          setManifestError(null)
          setDappInfo({
            ...dapp,
            type: HookDappType.IFRAME,
            url: input,
          })
        }
      })
      .catch((error) => {
        if (!isRequestRelevant) return

        console.error(error)
        setManifestError('Can not fetch the manifest.json')
      })
      .finally(() => {
        if (!isRequestRelevant) return

        setLoading(false)
      })

    return () => {
      isRequestRelevant = false
    }
  }, [input, walletType, chainId, isPreHook, setDappInfo, setLoading, setManifestError])

  return null
}
