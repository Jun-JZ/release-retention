## To test

1. run `yarn install` to install dependencies at root directory.
2. run `yarn start [n]` to start processing, which **n** is the number of releases you want to keep.
3. run `yarn test` to run unit test.

## Folder Structure

```
├── README.md
├── input   -- given input of Projects, Environments, Deployments, Releases
│   ├── Deployments.json
│   ├── Environments.json
│   ├── Projects.json
│   └── Releases.json
├── output
│   ├── RetainedRelease.json  -- generated retained n release for each project/environment combination
│   └── verboseLog.log  -- verbose log, eg: `Release-1` kept because it was the most recently deployed to `Environment-1`
├── mockData  -- mock data for unit test consuming
│   ├── Deployments.json
│   ├── Environments.json
│   ├── Projects.json
│   └── Releases.json
├── src
│   ├── core.test.ts
│   ├── core.ts
│   └── index.ts
```
