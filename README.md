# Intro to arco
Arco is a 3 part service that notifies you when a desired transaction is detected on a blockchain. For the purposes of this version of the documentation, we will be only looking at arco in terms of **Algorand**. This project is made up of one MongoDB instance (for the purposes of this hackathon, MongoDB Atlas was used, and there is *no* startup information regarding MongoDB self-hosted), three [expressjs](https://expressjs.com/) servers, and one [CRA](https://create-react-app.dev/) frontend.

Because of the way this project is structured, the backend API and runner are **isolated**, the only common resource being the MongoDB server that serves data to both consumers. This project is also extendable as it runs on webhooks to deliver information, any third-party app may create their own webhook and consumer logic to send notifications on another platform (telegram, slack, twitter, etc...), the provided [example](./example/discord/) is only one instance of how a developer may choose to use arco.

![arco Flowchart](https://gateway.pinata.cloud/ipfs/QmWRorvKoTCk1VNxuG9FCPpe3PCrJ3msAmv2cdgVjs1J6B)

# Running this project
### Pre-requisites
- Node.js installed (+ yarn)
- A Discord developer application (ID only)
- A MongoDB server

### Running
1. ```cd``` into each project root (runner, client, api, example/discord)
2. Replace all the ```sample.env``` files found in runner, example/discord, and api
3. Replace your discord client ID with that found in the "login-tile" component in the client app. Replace the redirect URI as well, to "http%3A%2F%2Flocalhost%3A3000%2Flog-in" if running locally
4. Replace any instance of "147.182.152.192" with "localhost" if running locally
5. Run ```yarn```, then ```yarn dev``` in the current directory (with the exception of client, you may only ```yarn start``` there)
6. Enjoy!


# Limitations & Next Steps
### ./client
- Currently only supports creation/deletion of subscriptions
- Currently only supports simple subscriptions (watching an address for sender / receiver)
  - Backend supports more dynamic logic checks as it uses [jsonlogic](https://jsonlogic.com/) to check if the proper conditions are met
- Discord Oauth2 flow is not secure, arco should migrate away from the [implicit grant](https://discord.com/developers/docs/topics/oauth2#implicit-grant) flow, while also adding a [state verifier](https://discord.com/developers/docs/topics/oauth2#state-and-security) to ensure that the request has not been tampered with

### ./runner
- Currently only supports Algorand (the poller is capable of supporting multiple blockchains at once)
  - This would require changes on the client, api, and consumers
- Currently only conusmes one API source per poller, in the event that [algonode.io](https://algonode.io/api/) went offline, arco would cease to receive new blocks

### ./api
- PUT requests are not suported, they have not been implemented yet
- Lack of authentication creates a risk to subscribers

### ./example/discord
- Lack of comments, README as it is the only standing resource on how to consume the webhook calls coming from arco's runner
- High volume of DMs may result in rate-limits on the bot, another solution not involving private messages should be implemented

# API Reference / MongoDB Document Examples
### API Reference
**POST** /subscriptions:
- Expected body:
```json
  {
    "trigger": {
      "network": "algorand",
      "condition_type": "address",
      "condition_target": "some_address",
      "condition": {
        "or": [
          {
            "==": [
              {
                "var": "sender"
              },
              "some_address"
            ]
          },
          {
            "==": [
              {
                "var": "receiver"
              },
              "some_address"
            ]
          }
        ]
      }
    },
    "webhook": "some_webhook"
  }
```
- Response:
```json
{
    "_id": ObjectId("some_mongo_id")
}
```

**DELETE** /subscriptions:
- Expected URL query: ```?_id=some_id```
- Response: 200
---
### MongoDB Document Examples
- Subscription Document ("subscriptions" collection)
```json
{
  "_id": {
    "$oid": "some_object_id" // auto-assigned
  },
  "trigger": {
    "network": "algorand", // blockchain
    "condition_type": "address", // address currently only supported
    "condition_target": "some_address", // target (an address, contract ID, etc...), adddresses currently only supported
    "condition": { // jsonlogic query
      "or": [
        {
          "==": [
            {
              "var": "sender"
            },
            "some_address"
          ]
        },
        {
          "==": [
            {
              "var": "receiver"
            },
            "some_address"
          ]
        }
      ]
    }
  },
  "webhook": "some_webhook" // webhook url
}
```
- Asset Document:
```json
{
  "_id": {
    "$oid": "some_object_id" // auto-assigned
  },
  "network": "algorand", // blockchain
  "asset_id": some_int, // int
  "name": "D02-31", // unit-name
  "decimals": 0 // decimals
}
```

- Discord User Document:
```json
{
  "_id": {
    "$oid": "some_object_id" // auto-assigned
  },
  "d_id": "some_user" // discord user ID, string of numbers
}
```