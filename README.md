# InterfaceJS

A quick and easy (I hope) way of two way sanatization for REST APIs in JS.

## Features
- Automatic deserialization
- Automatic serialization
- Automatic Type Coercion
- Change detection
- Change Diff


## Type Definition
```js
  import { Interface, iArray, iNumber, iString, iDate } from 'InterfaceJS'

  class AddressInterface extends Interface {
    definition () {
      return {
        street: iString, // defining primatives
        zip: iNumber,
        city: iString,
        state: iString
      }
    }
  }

  class DataInterface extends Interface {
    definition () {
      return {
        id: iNumber,
        size: iNumber,
        slug: iString,
        optional: iDate,
        created: iDate,
        address: AddressInterface, // child objects are interfaces
        digits: iArray(iNumber), // use the array generator to create lists
        homes: iArray(AddressInterface)
      }
    }
  }
```

## Parsing Incoming Data
first we need to grab some data from a REST API
```js
let response = await fetch('/api/data')
console.log(response.json())
> {
>   id: '1231231',
>   size: 10,
>   slug: 'ABCDEFG',
>   address: {
>     street: '123 boober',
>     zip: 111111,
>     city: 'New York',
>     state: 'New York'
>   },
>   digits: [1, 2, 3, 4],
>   homes: [
>     {
>       street: '123 boober',
>       zip: 111111,
>       city: 'New York',
>       state: 'New York'
>     }
>   ],
>   created: '2020-03-12T12:47:06.875Z'
> }
```
Now we create a new instance of the interface
```js
let data = new DataInterface(response.json())
console.log(data)
> {
>   id: 1231231, // fixed number type
>   size: 10,
>   slug: 'ABCDEFG',
>   address: {
>     street: '123 boober',
>     zip: 111111,
>     city: 'New York',
>     state: 'New York'
>   },
>   digits: [1, 2, 3, 4],
>   homes: [
>     {
>       street: '123 boober',
>       zip: 111111,
>       city: 'New York',
>       state: 'New York'
>     }
>   ],
>   created: 'Thu Mar 12 2020 14:47:06 GMT+0200 (Israel Standard Time)' // Date() object 
> }
```

## Updating values
Updating the object is easy.  Just use it as if it were a regular fully parsed hash table.

Note: Type coercion is automatic when a compatible but incorrect data type is used.
```js
data.id = '3'
data.address.city = 'Albany'
data.homes[0].city = 'Albany'
```
## Change detection
You can use the **$diff** property to get the current list of changed fields, very usefull for a PATCH to the server, or form handling.  

Notice: any change under an iArray will result in the entire contents of the array being emitted as a diff. This is because arrays are order dependent and there is no consistent way to define array diffs in JSON
```js
console.log(data.$diff)
{
    id: 3,
    address: {
        city: 'Albany'
    },
    homes: [
        {
            street: '123 boober',
            zip: 111111,
            city: 'Albany',
            state: 'New York'
        }
    ]
}
```
## Serialize
```js
console.log(data.$json)
> {
>   id: 1231231, // fixed number type
>   size: 10,
>   slug: 'ABCDEFG',
>   address: {
>     street: '123 boober',
>     zip: 111111,
>     city: 'New York',
>     state: 'New York'
>   },
>   digits: [1, 2, 3, 4],
>   homes: [
>     {
>       street: '123 boober',
>       zip: 111111,
>       city: 'New York',
>       state: 'New York'
>     }
>   ],
>   created: '2020-03-12T12:47:06.875Z' // back to the original ISO date format 
> }
```