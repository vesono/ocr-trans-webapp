/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPhotoOcr = /* GraphQL */ `
  mutation CreatePhotoOcr(
    $input: CreatePhotoOCRInput!
    $condition: ModelPhotoOCRConditionInput
  ) {
    createPhotoOCR(input: $input, condition: $condition) {
      id
      name
      photo_base64
      ocr_result
    }
  }
`;
export const updatePhotoOcr = /* GraphQL */ `
  mutation UpdatePhotoOcr(
    $input: UpdatePhotoOCRInput!
    $condition: ModelPhotoOCRConditionInput
  ) {
    updatePhotoOCR(input: $input, condition: $condition) {
      id
      name
      photo_base64
      ocr_result
    }
  }
`;
export const deletePhotoOcr = /* GraphQL */ `
  mutation DeletePhotoOcr(
    $input: DeletePhotoOCRInput!
    $condition: ModelPhotoOCRConditionInput
  ) {
    deletePhotoOCR(input: $input, condition: $condition) {
      id
      name
      photo_base64
      ocr_result
    }
  }
`;
