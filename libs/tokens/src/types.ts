import { SupportedChainId } from '@cowprotocol/cow-sdk'
import { TokenInfo } from '@cowprotocol/types'
import type { TokenList as UniTokenList } from '@uniswap/token-lists'

export enum TokenListCategory {
  ERC20 = 'ERC20',
  LP = 'LP',
  COW_AMM_LP = 'COW_AMM_LP',
}

export type ListSourceConfig = {
  widgetAppCode?: string
  priority?: number
  enabledByDefault?: boolean
  category?: TokenListCategory
  source: string
}

export type ListsSourcesByNetwork = Record<SupportedChainId, Array<ListSourceConfig>>

export type TokensMap = { [address: string]: TokenInfo }

export type UnsupportedTokensState = { [tokenAddress: string]: { dateAdded: number } }

export type ListsEnabledState = { [listId: string]: boolean | undefined }

export interface ListState extends Pick<ListSourceConfig, 'source' | 'priority' | 'widgetAppCode' | 'category'>{
  list: UniTokenList
  isEnabled?: boolean
}

export type TokenListsState = { [source: string]: ListState }

export type TokenListsByChainState = Record<SupportedChainId, TokenListsState | undefined>
