"use client"

import { Trophy, Star, Calendar, Film } from "lucide-react"
import type { CompletedFilm } from "@/lib/game-types"
import { AWARD_LABELS, GENRE_LABELS, PROJECT_SIZE_CONFIG } from "@/lib/game-types"
import { formatMoney } from "@/lib/game-logic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FilmographyPanelProps {
  completedFilms: CompletedFilm[]
}

export function FilmographyPanel({ completedFilms }: FilmographyPanelProps) {
  if (completedFilms.length === 0) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-8 text-center">
          <Film className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground">
            Nenhum filme lançado ainda
          </p>
          <p className="text-sm text-muted-foreground">
            Seus filmes completos aparecerão aqui
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedFilms = [...completedFilms].sort(
    (a, b) => b.yearCompleted - a.yearCompleted
  )

  const totalRevenue = completedFilms.reduce((sum, f) => sum + f.revenue, 0)
  const totalAwards = completedFilms.reduce(
    (sum, f) => sum + f.awards.length,
    0
  )
  const avgScore =
    completedFilms.reduce((sum, f) => sum + f.finalScore, 0) /
    completedFilms.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-secondary/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">
              {completedFilms.length}
            </p>
            <p className="text-xs text-muted-foreground">Filmes</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">
              {formatMoney(totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground">Receita Total</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{totalAwards}</p>
            <p className="text-xs text-muted-foreground">Prêmios</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">
              {avgScore.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Nota Média</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {sortedFilms.map((film) => (
          <Card key={film.id} className="bg-card border-border overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-foreground">{film.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {GENRE_LABELS[film.genre]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {PROJECT_SIZE_CONFIG[film.size].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {film.yearCompleted}
                    </span>
                    <span>Dir. {film.coproducer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{film.leadActor.name}</span>
                    <span className="text-xs">•</span>
                    <span>{film.supportingActor.name}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-primary" />
                    <span className="text-xl font-bold">{film.finalScore}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatMoney(film.revenue)}
                  </p>
                </div>
              </div>

              {film.awards.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-1">
                    {film.awards.map((award, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-primary/50 text-primary"
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        {AWARD_LABELS[award.category]}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
