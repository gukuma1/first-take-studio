"use client"

import { Clock, User, Users, Camera, Palette, Scissors } from "lucide-react"
import type { FilmProject, FixedCrew } from "@/lib/game-types"
import { GENRE_LABELS, PROJECT_SIZE_CONFIG } from "@/lib/game-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: FilmProject
  ownedCrews: FixedCrew[]
  onManageCrews: (project: FilmProject) => void
}

export function ProjectCard({
  project,
  onManageCrews,
}: ProjectCardProps) {
  const totalYears = PROJECT_SIZE_CONFIG[project.size].years
  const progress =
    ((totalYears - project.yearsRemaining) / totalYears) * 100

  const getScoreColor = (score: number) => {
    if (score < 10) return "text-muted-foreground"
    if (score < 20) return "text-foreground"
    return "text-primary"
  }

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-foreground truncate">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {GENRE_LABELS[project.genre]}
              </Badge>
              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                {PROJECT_SIZE_CONFIG[project.size].label}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Clock className="w-4 h-4" />
            <span className="font-bold">
              {project.yearsRemaining}
              <span className="text-muted-foreground text-xs ml-0.5">ano(s)</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Direção</p>
              <p className="font-medium text-foreground truncate">
                {project.coproducer.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Protagonista</p>
              <p className="font-medium text-foreground truncate">
                {project.leadActor.name}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground mb-2">Pontuações Acumuladas</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Atuação</p>
              <p className={`font-bold ${getScoreColor(project.scores.acting)}`}>
                {Math.round(project.scores.acting)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Roteiro</p>
              <p className={`font-bold ${getScoreColor(project.scores.script)}`}>
                {Math.round(project.scores.script)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Filmagem</p>
              <p className={`font-bold ${getScoreColor(project.scores.filming)}`}>
                {Math.round(project.scores.filming)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Arte</p>
              <p className={`font-bold ${getScoreColor(project.scores.art)}`}>
                {Math.round(project.scores.art)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Edição</p>
              <p className={`font-bold ${getScoreColor(project.scores.editing)}`}>
                {Math.round(project.scores.editing)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground mb-2">Equipes Designadas</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded">
              <Camera className="w-3 h-3 text-primary" />
              <span className="text-foreground">{project.assignedCrews.filming.length}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded">
              <Palette className="w-3 h-3 text-primary" />
              <span className="text-foreground">{project.assignedCrews.art.length}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded">
              <Scissors className="w-3 h-3 text-primary" />
              <span className="text-foreground">{project.assignedCrews.editing.length}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          onClick={() => onManageCrews(project)}
        >
          Gerenciar Equipes
        </Button>
      </CardContent>
    </Card>
  )
}
