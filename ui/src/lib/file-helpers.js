import gql from 'graphql-tag'

export function makeFile (blob) {
  return new window.File([blob], 'avatar', { type: blob.type })
}

const mutation = gql`
  mutation uploadFile($file: Upload!, $size: Int!, $encrypt: Boolean) {
    uploadFile(file: $file, size: $size, encrypt: $encrypt) {
      type
      blobId
      mimeType
      uri
      size

      ...on BlobScuttlebutt {
        unbox
      }

      ...on BlobHyper {
        driveAddress
        readKey
      }
    }
  }
`

export function uploadFile (input) {
  console.log(input)
  return {
    mutation,
    variables: {
      file: input.file,
      size: input.file.size,
      encrypt: input.encrypt
    }
  }
}
export const password = '$2a$10$T3MsOGhHz8Jgnij2LVghUe/.enThRbOnHd2iR7EN4mJup6CHPikAq'
