import { useQuery } from '@tanstack/react-query'
import { Config, readContract } from '@wagmi/core'
import { sepolia, zora } from 'viem/chains'
import { z } from 'zod'

import { ShowABI } from '../abis'
import { getContractAddresses, wagmiConfig } from '../config'

const HasTicketSchema = z.object({
  wallet: z.string(),
  showId: z.string(),
  chainId: z.union([z.literal(sepolia.id), z.literal(zora.id)])
})

export type HasTicketInput = z.infer<typeof HasTicketSchema>

export const hasTicket = async (input: HasTicketInput) => {
  const { wallet, showId, chainId } = input
  const addresses = getContractAddresses(chainId)

  try {
    return await readContract(wagmiConfig as unknown as Config, {
      address: addresses.Show as `0x${string}`,
      abi: ShowABI,
      functionName: 'hasTicket',
      args: [wallet, showId],
      chainId
    })
  } catch (error) {
    console.error('Error checking ticket ownership:', error)
    throw new Error('Failed to check ticket ownership')
  }
}

export const useHasTicket = (input: HasTicketInput) => {
  return useQuery({
    queryKey: ['hasTicket', input.wallet, input.showId],
    queryFn: () => hasTicket(input),
    enabled: !!input.wallet && !!input.showId
  })
}
