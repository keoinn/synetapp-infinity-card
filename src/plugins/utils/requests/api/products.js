import requestInstance from '@/plugins/utils/requests/requests.js'

export const uploadExcel = (formData) => {
  const request = requestInstance({
    method: 'POST',
    url: '/import-auction-products',
    data: formData
  })

  return request
}

export const getProducts = () => {
  const request = requestInstance({
    method: 'GET',
    url: '/products'
  })

  return request
}

export const getProduct = (productId) => {
  const request = requestInstance({
    method: 'GET',
    url: `/product/${productId}`
  })

  return request
}

export const saveProduct = (product) => {
  const request = requestInstance({
    method: 'POST',
    url: `/product/update`,
    data: {
      item: product
    }
  })

  return request
}

export const changeOrder = (productId, direction) => {
  const request = requestInstance({
    method: 'POST',
    url: `/products/change-order`,
    data: {
      productId,
      direction
    }
  })

  return request
}

export const uploadImage = (formData) => {
  const request = requestInstance({
    method: 'POST',
    url: `/products/upload-image`,
    data: formData
  })

  return request
}

export const getAuction = () => {
  const request = requestInstance({
    method: 'GET',
    url: '/auction/current'
  })

  return request
}

export const addAuctionPrice = (auctionId) => {
  const request = requestInstance({
    method: 'POST',
    url: `/auction/current/add`,
    data: {
      auctionId
    }
  })

  return request
}

export const setAuctionPrice = (auctionId, price, isForce = false) => {
  const request = requestInstance({
    method: 'POST',
    url: `/auction/current/set`,
    data: {
      auctionId,
      price,
      isForce
    }
  })

  return request
}

export const changeAuction = (direction, page = '') => {
  const request = requestInstance({
    method: 'POST',
    url: `/auction/current/change-item`,
    data: {
      direction,
      page
    }
  })

  return request
}

export const setFinalBidder = (auctionId, bidder_num, isForce = false) => {
  const request = requestInstance({
    method: 'POST',
    url: `/auction/current/set-final-bidder`,
    data: {
      auctionId,
      bidder_num,
      isForce
    }
  })

  return request
}

