/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPhotoOcr = /* GraphQL */ `
  query GetPhotoOcr($id: ID!) {
    getPhotoOCR(id: $id) {
      id
      name
      photo_base64
      ocr_result
    }
  }
`;
export const listPhotoOcRs = /* GraphQL */ `
  query ListPhotoOcRs(
    $filter: ModelPhotoOCRFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotoOCRs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        photo_base64
        ocr_result
      }
      nextToken
    }
  }
`;
