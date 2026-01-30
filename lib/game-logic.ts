import {
  Actor,
  Award,
  AwardCategory,
  CompletedFilm,
  Coproducer,
  FilmProject,
  FixedCrew,
  GameState,
  Genre,
  GenreWeights,
  ProjectSize,
  YearSummary,
  PROJECT_SIZE_CONFIG,
  GENRE_WEIGHTS
} from "./game-types"
import {
  generateActors,
  generateCoproducers,
  generateInitialCrews,
  INITIAL_DISTRIBUTORS,
  calculateTotalMaintenanceCost,
} from "./game-data"

export function createInitialGameState(): GameState {
  return {
    year: 2025,
    money: 10000000, // Starting with $10M
    fanbase: 0,
    activeProjects: [],
    completedFilms: [],
    ownedCrews: generateInitialCrews(),
    availableActors: generateActors(8),
    availableCoproducers: generateCoproducers(5),
    availableDistributors: INITIAL_DISTRIBUTORS,
    totalAwards: 0,
    history: [],
  }
}

export function calculateProjectCost(
  size: ProjectSize,
  coproducer: Coproducer,
  leadActor: Actor,
  supportingActor: Actor
): number {
  const baseCost = PROJECT_SIZE_CONFIG[size].baseCost
  const talentCost =
    coproducer.salary + leadActor.salary + supportingActor.salary
  return baseCost + talentCost
}

export function createProject(
  title: string,
  genre: Genre,
  size: ProjectSize,
  coproducer: Coproducer,
  leadActor: Actor,
  supportingActor: Actor,
  currentYear: number,
  ownedCrews: FixedCrew[]
): FilmProject {
  // Assign one crew of each type by default
  const filmingCrew = ownedCrews.filter((c) => c.type === "filming").slice(0, 1)
  const artCrew = ownedCrews.filter((c) => c.type === "art").slice(0, 1)
  const editingCrew = ownedCrews.filter((c) => c.type === "editing").slice(0, 1)

  return {
    id: `project-${Date.now()}`,
    title,
    genre,
    size,
    yearStarted: currentYear,
    yearsRemaining: PROJECT_SIZE_CONFIG[size].years,
    coproducer,
    leadActor,
    supportingActor,
    assignedCrews: {
      filming: filmingCrew,
      art: artCrew,
      editing: editingCrew,
    },
    scores: {
      acting: 0,
      script: 0,
      filming: 0,
      art: 0,
      editing: 0,
    },
    isComplete: false,
  }
}

export function calculateYearlyScoreIncrease(project: FilmProject): {
  acting: number
  script: number
  filming: number
  art: number
  editing: number
} {
  const { coproducer, leadActor, supportingActor, assignedCrews } = project

  // Acting score based on actors
  const actingIncrease = 
    ((leadActor.talent +
      leadActor.fame +
      supportingActor.talent +
      supportingActor.fame) / 2) *
    (0.8 + Math.random() * 0.4)

  // Script score based on coproducer
  const scriptIncrease = (coproducer.script + coproducer.direction)  * (0.8 + Math.random() * 0.4)

  // Filming score based on filming crews
  const filmingCrewScore = assignedCrews.filming.reduce(
    (sum, crew) => sum + crew.attributes.primary + crew.attributes.secondary,
    0
  )
  const filmingIncrease =
    filmingCrewScore * (0.8 + Math.random() * 0.4)

  // Art score based on art crews
  const artCrewScore = assignedCrews.art.reduce(
    (sum, crew) => sum + crew.attributes.primary + crew.attributes.secondary,
    0
  )
  const artIncrease = artCrewScore * (0.8 + Math.random() * 0.4)

  // Editing score based on editing crews
  const editingCrewScore = assignedCrews.editing.reduce(
    (sum, crew) => sum + crew.attributes.primary + crew.attributes.secondary,
    0
  )
  const editingIncrease = editingCrewScore * (0.8 + Math.random() * 0.4)

  return {
    acting: actingIncrease,
    script: scriptIncrease,
    filming: filmingIncrease,
    art: artIncrease,
    editing: editingIncrease,
  }
}

export function advanceProject(project: FilmProject): FilmProject {
  const scoreIncrease = calculateYearlyScoreIncrease(project)

  return {
    ...project,
    yearsRemaining: project.yearsRemaining - 1,
    scores: {
      acting: project.scores.acting + scoreIncrease.acting,
      script: project.scores.script + scoreIncrease.script,
      filming: project.scores.filming + scoreIncrease.filming,
      art: project.scores.art + scoreIncrease.art,
      editing: project.scores.editing + scoreIncrease.editing,
    },
    isComplete: project.yearsRemaining <= 1,
  }
}

export function calculateFinalScore(
  scores: FilmProject["scores"],
  weights: GenreWeights
): number {
  const maxPossibleScore = 100

  // Normalize each score to 0-100 range
  const normalizedScores = {
    acting: Math.min(100, scores.acting * 2),
    script: Math.min(100, scores.script * 2),
    filming: Math.min(100, scores.filming * 2),
    art: Math.min(100, scores.art * 2),
    editing: Math.min(100, scores.editing * 2),
  }

  const weightedScore =
    normalizedScores.acting * weights.acting +
    normalizedScores.script * weights.script +
    normalizedScores.filming * weights.filming +
    normalizedScores.art * weights.art +
    normalizedScores.editing * weights.editing

  return Math.min(maxPossibleScore, Math.round(weightedScore))
}

export function completeProject(
  project: FilmProject,
  currentYear: number
): CompletedFilm {
  const weights = GENRE_WEIGHTS[project.genre]
  const finalScore = calculateFinalScore(project.scores, weights)

  return {
    id: project.id,
    title: project.title,
    genre: project.genre,
    size: project.size,
    yearCompleted: currentYear,
    finalScore,
    scores: project.scores,
    awards: [],
    revenue: 0,
    coproducer: project.coproducer,
    leadActor: project.leadActor,
    supportingActor: project.supportingActor,
  }
}

export function calculateRevenue(
  film: CompletedFilm,
  fanbase: number
): number {
  const baseRevenue = PROJECT_SIZE_CONFIG[film.size].baseRevenue
  const qualityMultiplier = film.finalScore / 50 // Score of 50 = 1x, 100 = 2x
  const fanbaseBonus = 1 + fanbase / 1000000 // Each million fans adds 1x

  return Math.round(baseRevenue * qualityMultiplier * fanbaseBonus)
}

export function determineAwards(
  filmsThisYear: CompletedFilm[]
): Map<AwardCategory, CompletedFilm> {
  const awards = new Map<AwardCategory, CompletedFilm>()

  if (filmsThisYear.length === 0) return awards

  // Best Film - highest final score
  const bestFilm = [...filmsThisYear].sort(
    (a, b) => b.finalScore - a.finalScore
  )[0]
  if (bestFilm.finalScore >= 70) {
    awards.set("best_film", bestFilm)
  }

  // Best Script - highest script score
  const bestScript = [...filmsThisYear].sort(
    (a, b) => b.scores.script - a.scores.script
  )[0]
  if (bestScript.scores.script >= 15) {
    awards.set("best_script", bestScript)
  }

  // Best Direction - based on coproducer direction
  const bestDirection = [...filmsThisYear].sort(
    (a, b) => b.coproducer.direction - a.coproducer.direction
  )[0]
  if (bestDirection.coproducer.direction >= 7) {
    awards.set("best_direction", bestDirection)
  }

  // Best Lead Actor - based on lead actor performance
  const bestLeadActor = [...filmsThisYear].sort(
    (a, b) => b.leadActor.talent - a.leadActor.talent
  )[0]
  if (bestLeadActor.leadActor.talent >= 7) {
    awards.set("best_lead_actor", bestLeadActor)
  }

  // Best Supporting Actor
  const bestSupportingActor = [...filmsThisYear].sort(
    (a, b) => b.supportingActor.talent - a.supportingActor.talent
  )[0]
  if (bestSupportingActor.supportingActor.talent >= 7) {
    awards.set("best_supporting_actor", bestSupportingActor)
  }

  // Best Cinematography - filming primary
  const bestCinematography = [...filmsThisYear].sort(
    (a, b) => b.scores.filming - a.scores.filming
  )[0]
  if (bestCinematography.scores.filming >= 15) {
    awards.set("best_cinematography", bestCinematography)
  }

  // Best Sound - filming secondary
  const bestSound = [...filmsThisYear].sort(
    (a, b) => b.scores.filming - a.scores.filming
  )[0]
  if (bestSound.scores.filming >= 12) {
    awards.set("best_sound", bestSound)
  }

  // Best Costume - art primary
  const bestCostume = [...filmsThisYear].sort(
    (a, b) => b.scores.art - a.scores.art
  )[0]
  if (bestCostume.scores.art >= 12) {
    awards.set("best_costume", bestCostume)
  }

  // Best Production Design - art secondary
  const bestProductionDesign = [...filmsThisYear].sort(
    (a, b) => b.scores.art - a.scores.art
  )[0]
  if (bestProductionDesign.scores.art >= 10) {
    awards.set("best_production_design", bestProductionDesign)
  }

  // Best Editing
  const bestEditing = [...filmsThisYear].sort(
    (a, b) => b.scores.editing - a.scores.editing
  )[0]
  if (bestEditing.scores.editing >= 12) {
    awards.set("best_editing", bestEditing)
  }

  // Best VFX
  const bestVFX = [...filmsThisYear].sort(
    (a, b) => b.scores.editing - a.scores.editing
  )[0]
  if (bestVFX.scores.editing >= 15) {
    awards.set("best_vfx", bestVFX)
  }

  return awards
}

export function calculateFanbaseIncrease(
  film: CompletedFilm,
  currentFanbase: number
): number {
  const qualityBonus = Math.max(0, (film.finalScore - 50) * 1000)
  const awardBonus = film.awards.length * 5000
  const sizeMultiplier =
    film.size === "indie"
      ? 0.5
      : film.size === "small"
        ? 1
        : film.size === "medium"
          ? 2
          : 4

  return Math.round((qualityBonus + awardBonus) * sizeMultiplier)
}

export function advanceYear(state: GameState): {
  newState: GameState
  summary: YearSummary
} {
  // Calculate and deduct maintenance costs for all crews
  const maintenanceCost = calculateTotalMaintenanceCost(state.ownedCrews)
  let newMoney = state.money - maintenanceCost
  let newFanbase = state.fanbase
  const completedThisYear: CompletedFilm[] = []
  const ongoingProjects: FilmProject[] = []

  // Process each active project
  for (const project of state.activeProjects) {
    const advanced = advanceProject(project)

    if (advanced.isComplete) {
      const completed = completeProject(advanced, state.year)
      completedThisYear.push(completed)
    } else {
      ongoingProjects.push(advanced)
    }
  }

  // Determine awards for this year's films
  const awardWinners = determineAwards(completedThisYear)
  const awardsWon: Award[] = []

  // Update films with awards and calculate revenue
  const finalCompletedFilms = completedThisYear.map((film) => {
    const filmAwards: Award[] = []

    awardWinners.forEach((winner, category) => {
      if (winner.id === film.id) {
        const award: Award = { category, year: state.year }
        filmAwards.push(award)
        awardsWon.push(award)
      }
    })

    const revenue = calculateRevenue(
      { ...film, awards: filmAwards },
      newFanbase
    )
    newMoney += revenue

    const fanbaseIncrease = calculateFanbaseIncrease(
      { ...film, awards: filmAwards },
      newFanbase
    )
    newFanbase += fanbaseIncrease

    return {
      ...film,
      awards: filmAwards,
      revenue,
    }
  })

  // Refresh available talent pool
  const newActors = [
    ...state.availableActors.filter((a) => a.isAvailable),
    ...generateActors(3),
  ].slice(-10)

  const newCoproducers = [
    ...state.availableCoproducers.filter((c) => c.isAvailable),
    ...generateCoproducers(2),
  ].slice(-6)

  const summary: YearSummary = {
    year: state.year,
    filmsReleased: finalCompletedFilms,
    awardsWon,
    revenue: finalCompletedFilms.reduce((sum, f) => sum + f.revenue, 0),
    expenses: maintenanceCost,
  }

  const newState: GameState = {
    ...state,
    year: state.year + 1,
    money: newMoney,
    fanbase: newFanbase,
    activeProjects: ongoingProjects,
    completedFilms: [...state.completedFilms, ...finalCompletedFilms],
    availableActors: newActors,
    availableCoproducers: newCoproducers,
    totalAwards: state.totalAwards + awardsWon.length,
    history: [...state.history, summary],
  }

  return { newState, summary }
}

export function formatMoney(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toString()
}
