# ether-eye
A simple web service which can watch Ethereum addresses and exposes an API for fetching transaction and balance information

## Installation and setup
Clone the repo and then `cd` into the directory and install dependencies
  ```bash
  yarn install
  ```
  OR
  ```bash
  npm install
  ```

Before running the server, you will need to be running a mongodb instance locally. If you have homebrew installed, you can install mongodb with
  ```bash
  brew update
  brew install mongodb
  ```
And then follow the instructions at the end of the brew installation to get `mongod` running on your machine. If you have trouble, try following the directions at this link:  https://treehouse.github.io/installation-guides/mac/mongo-mac.html

## APIs
By default, the server listens for requests on port `3000`, which can be modified using the `PORT` environment variable or by modifying the `config.js` file in the project root. This service exposes 4 primary RESTful APIs which support the JSON data format.

### Create a new Address (to observe)
`POST /addresses`

Request Parameters:
  ```javascript
  {
    address: <required>
  }
  ```

Success Response:
  ```javascript
  Status: 201
  {
    "address": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
    "status": "PENDING",
    "createdAt": "2018-03-15T08:11:43.219Z",
    "updatedAt": "2018-03-15T08:11:43.219Z"
  }
  ```
Notes:
  The Address record will initially be marked with a `PENDING` status, which indicates that the record has been successfully created but that the rest of the transaction and balance data is still being populated. You can use the `show` endpoint to check that status of an Address at any point, and valid statuses are `PENDING`, `OK`, and `FAILED`. Transactions may only be queried once the Address is in an `OK` state.

### Show a known Address
`GET /addresses/:address`

Parameters: None

Success Response:
  ```javascript
  {
    "address": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
    "status": "OK",
    "ethBalance": 0,
    "createdAt": "2018-03-15T08:11:43.219Z",
    "updatedAt": "2018-03-15T08:11:43.219Z"
  }
  ```

Notes:
  The `ethBalance` field will only be present once the record is in an `OK` status

### Show transactions associated with an Address
`GET /addresses/:address/transactions`

Query Parameters:
  ```
  fromAddress:  'from' address in the transaction                       | default null
  toAddress:    'to' address in the transaction                         | default null
  startBlock:   blockNumber to start including results from (inclusive) | default 1
  endBlock:     blockNumber to stop including results from (inclusive)  | default null
  limit:        maximum number of transactions to return                | default 100
 ```

Success Response:
  ```javascript
  {
    "address": {
      "address": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
      "status": "OK",
      "ethBalance": 0,
      "createdAt": "2018-03-15T08:11:43.219Z",
      "updatedAt": "2018-03-15T08:11:43.219Z"
    },
    "transactions": [
      {
        "blockNumber": 4728500,
        "timeStamp": "1513214607",
        "hash": "0x0981b108eff5153f2d54a485abd8755a261d872f8d4a681aedb4dd17cb92e0ae",
        "nonce": "7",
        "blockHash": "0xed39aa8ab34ccef8fd9fcaeee3815783e3c4c473212b79db2d034d6134029a42",
        "transactionIndex": "1",
        "from": "0x342dbec73f9bb0de8c11bc9ed0953392f9faf4c8",
        "to": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
        "value": "0",
        "gas": "4700000",
        "gasPrice": "80000000000",
        "isError": "0",
        "txreceipt_status": "1",
        "input": "0x3cebb823000000000000000000000000f869e807a6a6f5bacfb0ab21d167e2b41a96be04",
        "contractAddress": "",
        "cumulativeGasUsed": "49525",
        "gasUsed": "28525",
        "confirmations": "530055"
      },
      {
        "blockNumber": 4728890,
        "timeStamp": "1513220376",
        "hash": "0xe1fc059c4ce0082a7fbd8dbb1d3253d19d29d419300539001d4833cfd54260dc",
        "nonce": "0",
        "blockHash": "0x04f28835c4107ebec777d57f7e06fead4d97fe70148b354ad70189c7f40f88b5",
        "transactionIndex": "182",
        "from": "0x03e130eafab61ca4d31923b4043db497a830d2bd",
        "to": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
        "value": "0",
        "gas": "1000000",
        "gasPrice": "50000000000",
        "isError": "0",
        "txreceipt_status": "1",
        "input": "0xa9059cbb00000000000000000000000071d2032b6e1452088b34e149b16e51d66c6692370000000000000000000000000000000000000000000211654585005212800000",
        "contractAddress": "",
        "cumulativeGasUsed": "4741913",
        "gasUsed": "53159",
        "confirmations": "529665"
      }
    ]
  }
  ```

  Notes:
  Transactions will not be included in the response until/unless the Address status is `OK`

### List all known Addresses
`GET /addresses`

Parameters:
  ```
  limit:  maximum number of records to return   | default 100
  ```

Success Response:
  ```javascript
  [
    {
        "address": "0x6522d3bcab33139a72ba63f3273575f261ec61b2",
        "status": "OK",
        "ethBalance": 0.005497572578268401,
        "createdAt": "2018-03-15T06:34:10.019Z",
        "updatedAt": "2018-03-15T06:34:10.019Z"
    },
    {
        "address": "0xdd1ace2f45962e4c1297c784009478865e3b13be",
        "status": "OK",
        "ethBalance": 908.4513675947345,
        "createdAt": "2018-03-15T06:34:47.738Z",
        "updatedAt": "2018-03-15T06:34:47.738Z"
    }
  ]
  ```

## Notes to the viewer
As Blaise Pascal once said:
> I would have written a shorter letter, but I did not have the time.

This app was built fairly quickly over the course of a day, and as such, I didn't have as much time to polish, refactor, test, and otherwise make the code better. For your enjoyment, here is a list of things that I would like to get to if I had more time:
 * Add API call for refreshing transaction and balance data for an Address
 * Better handling of API Errors, preferably with custom Error classes
 * More tests. Way more tests.
 * More formalized approach to asyncronous processing during/after a request
 * Fetching of ERC-20 token balances
