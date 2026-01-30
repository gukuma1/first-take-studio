"use client"

import { useState } from "react"
import {
  Plus,
  FastForward,
  Film,
  History,
  ArrowUp,
  Camera,
  Palette,
  Scissors,
  DollarSign,
} from "lucide-react"
import type {
  Actor,
  Coproducer,
  Distributor,
  FilmProject,
  FixedCrew,
  GameState,
  Genre,
  ProjectSize,
  YearSummary,
} from "@/lib/game-types"
import {
  createInitialGameState,
  createProject,
  advanceYear,
  calculateProjectCost,
  formatMoney,
} from "@/lib/game-logic"
import {
  getCrewUpgradeCost,
  upgradeCrewAttribute,
  getCrewMaintenanceCost,
  calculateTotalMaintenanceCost,
} from "@/lib/game-data"
import { GameHeader } from "./game-header"
import { ProjectCard } from "./project-card"
import { NewProjectModal } from "./new-project-modal"
import { CrewManagerModal } from "./crew-manager-modal"
import { YearSummaryModal } from "./year-summary-modal"
import { FilmographyPanel } from "./filmography-panel"
import { StartScreen } from "./start-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { _Montserrat } from "../fonts"

const NEW_CREW_COST = 3000000

export function GameBoard() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameState, setGameState] = useState<GameState>(createInitialGameState)

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showCrewManagerModal, setShowCrewManagerModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<FilmProject | null>(
    null
  )
  const [showYearSummary, setShowYearSummary] = useState(false)
  const [currentSummary, setCurrentSummary] = useState<YearSummary | null>(null)

  const handleStartGame = () => {
    setGameState(createInitialGameState())
    setGameStarted(true)
  }

  const handleCreateProject = (
    title: string,
    genre: Genre,
    size: ProjectSize,
    coproducer: Coproducer,
    leadActor: Actor,
    supportingActor: Actor,
    distributor?: Distributor
  ) => {
    const cost =
      calculateProjectCost(size, coproducer, leadActor, supportingActor) +
      (distributor?.cost || 0)

    const newProject = createProject(
      title,
      genre,
      size,
      coproducer,
      leadActor,
      supportingActor,
      gameState.year,
      gameState.ownedCrews
    )

    if (distributor) {
      newProject.distributor = distributor
    }

    // Mark talent as unavailable
    setGameState((prev) => ({
      ...prev,
      money: prev.money - cost,
      activeProjects: [...prev.activeProjects, newProject],
      availableActors: prev.availableActors.map((a) =>
        a.id === leadActor.id || a.id === supportingActor.id
          ? { ...a, isAvailable: false }
          : a
      ),
      availableCoproducers: prev.availableCoproducers.map((c) =>
        c.id === coproducer.id ? { ...c, isAvailable: false } : c
      ),
    }))
  }

  const handleAdvanceYear = () => {
    const { newState, summary } = advanceYear(gameState)

    // Mark talent from completed projects as available again
    const completedProjectIds = gameState.activeProjects
      .filter((p) => p.yearsRemaining <= 1)
      .map((p) => ({
        leadActorId: p.leadActor.id,
        supportingActorId: p.supportingActor.id,
        coproducerId: p.coproducer.id,
      }))

    const updatedActors = newState.availableActors.map((a) => {
      const shouldBeAvailable = completedProjectIds.some(
        (ids) => ids.leadActorId === a.id || ids.supportingActorId === a.id
      )
      return shouldBeAvailable ? { ...a, isAvailable: true } : a
    })

    const updatedCoproducers = newState.availableCoproducers.map((c) => {
      const shouldBeAvailable = completedProjectIds.some(
        (ids) => ids.coproducerId === c.id
      )
      return shouldBeAvailable ? { ...c, isAvailable: true } : c
    })

    setGameState({
      ...newState,
      availableActors: updatedActors,
      availableCoproducers: updatedCoproducers,
    })
    setCurrentSummary(summary)
    setShowYearSummary(true)
  }

  const handleManageCrews = (project: FilmProject) => {
    setSelectedProject(project)
    setShowCrewManagerModal(true)
  }

  const handleUpdateProjectCrews = (
    projectId: string,
    crewType: "filming" | "art" | "editing",
    crews: FixedCrew[]
  ) => {
    setGameState((prev) => ({
      ...prev,
      activeProjects: prev.activeProjects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              assignedCrews: {
                ...p.assignedCrews,
                [crewType]: crews,
              },
            }
          : p
      ),
    }))

    // Update selected project for modal
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              assignedCrews: {
                ...prev.assignedCrews,
                [crewType]: crews,
              },
            }
          : null
      )
    }
  }

  const handleUpgradeCrew = (
    crewId: string,
    attribute: "primary" | "secondary"
  ) => {
    const crew = gameState.ownedCrews.find((c) => c.id === crewId)
    if (!crew) return

    const cost = getCrewUpgradeCost(crew.level)
    if (gameState.money < cost) return

    const upgradedCrew = upgradeCrewAttribute(crew, attribute)

    setGameState((prev) => ({
      ...prev,
      money: prev.money - cost,
      ownedCrews: prev.ownedCrews.map((c) =>
        c.id === crewId ? upgradedCrew : c
      ),
      activeProjects: prev.activeProjects.map((p) => ({
        ...p,
        assignedCrews: {
          filming: p.assignedCrews.filming.map((c) =>
            c.id === crewId ? upgradedCrew : c
          ),
          art: p.assignedCrews.art.map((c) =>
            c.id === crewId ? upgradedCrew : c
          ),
          editing: p.assignedCrews.editing.map((c) =>
            c.id === crewId ? upgradedCrew : c
          ),
        },
      })),
    }))
  }

  const handleHireNewCrew = (type: "filming" | "art" | "editing") => {
    if (gameState.money < NEW_CREW_COST) return

    const typeLabels = {
      filming: "Filmagem",
      art: "Arte",
      editing: "Edição",
    }

    const existingCount = gameState.ownedCrews.filter(
      (c) => c.type === type
    ).length

    const newCrew: FixedCrew = {
      id: `crew-${type}-${Date.now()}`,
      name: `Equipe de ${typeLabels[type]} ${String.fromCharCode(65 + existingCount)}`,
      type,
      level: 1,
      attributes: { primary: 3, secondary: 3 },
    }

    setGameState((prev) => ({
      ...prev,
      money: prev.money - NEW_CREW_COST,
      ownedCrews: [...prev.ownedCrews, newCrew],
    }))
  }

  if (!gameStarted) {
    return <StartScreen onStart={handleStartGame} />
  }

  const getCrewIcon = (type: "filming" | "art" | "editing") => {
    switch (type) {
      case "filming":
        return Camera
      case "art":
        return Palette
      case "editing":
        return Scissors
    }
  }

  const totalMaintenanceCost = calculateTotalMaintenanceCost(gameState.ownedCrews)

  return (
    <div className="min-h-screen bg-background">
      <GameHeader
        year={gameState.year}
        money={gameState.money}
        fanbase={gameState.fanbase}
        totalAwards={gameState.totalAwards}
        activeProjectsCount={gameState.activeProjects.length}
      />

      <main className={`${_Montserrat.className} container mx-auto px-4 py-6`}>
        <Tabs defaultValue="productions" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="productions" className="gap-2">
                <Film className="w-4 h-4" />
                Produções
              </TabsTrigger>
              <TabsTrigger value="crews" className="gap-2">
                <Camera className="w-4 h-4" />
                Equipes
              </TabsTrigger>
              <TabsTrigger value="filmography" className="gap-2">
                <History className="w-4 h-4" />
                Filmografia
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Produção
              </Button>
              <Button onClick={handleAdvanceYear}>
                <FastForward className="w-4 h-4 mr-2" />
                Avançar Ano
              </Button>
            </div>
          </div>

          <TabsContent value="productions" className="space-y-4">
            {gameState.activeProjects.length === 0 ? (
              <Card className="bg-card/50">
                <CardContent className="p-8 text-center">
                  <Film className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-foreground">
                    Nenhuma produção em andamento
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comece criando sua primeira produção cinematográfica
                  </p>
                  <Button onClick={() => setShowNewProjectModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Produção
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.activeProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    ownedCrews={gameState.ownedCrews}
                    onManageCrews={handleManageCrews}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="crews" className="space-y-4">
            {/* Maintenance Cost Alert */}
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="p-4 flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-semibold text-foreground">
                    Custo Anual de Manutenção: {formatMoney(totalMaintenanceCost)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Este valor será deduzido automaticamente ao avançar o ano
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {(["filming", "art", "editing"] as const).map((type) => {
                const crewsOfType = gameState.ownedCrews.filter(
                  (c) => c.type === type
                )
                const Icon = getCrewIcon(type)
                const typeLabels = {
                  filming: {
                    name: "Filmagem",
                    primary: "Fotografia",
                    secondary: "Som",
                  },
                  art: {
                    name: "Arte",
                    primary: "Figurino",
                    secondary: "Cenário",
                  },
                  editing: {
                    name: "Edição",
                    primary: "Montagem",
                    secondary: "FX",
                  },
                }
                const labels = typeLabels[type]

                return (
                  <Card key={type} className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Icon className="w-5 h-5 text-primary" />
                        Equipes de {labels.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {crewsOfType.map((crew) => {
                        const upgradeCost = getCrewUpgradeCost(crew.level)
                        const maintenanceCost = getCrewMaintenanceCost(crew)
                        const canUpgrade =
                          gameState.money >= upgradeCost && crew.level < 5
                        const primaryMaxed = crew.attributes.primary >= 10
                        const secondaryMaxed = crew.attributes.secondary >= 10

                        return (
                          <div
                            key={crew.id}
                            className="p-3 rounded-lg border border-border bg-secondary/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-foreground">
                                {crew.name}
                              </p>
                              <Badge variant="secondary">
                                Nível {crew.level}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground mb-1">
                              <span>
                                {labels.primary}: {crew.attributes.primary}
                              </span>
                              <span>
                                {labels.secondary}: {crew.attributes.secondary}
                              </span>
                            </div>
                            <p className="text-xs text-destructive/80 mb-2">
                              Manutenção: {formatMoney(maintenanceCost)}/ano
                            </p>
                            {crew.level < 5 && (
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Upgrade ({formatMoney(upgradeCost)}) - Escolha
                                  o atributo:
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    disabled={!canUpgrade || primaryMaxed}
                                    onClick={() =>
                                      handleUpgradeCrew(crew.id, "primary")
                                    }
                                  >
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                    {labels.primary}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    disabled={!canUpgrade || secondaryMaxed}
                                    onClick={() =>
                                      handleUpgradeCrew(crew.id, "secondary")
                                    }
                                  >
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                    {labels.secondary}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      <Button
                        variant="outline"
                        className="w-full border-dashed bg-transparent"
                        disabled={gameState.money < NEW_CREW_COST}
                        onClick={() => handleHireNewCrew(type)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Equipe ({formatMoney(NEW_CREW_COST)})
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="filmography">
            <FilmographyPanel completedFilms={gameState.completedFilms} />
          </TabsContent>
        </Tabs>
      </main>

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
        availableActors={gameState.availableActors}
        availableCoproducers={gameState.availableCoproducers}
        availableDistributors={gameState.availableDistributors}
        currentMoney={gameState.money}
        fanbase={gameState.fanbase}
      />

      <CrewManagerModal
        isOpen={showCrewManagerModal}
        onClose={() => {
          setShowCrewManagerModal(false)
          setSelectedProject(null)
        }}
        project={selectedProject}
        ownedCrews={gameState.ownedCrews}
        currentMoney={gameState.money}
        onUpdateProjectCrews={handleUpdateProjectCrews}
        onUpgradeCrew={handleUpgradeCrew}
        onHireNewCrew={handleHireNewCrew}
      />

      <YearSummaryModal
        isOpen={showYearSummary}
        onClose={() => setShowYearSummary(false)}
        summary={currentSummary}
      />
    </div>
  )
}
