import { iClass, iString, iNumber, iDate, iArray } from '../src/index'

describe('Interfaces Tests', () => {
  const data = {
    id: '1231231',
    size: 10,
    slug: 'ABCDEFG',
    address: {
      street: '123 boober',
      zip: 111111,
      city: 'New York',
      state: 'New York'
    },
    digits: [1, 2, 3, 4],
    homes: [
      {
        street: '123 boober',
        zip: 111111,
        city: 'New York',
        state: 'New York'
      },
      {
        street: '123 boober',
        zip: 111111,
        city: 'New York',
        state: 'New York'
      }
    ],
    created: '2020-03-12T12:47:06.875Z'
  }
  class AddressInterface extends iClass {
    street = iString
    zip = iNumber
    city = iString
    state = iString
  }
  class DataInterface extends iClass {
    id = iNumber
    size = iNumber
    slug = iString
    optional = iDate
    created = iDate
    address = AddressInterface
    digits = iArray(iNumber)
    homes = iArray(AddressInterface)
  }
  const iData = new DataInterface(data)

  it('transforms primatives', () => {
    expect(iData.id).toEqual(1231231)
    expect(iData.size).toEqual(10)
    expect(iData.slug).toEqual('ABCDEFG')
    expect(iData.created.toISOString()).toEqual('2020-03-12T12:47:06.875Z')
    iData.size = '12'
    expect(iData.size).toEqual(12)
  })

  it('creates $diffs', () => {
    expect(iData.$diff).toEqual({ size: 12 })
  })

  it('creates $json', () => {
    expect(iData.$json).toEqual({
      ...data,
      id: 1231231,
      size: 12
      // address: undefined
    })
  })

  it('manages sub-interfaces', () => {
    iData.address.zip = '111112'
    expect(iData.address.zip).toEqual(111112)
    expect(iData.$diff.address.zip).toEqual(111112)
  })

  it('manages arrays', () => {
    iData.digits[4] = '5'
    expect(iData.digits).toEqual([1, 2, 3, 4, 5])
    expect(iData.$diff.digits).toEqual([1, 2, 3, 4, 5])

    iData.digits[4] = '5'

    expect(iData.digits.$diff).toEqual([1, 2, 3, 4, 5])

    iData.digits.push('6')
    expect(iData.digits).toEqual([1, 2, 3, 4, 5, 6])
    expect(iData.$diff.digits).toEqual([1, 2, 3, 4, 5, 6])

    iData.digits.reverse()
    expect(iData.digits).toEqual([6, 5, 4, 3, 2, 1])
    expect(iData.$diff.digits).toEqual([6, 5, 4, 3, 2, 1])
  })

  it('manages arrays of interfaces', () => {
    iData.homes[0].zip = '22222'
    expect(iData.$diff).toEqual({ size: 12,
      address: { zip: 111112 },
      digits: [ 6, 5, 4, 3, 2, 1 ],
      homes: [
        {
          street: '123 boober',
          zip: 22222,
          city: 'New York',
          state: 'New York' },
        {
          street: '123 boober',
          zip: 111111,
          city: 'New York',
          state: 'New York' } ]
    })
  })

  it('test arrays at top level', () => {
    const nums = [1,2,'3',4,5]
    const ArrayNum = iArray(iNumber)
    const iData = new ArrayNum(nums)

    expect(iData[0]).toEqual(1)
    expect(iData[2]).toEqual(3)
    expect(iData.$json).toEqual([1,2,3,4,5])
    iData[0] = '1'
    expect(iData.$json).toEqual([1,2,3,4,5])

  })
})
