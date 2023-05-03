import { Home } from '@/application/pages/home/home'
import { PokemonParams } from '@/tests/mocks'

import React from 'react'
import { render, waitFor } from '@testing-library/react'

describe('Home', () => {
  const listPokemons: jest.Mock = jest.fn()
  type SutTypes = { container: HTMLElement }

  const makeSut = (): SutTypes => {
    const { container } = render(<Home listPokemons={listPokemons}/>)
    return { container }
  }

  beforeAll(() => {
    listPokemons.mockResolvedValue({ count: 1, pokemons: [PokemonParams, { ...PokemonParams, id: '1' }, { ...PokemonParams, id: '2' }] })
  })

  it('should load with correct initial state', async () => {
    const { container } = makeSut()

    expect(container.querySelectorAll('.emptyCardPokemon')).toHaveLength(8)
    await waitFor(() => container.querySelector('.listPokemons'))
  })

  it('should call ListPokemons', async () => {
    const { container } = makeSut()
    await waitFor(() => container.querySelector('.listPokemons'))

    expect(listPokemons).toHaveBeenCalledWith({ page: 0, perPage: 25 })
    expect(listPokemons).toHaveBeenCalledTimes(1)
  })

  test('Should render CardPokemon on success', async () => {
    const { container } = makeSut()
    await waitFor(() => container.querySelector('.listPokemons'))

    expect(container.querySelectorAll('.cardPokemon')).toHaveLength(3)
    expect(container.querySelectorAll('.emptyCardPokemon')).toHaveLength(0)
  })
})
