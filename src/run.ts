import * as core from '@actions/core'
import { runForECR } from './ecr'

interface Inputs {
  repository: string
  lifecyclePolicy: string
  repositoryPolicy: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  const outputs = await runForECR({
    repository: inputs.repository,
    lifecyclePolicy: inputs.lifecyclePolicy !== '' ? inputs.lifecyclePolicy : undefined,
    repositoryPolicy: inputs.repositoryPolicy !== '' ? inputs.repositoryPolicy : undefined,
  })
  core.setOutput('repository-uri', outputs.repositoryUri)
  return
}
