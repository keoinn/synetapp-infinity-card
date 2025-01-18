// 使用 Vite 的 glob 导入功能批量导入图片
const imageModules = import.meta.glob('@/assets/images/*.webp', { eager: true })

// 按照前缀分类图片并排序
const categorizeImages = () => {
  const categories = {
    care: [],
    le: [],
    lj: [],
    ce: [],
    cj: [],
    goal: []
  }

  Object.entries(imageModules).forEach(([path, module]) => {
    const fileName = path.split('/').pop()
    const prefix = fileName.match(/^[a-z]+/)[0]
    if (categories[prefix]) {
      categories[prefix].push({
        path: module.default,
        number: parseInt(fileName.match(/\d+/)[0])
      })
    }
  })

  // 对每个类别进行排序
  Object.keys(categories).forEach(key => {
    categories[key].sort((a, b) => a.number - b.number)
    categories[key] = categories[key].map(item => item.path)
  })

  return categories
}

const {
  care: careImages,
  le: leImages,
  lj: ljImages,
  ce: ceImages,
  cj: cjImages,
  goal: goalImages
} = categorizeImages()

export {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages
}