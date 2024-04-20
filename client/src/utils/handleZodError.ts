import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ZodIssue } from 'zod'

const handleZodError = <T extends FieldValues>(
  issues: ZodIssue[],
  setError: UseFormSetError<T>
) => {
  issues.forEach((issue) => {
    issue.path.forEach((p) =>
      setError(p as Path<T>, {
        type: 'server',
        message: issue.message,
      })
    )
  })
}

export default handleZodError
