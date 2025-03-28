import { mockClient } from 'aws-sdk-client-mock'
import * as ecr from '@aws-sdk/client-ecr'
import * as core from '@actions/core'
import { run } from '../src/run'

jest.mock('@actions/core', () => {
  const original: typeof core = jest.requireActual('@actions/core')
  return {
    ...original,
    setOutput: jest.fn().mockImplementation(original.setOutput),
  }
})
const setOutputMock = core.setOutput as jest.Mock

const mocks = {
  ecr: mockClient(ecr.ECRClient),
}

test('ecr', async () => {
  mocks.ecr.on(ecr.DescribeRepositoriesCommand).resolves({
    repositories: [
      {
        repositoryName: 'foobar',
        repositoryUri: '123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/foobar',
      },
    ],
  })
  mocks.ecr.on(ecr.PutLifecyclePolicyCommand).resolves({
    repositoryName: 'foobar',
  })
  mocks.ecr.on(ecr.SetRepositoryPolicyCommand).resolves({
    repositoryName: 'foobar',
  })
  await run({
    repository: 'foo/bar',
    lifecyclePolicy: `${__dirname}/fixtures/lifecycle-policy.json`,
    repositoryPolicy: `${__dirname}/fixtures/repository-policy.json`,
  })
  expect(setOutputMock).toHaveBeenCalledWith(
    'repository-uri',
    '123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/foobar',
  )
})
