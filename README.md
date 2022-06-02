# create-ecr-repository-action

This is a GitHub Action to create a repository in Amazon ECR if it does not exist.
It can also set a lifecycle policy for the repository for cost saving.


## Getting Started

To create a repository:

```yaml
jobs:
  build:
    steps:
      - uses: byerobot/create-ecr-repository-action@v1
        with:
          repository: hello-world
```

If the repository exists, this action does nothing.


### Set a lifecycle policy

To create a repository with a lifecycle policy:

```yaml
      - uses: byerobot/create-ecr-repository-action@v1
        with:
          repository: hello-world
          lifecycle-policy: '{ "fake": "policy" }'
```

If the repository exists, this action just sets the lifecycle policy.

### Set a repository policy

To create a repository with a repository policy:

```yaml
      - uses: byerobot/create-ecr-repository-action@v1
        with:
          repository: hello-world
          repository-policy: '{ "fake": "policy" }'
```

If the repository exists, this action just sets the repository policy.


### Full example

Here is a full example to build an image and put it into an ECR repository:

```yaml
jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v2
      - uses: aws-actions/amazon-ecr-login@v1
      - uses: byerobot/create-ecr-repository-action@v1
        id: ecr
        with:
          repository: hello-world
      - run: docker build -t ${{ steps.ecr.outputs.repository-uri }}:latest .
      - run: docker push ${{ steps.ecr.outputs.repository-uri }}:latest
```

Use a release tag such as `v1`.
Do not use `main` branch because it does not contain `dist` files.


## Inputs

| Name                | Default | Description
|---------------------|---------|------------
| `repository`        | (required) | Repository name to create
| `lifecycle-policy`  | - | JSON lifecycle policy for the repository
| `repository-policy` | - | JSON repository policy for the repository


## Outputs

| Name | Description
|------|------------
| `repository-uri` | URI of the repository (in form of `ACCOUNT.dkr.ecr.REGION.amazonaws.com/NAME`)
