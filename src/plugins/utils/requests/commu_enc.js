export const JSONAPI_HEADER = {
    'Content-Type': 'application/vnd.api+json'
}
export const jsonapiEnc = (type, id, attr) => {
    return {
        data: {
            type,
            id,
            attributes: {
                ...attr
            }
        }
    }
}