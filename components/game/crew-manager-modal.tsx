"use client"

import { X, Camera, Palette, Scissors, Plus, Minus, ArrowUp } from "lucide-react"
import type { FilmProject, FixedCrew } from "@/lib/game-types"
import { getCrewUpgradeCost, getCrewMaintenanceCost } from "@/lib/game-data"
import { formatMoney } from "@/lib/game-logic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { _Montserrat, _Playfair } from "../fonts"

interface CrewManagerModalProps {
  isOpen: boolean
  onClose: () => void
  project: FilmProject | null
  ownedCrews: FixedCrew[]
  currentMoney: number
  onUpdateProjectCrews: (
    projectId: string,
    crewType: "filming" | "art" | "editing",
    crews: FixedCrew[]
  ) => void
  onUpgradeCrew: (crewId: string, attribute: "primary" | "secondary") => void
  onHireNewCrew: (type: "filming" | "art" | "editing") => void
}

const CREW_TYPE_CONFIG = {
  filming: {
    icon: Camera,
    label: "Filmagem",
    primaryLabel: "Fotografia",
    secondaryLabel: "Som",
    color: "text-blue-400",
  },
  art: {
    icon: Palette,
    label: "Arte",
    primaryLabel: "Figurino",
    secondaryLabel: "Cenário",
    color: "text-pink-400",
  },
  editing: {
    icon: Scissors,
    label: "Edição",
    primaryLabel: "Montagem",
    secondaryLabel: "FX",
    color: "text-green-400",
  },
}

const NEW_CREW_COST = 3000000

export function CrewManagerModal({
  isOpen,
  onClose,
  project,
  ownedCrews,
  currentMoney,
  onUpdateProjectCrews,
  onUpgradeCrew,
  onHireNewCrew,
}: CrewManagerModalProps) {
  if (!isOpen || !project) return null

  const toggleCrewAssignment = (
    crew: FixedCrew,
    type: "filming" | "art" | "editing"
  ) => {
    const currentCrews = project.assignedCrews[type]
    const isAssigned = currentCrews.some((c) => c.id === crew.id)

    if (isAssigned) {
      // Don't allow removing if it's the last crew
      if (currentCrews.length <= 1) return
      onUpdateProjectCrews(
        project.id,
        type,
        currentCrews.filter((c) => c.id !== crew.id)
      )
    } else {
      onUpdateProjectCrews(project.id, type, [...currentCrews, crew])
    }
  }

  const renderCrewSection = (type: "filming" | "art" | "editing") => {
    const config = CREW_TYPE_CONFIG[type]
    const Icon = config.icon
    const crewsOfType = ownedCrews.filter((c) => c.type === type)
    const assignedCrews = project.assignedCrews[type]

    return (
      <Card key={type} className={`${_Montserrat.className} bg-secondary/30`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <span className="text-foreground">Equipe de {config.label}</span>
            <Badge variant="outline" className="ml-auto">
              {assignedCrews.length} designada(s)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {crewsOfType.map((crew) => {
            const isAssigned = assignedCrews.some((c) => c.id === crew.id)
            const upgradeCost = getCrewUpgradeCost(crew.level)
            const maintenanceCost = getCrewMaintenanceCost(crew)
            const canUpgrade = currentMoney >= upgradeCost && crew.level < 5
            const primaryMaxed = crew.attributes.primary >= 10
            const secondaryMaxed = crew.attributes.secondary >= 10

            return (
              <div
                key={crew.id}
                className={`p-3 rounded-lg border transition-colors ${
                  isAssigned
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{crew.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        Nível {crew.level}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span>
                        {config.primaryLabel}: {crew.attributes.primary}
                      </span>
                      <span>
                        {config.secondaryLabel}: {crew.attributes.secondary}
                      </span>
                    </div>
                    <p className="text-xs text-destructive/80 mt-1">
                      Manutenção: {formatMoney(maintenanceCost)}/ano
                    </p>
                  </div>
                  <Button
                    variant={isAssigned ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCrewAssignment(crew, type)}
                    disabled={isAssigned && assignedCrews.length <= 1}
                  >
                    {isAssigned ? (
                      <>
                        <Minus className="w-4 h-4 mr-1" />
                        Remover
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Designar
                      </>
                    )}
                  </Button>
                </div>

                {crew.level < 5 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">
                      Upgrade ({formatMoney(upgradeCost)}) - Escolha o atributo:
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        disabled={!canUpgrade || primaryMaxed}
                        onClick={() => onUpgradeCrew(crew.id, "primary")}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        {config.primaryLabel}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        disabled={!canUpgrade || secondaryMaxed}
                        onClick={() => onUpgradeCrew(crew.id, "secondary")}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        {config.secondaryLabel}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Button
            variant="outline"
            className="w-full mt-2 border-dashed bg-transparent"
            disabled={currentMoney < NEW_CREW_COST}
            onClick={() => onHireNewCrew(type)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Contratar Nova Equipe ({formatMoney(NEW_CREW_COST)})
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`${_Montserrat.className} sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between`}>
          <div>
            <h2 className="text-xl font-bold text-foreground">Gerenciar Equipes</h2>
            <p className="text-sm text-muted-foreground">{project.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className={`${_Playfair.className} bg-secondary/30 rounded-lg p-4`}>
            <p className="text-sm text-muted-foreground">
              Cada projeto precisa de pelo menos uma equipe de cada tipo.
              Adicionar mais equipes aumenta a qualidade da produção. Equipes
              podem ser melhoradas com upgrades - você escolhe qual atributo
              deseja melhorar.
            </p>
          </div>

          {renderCrewSection("filming")}
          {renderCrewSection("art")}
          {renderCrewSection("editing")}
        </div>
      </div>
    </div>
  )
}
