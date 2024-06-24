import { useQuery } from '@tanstack/react-query'
import { Config, readContract } from '@wagmi/core'
import { sepolia, zora } from 'viem/chains'
import { z } from 'zod'

import { ShowABI } from '../abis'
import { getContractAddresses, wagmiConfig } from '../config'

const GetShowToVenueProxySchema = z.object({
  showId: z.string(),
  chainId: z.union([z.literal(sepolia.id), z.literal(zora.id)])
})

export type GetShowToVenueProxyInput = z.infer<typeof GetShowToVenueProxySchema>

export const getShowToVenueProxy = async (input: GetShowToVenueProxyInput) => {
  const { showId, chainId } = input
  const addresses = getContractAddresses(chainId)

  try {
    return await readContract(wagmiConfig as unknown as Config, {
      address: addresses.Show as `0x${string}`,
      abi: ShowABI,
      functionName: 'getShowToVenueProxy',
      args: [showId],
      chainId
    })
  } catch (error) {
    console.error('Error reading venue proxy:', error)
    throw new Error('Failed to fetch venue proxy')
  }
}

export const useGetShowToVenueProxy = (input: GetShowToVenueProxyInput) => {
  return useQuery({
    queryKey: ['getShowToVenueProxy', input.showId],
    queryFn: () => getShowToVenueProxy(input),
    enabled: !!input.showId
  })
}
