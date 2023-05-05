import { type GetDataPokemon, GetDataPokemonUseCase } from '@/domain/use-cases/api-pokemon'
import { type HttpClient } from '@/domain/contracts/http'
import { httpClientParams, PokemonParams } from '@/tests/mocks'

import { mock } from 'jest-mock-extended'
import { UnexpectedError } from '@/domain/errors'

describe('GetDataPokemonUseCase', () => {
  let sut: GetDataPokemon
  const { url } = httpClientParams
  const { name, abilities, height } = PokemonParams
  const httpClient = mock<HttpClient>()

  beforeAll(() => {
    httpClient.request.mockResolvedValue({ statusCode: 200, data: { name, abilities, height } })
  })

  beforeEach(() => {
    sut = GetDataPokemonUseCase(url, httpClient)
  })

  it('should call HttpClient with correct values', async () => {
    await sut({ name })

    expect(httpClient.request).toHaveBeenCalledWith({ url: `${url}/pokemon/${name}`, method: 'get' })
  })

  it('should throw UnexpectedError if HttpClient return 500', async () => {
    httpClient.request.mockResolvedValueOnce({ statusCode: 500 })

    const promise = sut({ name })

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('should return data pokemon on success', async () => {
    const result = await sut({ name })

    expect(result).toEqual({ name, abilities, height })
  })
})
