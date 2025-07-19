class RecommendationEngine {
  constructor() {
    this.recommendations = {
      faceShape: {
        Round: {
          description: "Soft, curved features with similar width and length",
          icon: "⭕",
          haircuts: [
            "Long layers to elongate the face",
            "Side-swept bangs",
            "Asymmetrical cuts",
            "Avoid chin-length cuts",
            "Try shoulder-length or longer styles",
          ],
        },
        Oval: {
          description: "Balanced proportions, slightly longer than wide",
          icon: "🥚",
          haircuts: [
            "Almost all styles work well",
            "Shoulder-length waves",
            "Blunt cuts",
            "Bangs of any style",
            "Both short and long styles",
          ],
        },
        Square: {
          description: "Strong jawline with similar width and length",
          icon: "⬜",
          haircuts: [
            "Soft layers to soften angles",
            "Side parts",
            "Waves and curls",
            "Long, side-swept bangs",
            "Avoid blunt cuts at jaw level",
          ],
        },
        Heart: {
          description: "Wider forehead, narrow chin",
          icon: "💖",
          haircuts: [
            "Chin-length bobs",
            "Side-swept bangs",
            "Layers that add width at chin",
            "Avoid very short styles on top",
            "Soft, wispy styles",
          ],
        },
        Diamond: {
          description: "Widest at cheekbones, narrow forehead and jaw",
          icon: "💎",
          haircuts: [
            "Medium-length cuts",
            "Volume at chin level",
            "Side parts",
            "Soft layers",
            "Avoid very short or very long styles",
          ],
        },
      },
      skinTone: {
        Fair: {
          description: "Light complexion with cool or neutral undertones",
          colors: [
            { name: "Soft Pink", color: "#FFB6C1" },
            { name: "Sky Blue", color: "#87CEEB" },
            { name: "Lavender", color: "#E6E6FA" },
            { name: "Mint Green", color: "#98FB98" },
            { name: "Peach", color: "#FFCBA4" },
          ],
        },
        Medium: {
          description: "Warm undertones with golden or olive hues",
          colors: [
            { name: "Coral", color: "#FF7F50" },
            { name: "Teal", color: "#008080" },
            { name: "Mustard", color: "#FFDB58" },
            { name: "Olive Green", color: "#808000" },
            { name: "Warm Brown", color: "#A0522D" },
          ],
        },
        Tan: {
          description: "Rich, warm complexion",
          colors: [
            { name: "Royal Blue", color: "#4169E1" },
            { name: "Orange", color: "#FFA500" },
            { name: "Turquoise", color: "#40E0D0" },
            { name: "Hot Pink", color: "#FF69B4" },
            { name: "Golden Yellow", color: "#FFD700" },
          ],
        },
        Deep: {
          description: "Rich, deep complexion",
          colors: [
            { name: "Emerald", color: "#50C878" },
            { name: "Ruby Red", color: "#E0115F" },
            { name: "Deep Purple", color: "#663399" },
            { name: "Gold", color: "#FFD700" },
            { name: "Bright White", color: "#FFFFFF" },
          ],
        },
      },
      bodyShape: {
        Hourglass: {
          description: "Balanced shoulders and hips with defined waist",
          icon: "⏳",
          tips: [
            "Highlight your waist with belts",
            "Fitted dresses and tops",
            "High-waisted bottoms",
            "Wrap dresses",
            "Avoid loose, shapeless clothing",
          ],
        },
        Pear: {
          description: "Hips wider than shoulders",
          icon: "🍐",
          tips: [
            "Dark colors on bottom, bright on top",
            "A-line skirts and dresses",
            "Statement tops and accessories",
            "Boat necklines",
            "Avoid tight-fitting bottoms",
          ],
        },
        Apple: {
          description: "Fuller midsection, shoulders wider than hips",
          icon: "🍎",
          tips: [
            "Empire waist dresses",
            "V-necks and scoop necklines",
            "Flowy tops",
            "High-waisted bottoms",
            "Avoid tight waistlines",
          ],
        },
        Rectangle: {
          description: "Similar measurements for shoulders, waist, and hips",
          icon: "📱",
          tips: [
            "Create curves with layering",
            "Belted dresses and tops",
            "Peplum styles",
            "Ruffles and textures",
            "Cropped jackets",
          ],
        },
      },
    }
  }

  getFaceShapeRecommendations(faceShape) {
    return this.recommendations.faceShape[faceShape] || this.recommendations.faceShape.Oval
  }

  getSkinToneRecommendations(skinTone) {
    return this.recommendations.skinTone[skinTone] || this.recommendations.skinTone.Medium
  }

  getBodyShapeRecommendations(bodyShape) {
    return this.recommendations.bodyShape[bodyShape] || this.recommendations.bodyShape.Rectangle
  }
}

// Make RecommendationEngine available globally
window.RecommendationEngine = RecommendationEngine
