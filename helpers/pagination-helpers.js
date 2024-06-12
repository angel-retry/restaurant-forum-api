const getOffset = (page = 1, limit = 9) => {
  const offset = (page - 1) * limit
  return offset
}

const getPagination = (page = 1, limit = 9, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    totalPage,
    pages,
    prevPage,
    nextPage
  }
}

module.exports = {
  getOffset,
  getPagination
}
