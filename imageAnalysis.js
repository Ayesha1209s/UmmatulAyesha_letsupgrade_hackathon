class ImageAnalyzer {
  constructor() {
    this.canvas = document.getElementById("analysisCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.imageData = null
  }

  setupCanvas(image) {
    // Set canvas size to match image aspect ratio
    const maxWidth = 600
    const maxHeight = 500
    let { width, height } = image

    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    this.canvas.width = width
    this.canvas.height = height

    this.ctx.drawImage(image, 0, 0, width, height)
    this.imageData = this.ctx.getImageData(0, 0, width, height)

    return { width, height }
  }

  // Face shape analysis based on aspect ratios
  analyzeFaceShape() {
    const { width, height } = this.canvas

    // Simulate face detection by analyzing the upper 2/3 of the image
    const faceTop = Math.floor(height * 0.15)
    const faceBottom = Math.floor(height * 0.75)
    const faceLeft = Math.floor(width * 0.25)
    const faceRight = Math.floor(width * 0.75)

    const faceLength = faceBottom - faceTop
    const faceWidth = faceRight - faceLeft

    // Calculate ratios
    const lengthToWidthRatio = faceLength / faceWidth

    // Simulate jaw and forehead measurements
    const jawWidth = faceWidth * 0.85
    const foreheadWidth = faceWidth * 0.9

    // Classify face shape based on ratios
    if (lengthToWidthRatio >= 1.0 && lengthToWidthRatio <= 1.1) {
      return "Round"
    } else if (lengthToWidthRatio >= 1.3 && lengthToWidthRatio <= 1.5) {
      return "Oval"
    } else if (lengthToWidthRatio >= 1.0 && lengthToWidthRatio <= 1.2 && jawWidth / foreheadWidth > 0.9) {
      return "Square"
    } else if (foreheadWidth > faceWidth && jawWidth < faceWidth * 0.7) {
      return "Heart"
    } else if (faceWidth > foreheadWidth && faceWidth > jawWidth) {
      return "Diamond"
    } else {
      return "Oval" // Default fallback
    }
  }

  // Body shape analysis based on silhouette
  analyzeBodyShape() {
    const { width, height } = this.canvas

    // Analyze different sections of the body
    const shoulderY = Math.floor(height * 0.25)
    const waistY = Math.floor(height * 0.5)
    const hipY = Math.floor(height * 0.7)

    // Simulate measurements by finding the widest points at each level
    const shoulderWidth = this.measureWidthAtLevel(shoulderY)
    const waistWidth = this.measureWidthAtLevel(waistY)
    const hipWidth = this.measureWidthAtLevel(hipY)

    // Calculate ratios
    const waistToShoulderRatio = waistWidth / shoulderWidth
    const hipToShoulderRatio = hipWidth / shoulderWidth

    // Classify body shape
    if (Math.abs(shoulderWidth - hipWidth) <= shoulderWidth * 0.05 && waistToShoulderRatio < 0.75) {
      return "Hourglass"
    } else if (hipToShoulderRatio > 1.05) {
      return "Pear"
    } else if (shoulderWidth >= hipWidth && waistToShoulderRatio > 0.85) {
      return "Apple"
    } else {
      return "Rectangle"
    }
  }

  measureWidthAtLevel(y) {
    const { width } = this.canvas
    let leftBound = 0
    let rightBound = width - 1

    // Find the leftmost and rightmost non-background pixels
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4
      const r = this.imageData.data[pixelIndex]
      const g = this.imageData.data[pixelIndex + 1]
      const b = this.imageData.data[pixelIndex + 2]

      // Simple background detection (assuming light background)
      if (r < 240 || g < 240 || b < 240) {
        leftBound = x
        break
      }
    }

    for (let x = width - 1; x >= 0; x--) {
      const pixelIndex = (y * width + x) * 4
      const r = this.imageData.data[pixelIndex]
      const g = this.imageData.data[pixelIndex + 1]
      const b = this.imageData.data[pixelIndex + 2]

      if (r < 240 || g < 240 || b < 240) {
        rightBound = x
        break
      }
    }

    return rightBound - leftBound
  }

  // Skin tone analysis using color sampling
  analyzeSkinTone() {
    const { width, height } = this.canvas

    // Sample skin tone from face area (center region)
    const sampleRegions = [
      { x: width * 0.4, y: height * 0.3, w: width * 0.2, h: height * 0.1 }, // Forehead
      { x: width * 0.35, y: height * 0.45, w: width * 0.3, h: height * 0.1 }, // Cheeks
      { x: width * 0.42, y: height * 0.55, w: width * 0.16, h: height * 0.08 }, // Nose area
    ]

    let totalR = 0,
      totalG = 0,
      totalB = 0,
      sampleCount = 0

    sampleRegions.forEach((region) => {
      for (let y = region.y; y < region.y + region.h && y < height; y++) {
        for (let x = region.x; x < region.x + region.w && x < width; x++) {
          const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4
          totalR += this.imageData.data[pixelIndex]
          totalG += this.imageData.data[pixelIndex + 1]
          totalB += this.imageData.data[pixelIndex + 2]
          sampleCount++
        }
      }
    })

    if (sampleCount === 0) return { type: "Medium", rgb: { r: 200, g: 150, b: 120 } }

    const avgR = Math.round(totalR / sampleCount)
    const avgG = Math.round(totalG / sampleCount)
    const avgB = Math.round(totalB / sampleCount)

    // Convert RGB to HSV
    const hsv = this.rgbToHsv(avgR, avgG, avgB)
    const { h, s, v } = hsv

    // Classify skin tone
    let skinTone = "Medium"
    if (v > 75 && s < 30) {
      skinTone = "Fair"
    } else if (v >= 50 && v <= 75 && s >= 30 && s <= 50 && h >= 20 && h <= 40) {
      skinTone = "Medium"
    } else if (v >= 40 && v <= 60 && s >= 30 && s <= 50 && h >= 25 && h <= 45) {
      skinTone = "Tan"
    } else if (v < 40 && s > 30) {
      skinTone = "Deep"
    }

    return {
      type: skinTone,
      rgb: { r: avgR, g: avgG, b: avgB },
    }
  }

  rgbToHsv(r, g, b) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0
    if (diff !== 0) {
      if (max === r) {
        h = ((g - b) / diff) % 6
      } else if (max === g) {
        h = (b - r) / diff + 2
      } else {
        h = (r - g) / diff + 4
      }
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360

    const s = max === 0 ? 0 : Math.round((diff / max) * 100)
    const v = Math.round(max * 100)

    return { h, s, v }
  }

  async analyzeImage(image) {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        this.setupCanvas(image)

        const faceShape = this.analyzeFaceShape()
        const bodyShape = this.analyzeBodyShape()
        const skinTone = this.analyzeSkinTone()

        resolve({
          faceShape,
          bodyShape,
          skinTone,
        })
      }, 2000)
    })
  }
}

// Make ImageAnalyzer available globally
window.ImageAnalyzer = ImageAnalyzer
