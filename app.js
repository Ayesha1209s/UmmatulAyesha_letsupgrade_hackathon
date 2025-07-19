class MakeYouPrettierApp {
  constructor() {
    // Wait for other scripts to load
    setTimeout(() => {
      this.imageAnalyzer = new window.ImageAnalyzer()
      this.recommendationEngine = new window.RecommendationEngine()
    }, 100)

    this.currentImage = null
    this.currentResults = null

    this.initializeElements()
    this.setupEventListeners()
    this.loadSavedResults()
  }

  initializeElements() {
    // Upload elements
    this.uploadBox = document.getElementById("uploadBox")
    this.uploadBtn = document.getElementById("uploadBtn")
    this.imageInput = document.getElementById("imageInput")
    this.imagePreview = document.getElementById("imagePreview")
    this.previewImg = document.getElementById("previewImg")
    this.analyzeBtn = document.getElementById("analyzeBtn")
    this.changeBtn = document.getElementById("changeBtn")

    // Section elements
    this.loadingSection = document.getElementById("loadingSection")
    this.resultsSection = document.getElementById("resultsSection")

    // Result elements
    this.faceShapeIcon = document.getElementById("faceShapeIcon")
    this.faceShapeResult = document.getElementById("faceShapeResult")
    this.faceShapeDescription = document.getElementById("faceShapeDescription")

    this.bodyShapeIcon = document.getElementById("bodyShapeIcon")
    this.bodyShapeResult = document.getElementById("bodyShapeResult")
    this.bodyShapeDescription = document.getElementById("bodyShapeDescription")

    this.skinToneSwatch = document.getElementById("skinToneSwatch")
    this.skinToneResult = document.getElementById("skinToneResult")
    this.skinToneDescription = document.getElementById("skinToneDescription")

    // Recommendation elements
    this.haircutRecommendations = document.getElementById("haircutRecommendations")
    this.colorRecommendations = document.getElementById("colorRecommendations")
    this.stylingRecommendations = document.getElementById("stylingRecommendations")

    // Action buttons
    this.saveBtn = document.getElementById("saveBtn")
    this.newAnalysisBtn = document.getElementById("newAnalysisBtn")

    console.log("Elements initialized:", {
      uploadBox: !!this.uploadBox,
      uploadBtn: !!this.uploadBtn,
      imageInput: !!this.imageInput,
    })
  }

  setupEventListeners() {
    // Upload area click
    if (this.uploadBox) {
      this.uploadBox.addEventListener("click", (e) => {
        console.log("Upload box clicked")
        if (!this.imagePreview || this.imagePreview.style.display === "none") {
          this.imageInput.click()
        }
      })
    }

    // Upload button click
    if (this.uploadBtn) {
      this.uploadBtn.addEventListener("click", (e) => {
        console.log("Upload button clicked")
        e.stopPropagation()
        this.imageInput.click()
      })
    }

    // File input change
    if (this.imageInput) {
      this.imageInput.addEventListener("change", (e) => {
        console.log("File input changed:", e.target.files)
        if (e.target.files && e.target.files[0]) {
          this.handleFileSelect(e.target.files[0])
        }
      })
    }

    // Drag and drop
    if (this.uploadBox) {
      this.uploadBox.addEventListener("dragover", (e) => {
        e.preventDefault()
        this.uploadBox.style.transform = "scale(1.02)"
        this.uploadBox.style.boxShadow = "0 20px 50px rgba(102, 126, 234, 0.4)"
      })

      this.uploadBox.addEventListener("dragleave", () => {
        this.uploadBox.style.transform = ""
        this.uploadBox.style.boxShadow = ""
      })

      this.uploadBox.addEventListener("drop", (e) => {
        e.preventDefault()
        this.uploadBox.style.transform = ""
        this.uploadBox.style.boxShadow = ""
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
          this.handleFileSelect(file)
        }
      })
    }

    // Analyze button
    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener("click", () => {
        console.log("Analyze button clicked")
        this.analyzeImage()
      })
    }

    // Change photo button
    if (this.changeBtn) {
      this.changeBtn.addEventListener("click", () => {
        this.resetUpload()
      })
    }

    // Action buttons
    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", () => {
        this.saveResults()
      })
    }

    if (this.newAnalysisBtn) {
      this.newAnalysisBtn.addEventListener("click", () => {
        this.resetApp()
      })
    }

    console.log("Event listeners set up")
  }

  handleFileSelect(file) {
    console.log("Handling file:", file)

    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      console.log("File loaded, creating image")
      this.loadImage(e.target.result)
    }
    reader.onerror = (e) => {
      console.error("Error reading file:", e)
      alert("Error reading the image file. Please try again.")
    }
    reader.readAsDataURL(file)
  }

  loadImage(src) {
    console.log("Loading image with src:", src.substring(0, 50) + "...")

    const img = new Image()
    img.onload = () => {
      console.log("Image loaded successfully:", img.width, "x", img.height)
      this.currentImage = img

      if (this.previewImg) {
        this.previewImg.src = src
      }

      // Show image preview
      const uploadContent = this.uploadBox.querySelector(".upload-content")
      if (uploadContent) {
        uploadContent.style.display = "none"
      }

      if (this.imagePreview) {
        this.imagePreview.style.display = "block"
      }

      // Hide results if showing
      if (this.resultsSection) {
        this.resultsSection.style.display = "none"
      }
    }

    img.onerror = (e) => {
      console.error("Error loading image:", e)
      alert("Error loading the image. Please try a different image.")
    }

    img.src = src
  }

  resetUpload() {
    const uploadContent = this.uploadBox.querySelector(".upload-content")
    if (uploadContent) {
      uploadContent.style.display = "block"
    }

    if (this.imagePreview) {
      this.imagePreview.style.display = "none"
    }

    if (this.imageInput) {
      this.imageInput.value = ""
    }

    this.currentImage = null

    if (this.resultsSection) {
      this.resultsSection.style.display = "none"
    }
  }

  async analyzeImage() {
    console.log("Starting analysis...")

    if (!this.currentImage) {
      alert("Please select an image first.")
      return
    }

    if (!this.imageAnalyzer) {
      console.error("ImageAnalyzer not available")
      alert("Analysis system not ready. Please refresh the page and try again.")
      return
    }

    // Show loading
    if (this.loadingSection) {
      this.loadingSection.style.display = "block"
    }

    if (this.analyzeBtn) {
      this.analyzeBtn.disabled = true
      this.analyzeBtn.textContent = "Analyzing..."
    }

    try {
      console.log("Calling imageAnalyzer.analyzeImage...")
      const results = await this.imageAnalyzer.analyzeImage(this.currentImage)
      console.log("Analysis results:", results)

      this.currentResults = results

      // Display results
      this.displayResults(results)

      // Show results section
      if (this.loadingSection) {
        this.loadingSection.style.display = "none"
      }

      if (this.resultsSection) {
        this.resultsSection.style.display = "block"
      }

      // Scroll to results
      setTimeout(() => {
        if (this.resultsSection) {
          this.resultsSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      console.error("Analysis failed:", error)
      alert("Analysis failed. Please try again.")
      if (this.loadingSection) {
        this.loadingSection.style.display = "none"
      }
    } finally {
      if (this.analyzeBtn) {
        this.analyzeBtn.disabled = false
        this.analyzeBtn.textContent = "Analyze Image"
      }
    }
  }

  displayResults(results) {
    console.log("Displaying results:", results)

    const { faceShape, bodyShape, skinTone } = results

    if (!this.recommendationEngine) {
      console.error("RecommendationEngine not available")
      return
    }

    // Get recommendations
    const faceRec = this.recommendationEngine.getFaceShapeRecommendations(faceShape)
    const skinRec = this.recommendationEngine.getSkinToneRecommendations(skinTone.type)
    const bodyRec = this.recommendationEngine.getBodyShapeRecommendations(bodyShape)

    // Display face shape
    if (this.faceShapeIcon) this.faceShapeIcon.textContent = faceRec.icon
    if (this.faceShapeResult) this.faceShapeResult.textContent = faceShape
    if (this.faceShapeDescription) this.faceShapeDescription.textContent = faceRec.description

    // Display body shape
    if (this.bodyShapeIcon) this.bodyShapeIcon.textContent = bodyRec.icon
    if (this.bodyShapeResult) this.bodyShapeResult.textContent = bodyShape
    if (this.bodyShapeDescription) this.bodyShapeDescription.textContent = bodyRec.description

    // Display skin tone
    if (this.skinToneResult) this.skinToneResult.textContent = skinTone.type
    if (this.skinToneDescription) this.skinToneDescription.textContent = skinRec.description
    if (this.skinToneSwatch) {
      this.skinToneSwatch.style.backgroundColor = `rgb(${skinTone.rgb.r}, ${skinTone.rgb.g}, ${skinTone.rgb.b})`
    }

    // Display recommendations
    this.displayHaircutRecommendations(faceRec.haircuts)
    this.displayColorRecommendations(skinRec.colors)
    this.displayStylingRecommendations(bodyRec.tips)
  }

  displayHaircutRecommendations(haircuts) {
    if (!this.haircutRecommendations) return

    const ul = document.createElement("ul")
    haircuts.forEach((cut) => {
      const li = document.createElement("li")
      li.textContent = cut
      ul.appendChild(li)
    })
    this.haircutRecommendations.innerHTML = ""
    this.haircutRecommendations.appendChild(ul)
  }

  displayColorRecommendations(colors) {
    if (!this.colorRecommendations) return

    const div = document.createElement("div")
    div.innerHTML = "<p>Best colors for your skin tone:</p>"

    const palette = document.createElement("div")
    palette.className = "color-palette"

    colors.forEach((colorObj) => {
      const chip = document.createElement("div")
      chip.className = "color-chip"
      chip.style.backgroundColor = colorObj.color
      chip.title = colorObj.name
      chip.textContent = colorObj.name.charAt(0)
      palette.appendChild(chip)
    })

    div.appendChild(palette)
    this.colorRecommendations.innerHTML = ""
    this.colorRecommendations.appendChild(div)
  }

  displayStylingRecommendations(tips) {
    if (!this.stylingRecommendations) return

    const ul = document.createElement("ul")
    tips.forEach((tip) => {
      const li = document.createElement("li")
      li.textContent = tip
      ul.appendChild(li)
    })
    this.stylingRecommendations.innerHTML = ""
    this.stylingRecommendations.appendChild(ul)
  }

  saveResults() {
    if (this.currentResults) {
      const saveData = {
        results: this.currentResults,
        timestamp: new Date().toISOString(),
        imageData: this.previewImg ? this.previewImg.src : null,
      }
      localStorage.setItem("makeYouPrettierResults", JSON.stringify(saveData))

      // Show success message
      if (this.saveBtn) {
        const originalText = this.saveBtn.textContent
        this.saveBtn.textContent = "Saved!"
        this.saveBtn.style.background = "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"

        setTimeout(() => {
          this.saveBtn.textContent = originalText
          this.saveBtn.style.background = ""
        }, 2000)
      }
    }
  }

  loadSavedResults() {
    const savedData = localStorage.getItem("makeYouPrettierResults")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        console.log("Previous results found:", data)
      } catch (error) {
        console.error("Error loading saved results:", error)
      }
    }
  }

  resetApp() {
    // Reset all sections
    if (this.loadingSection) this.loadingSection.style.display = "none"
    if (this.resultsSection) this.resultsSection.style.display = "none"

    // Reset upload
    this.resetUpload()

    // Clear current data
    this.currentResults = null

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing app...")
  new MakeYouPrettierApp()
})
