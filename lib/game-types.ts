// Game Types

export type ProjectSize = "indie" | "small" | "medium" | "large"

export type Genre =
  | "action"
  | "comedy"
  | "drama"
  | "horror"
  | "scifi"
  | "romance"
  | "thriller"
  | "documentary"

export interface GenreWeights {
  acting: number
  script: number
  filming: number
  art: number
  editing: number
}

export const GENRE_WEIGHTS: Record<Genre, GenreWeights> = {
  action: { acting: 0.20, script: 0.15, filming: 0.10, art: 0.25, editing: 0.30 },
  comedy: { acting: 0.25, script: 0.30, filming: 0.15, art: 0.10, editing: 0.20 },
  drama: { acting: 0.30, script: 0.20, filming: 0.25, art: 0.15, editing: 0.10 },
  horror: { acting: 0.15, script: 0.10, filming: 0.20, art: 0.30, editing: 0.25 },
  scifi: { acting: 0.15, script: 0.15, filming: 0.25, art: 0.20, editing: 0.25 },
  romance: { acting: 0.25, script: 0.20, filming: 0.15, art: 0.25, editing: 0.15 },
  thriller: { acting: 0.20, script: 0.25, filming: 0.20, art: 0.15, editing: 0.20 },
  documentary: { acting: 0.10, script: 0.25, filming: 0.30, art: 0.20, editing: 0.15 },
}

export const GENRE_LABELS: Record<Genre, string> = {
  action: "Ação",
  comedy: "Comédia",
  drama: "Drama",
  horror: "Terror",
  scifi: "Ficção Científica",
  romance: "Romance",
  thriller: "Suspense",
  documentary: "Documentário",
}

export const PROJECT_SIZE_CONFIG: Record<
  ProjectSize,
  { years: number; label: string; baseCost: number; baseRevenue: number }
> = {
  indie: { years: 1, label: "Indie", baseCost: 100000, baseRevenue: 1000000 },
  small: { years: 2, label: "Pequeno", baseCost: 1000000, baseRevenue: 1000000 },
  medium: { years: 3, label: "Médio", baseCost: 10000000, baseRevenue: 10000000 },
  large: { years: 4, label: "Grande", baseCost: 100000000, baseRevenue: 100000000 },
}

export interface Actor {
  id: string
  name: string
  fame: number // 1-10
  talent: number // 1-10
  salary: number
  isAvailable: boolean
}

export interface Coproducer {
  id: string
  name: string
  script: number // 1-10
  direction: number // 1-10
  salary: number
  isAvailable: boolean
}

export interface FixedCrew {
  id: string
  name: string
  type: "filming" | "art" | "editing"
  level: number // 1-5 upgrade level
  attributes: {
    primary: number // Fotografia/Figurino/Montagem
    secondary: number // Som/Cenário/FX
  }
}

export interface Distributor {
  id: string
  name: string
  revenueMultiplier: number // e.g., 1.5x
  minQuality: number // minimum score required
  cost: number
}

export interface FilmProject {
  id: string
  title: string
  genre: Genre
  size: ProjectSize
  yearStarted: number
  yearsRemaining: number
  coproducer: Coproducer
  leadActor: Actor
  supportingActor: Actor
  assignedCrews: {
    filming: FixedCrew[]
    art: FixedCrew[]
    editing: FixedCrew[]
  }
  scores: {
    acting: number
    script: number
    filming: number
    art: number
    editing: number
  }
  distributor?: Distributor
  isComplete: boolean
}

export interface CompletedFilm {
  id: string
  title: string
  genre: Genre
  size: ProjectSize
  yearCompleted: number
  finalScore: number
  scores: {
    acting: number
    script: number
    filming: number
    art: number
    editing: number
  }
  awards: Award[]
  revenue: number
  coproducer: Coproducer
  leadActor: Actor
  supportingActor: Actor
}

export type AwardCategory =
  | "best_film"
  | "best_script"
  | "best_direction"
  | "best_lead_actor"
  | "best_supporting_actor"
  | "best_cinematography"
  | "best_sound"
  | "best_costume"
  | "best_production_design"
  | "best_editing"
  | "best_vfx"

export const AWARD_LABELS: Record<AwardCategory, string> = {
  best_film: "Melhor Filme",
  best_script: "Melhor Roteiro",
  best_direction: "Melhor Direção",
  best_lead_actor: "Melhor Ator/Atriz Principal",
  best_supporting_actor: "Melhor Ator/Atriz Coadjuvante",
  best_cinematography: "Melhor Fotografia",
  best_sound: "Melhor Som",
  best_costume: "Melhor Figurino",
  best_production_design: "Melhor Cenário",
  best_editing: "Melhor Montagem",
  best_vfx: "Melhores Efeitos Visuais",
}

export interface Award {
  category: AwardCategory
  year: number
}

export interface GameState {
  year: number
  money: number
  fanbase: number
  activeProjects: FilmProject[]
  completedFilms: CompletedFilm[]
  ownedCrews: FixedCrew[]
  availableActors: Actor[]
  availableCoproducers: Coproducer[]
  availableDistributors: Distributor[]
  totalAwards: number
  history: YearSummary[]
}

export interface YearSummary {
  year: number
  filmsReleased: CompletedFilm[]
  awardsWon: Award[]
  revenue: number
  expenses: number
}
