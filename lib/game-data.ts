import type { Actor, Coproducer, Distributor, FixedCrew } from "./game-types"

const FIRST_NAMES = [
  "Lucas",
  "Marina",
  "Pedro",
  "Ana",
  "Carlos",
  "Julia",
  "Rafael",
  "Beatriz",
  "Fernando",
  "Camila",
  "Gabriel",
  "Larissa",
  "Thiago",
  "Amanda",
  "Bruno",
  "Isabella",
  "Diego",
  "Leticia",
  "Matheus",
  "Natalia",
]

const LAST_NAMES = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Rodrigues",
  "Ferreira",
  "Almeida",
  "Nascimento",
  "Lima",
  "Araújo",
  "Pereira",
  "Costa",
  "Carvalho",
  "Gomes",
  "Martins",
  "Rocha",
  "Ribeiro",
  "Barbosa",
  "Castro",
  "Monteiro",
]

const FILM_TITLES_PREFIXES = [
  "O Último",
  "A Sombra do",
  "Além do",
  "O Segredo de",
  "Na Trilha do",
  "O Despertar de",
  "A Jornada de",
  "O Mistério de",
  "Sob o Céu de",
  "A Vingança de",
]

const FILM_TITLES_SUFFIXES = [
  "Horizonte",
  "Destino",
  "Passado",
  "Silêncio",
  "Tempo",
  "Coração",
  "Sonho",
  "Império",
  "Oceano",
  "Fogo",
]

export function generateRandomName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  return `${firstName} ${lastName}`
}

export function generateFilmTitle(): string {
  const prefix =
    FILM_TITLES_PREFIXES[Math.floor(Math.random() * FILM_TITLES_PREFIXES.length)]
  const suffix =
    FILM_TITLES_SUFFIXES[Math.floor(Math.random() * FILM_TITLES_SUFFIXES.length)]
  return `${prefix} ${suffix}`
}

export function generateActors(count: number): Actor[] {
  return Array.from({ length: count }, (_, i) => {
    const fame = Math.floor(Math.random() * 10) + 1
    const talent = Math.floor(Math.random() * 10) + 1
    return {
      id: `actor-${Date.now()}-${i}`,
      name: generateRandomName(),
      fame,
      talent,
      salary: (fame * 100000 + talent * 100000) * (0.8 + Math.random() * 0.4),
      isAvailable: true,
    }
  })
}

export function generateCoproducers(count: number): Coproducer[] {
  return Array.from({ length: count }, (_, i) => {
    const script = Math.floor(Math.random() * 10) + 1
    const direction = Math.floor(Math.random() * 10) + 1
    return {
      id: `coproducer-${Date.now()}-${i}`,
      name: generateRandomName(),
      script,
      direction,
      salary: (script * 100000 + direction * 100000) * (0.8 + Math.random() * 0.4),
      isAvailable: true,
    }
  })
}

export function generateInitialCrews(): FixedCrew[] {
  return [
    {
      id: "crew-filming-1",
      name: "Equipe de Filmagem A",
      type: "filming",
      level: 1,
      attributes: { primary: 1, secondary: 1 },
    },
    {
      id: "crew-art-1",
      name: "Equipe de Arte A",
      type: "art",
      level: 1,
      attributes: { primary: 1, secondary: 1 },
    },
    {
      id: "crew-editing-1",
      name: "Equipe de Edição A",
      type: "editing",
      level: 1,
      attributes: { primary: 1, secondary: 1 },
    },
  ]
}

export function getCrewUpgradeCost(currentLevel: number): number {
  return currentLevel * 1000000
}

export function getCrewMaintenanceCost(crew: FixedCrew): number {
  // Custo anual de manutenção baseado no nível: $500K por nível
  return crew.level * 100000
}

export function calculateTotalMaintenanceCost(crews: FixedCrew[]): number {
  return crews.reduce((total, crew) => total + getCrewMaintenanceCost(crew), 0)
}

export function upgradeCrewAttribute(
  crew: FixedCrew,
  attribute: "primary" | "secondary"
): FixedCrew {
  return {
    ...crew,
    level: crew.level + 1,
    attributes: {
      primary:
        attribute === "primary"
          ? Math.min(10, crew.attributes.primary + 1)
          : crew.attributes.primary,
      secondary:
        attribute === "secondary"
          ? Math.min(10, crew.attributes.secondary + 1)
          : crew.attributes.secondary,
    },
  }
}

export const INITIAL_DISTRIBUTORS: Distributor[] = [
  {
    id: "dist-1",
    name: "Indie Films Brasil",
    revenueMultiplier: 1.2,
    minQuality: 40,
    cost: 500000,
  },
  {
    id: "dist-2",
    name: "Nacional Pictures",
    revenueMultiplier: 1.5,
    minQuality: 60,
    cost: 2000000,
  },
  {
    id: "dist-3",
    name: "Global Entertainment",
    revenueMultiplier: 2.0,
    minQuality: 75,
    cost: 5000000,
  },
  {
    id: "dist-4",
    name: "Mega Studios International",
    revenueMultiplier: 3.0,
    minQuality: 85,
    cost: 15000000,
  },
]

export const FANBASE_THRESHOLDS = {
  distributor_unlock: 10000,
  tier2_distributor: 50000,
  tier3_distributor: 200000,
  tier4_distributor: 1000000,
}
