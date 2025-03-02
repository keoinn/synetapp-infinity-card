import requestInstance from '@/plugins/utils/requests/requests.js'

export const getParticipants = () => {
  const request = requestInstance({
    method: 'GET',
    url: '/participants'
  })

  return request
}

export const getParticipant = (item_id) => {
  const request = requestInstance({
    method: 'GET',
    url: `/participant/${item_id}`
  })

  return request
}

export const uploadImage = (formData) => {
  const request = requestInstance({
    method: 'POST',
    url: '/participant/upload-image',
    data: formData
  })

  return request
}

export const saveParticipant = (participant) => {
  const request = requestInstance({
    method: 'POST',
    url: `/participant/update`,
    data: {
      item: participant
    }
  })

  return request
}
