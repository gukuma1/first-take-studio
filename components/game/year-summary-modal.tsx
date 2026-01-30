"use client"

import { Trophy, Film, DollarSign, Star, X } from "lucide-react"
import type { YearSummary } from "@/lib/game-types"
import { AWARD_LABELS, GENRE_LABELS } from "@/lib/game-types"
import { formatMoney } from "@/lib/game-logic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { _Montserrat } from "../fonts"

interface YearSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  summary: YearSummary | null
}

export function YearSummaryModal({
  isOpen,
  onClose,
  summary,
}: YearSummaryModalProps) {
  if (!isOpen || !summary) return null

  const hasAwards = summary.awardsWon.length > 0
  const hasFilms = summary.filmsReleased.length > 0

  return (
    <div className={`${_Montserrat.className} fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Resumo do Ano {summary.year}
            </h2>
            <p className="text-sm text-muted-foreground">
              Resultados da temporada cinematográfica
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {!hasFilms && (
            <div className="text-center py-8">
              <Film className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-foreground">
                Nenhum filme lançado este ano
              </p>
              <p className="text-sm text-muted-foreground">
                Continue trabalhando nas suas produções em andamento
              </p>
            </div>
          )}

          {hasFilms && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/10 border-primary">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Film className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Filmes Lançados
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {summary.filmsReleased.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/10 border-primary">
                  <CardContent className="p-4 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Receita Total
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatMoney(summary.revenue)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {summary.expenses > 0 && (
                <Card className="bg-destructive/10 border-destructive/30">
                  <CardContent className="p-4 flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-destructive" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Manutenção de Equipes
                      </p>
                      <p className="text-lg font-bold text-destructive">
                        -{formatMoney(summary.expenses)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                      <p
                        className={`text-lg font-bold ${summary.revenue - summary.expenses >= 0 ? "text-primary" : "text-destructive"}`}
                      >
                        {formatMoney(summary.revenue - summary.expenses)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Film className="w-5 h-5 text-primary" />
                  Filmes Lançados
                </h3>
                {summary.filmsReleased.map((film) => (
                  <Card
                    key={film.id}
                    className="bg-secondary/30 overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-foreground">
                            {film.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              {GENRE_LABELS[film.genre]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Dir. {film.coproducer.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-primary">
                            <Star className="w-5 h-5 fill-primary" />
                            <span className="text-2xl font-bold">
                              {film.finalScore}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatMoney(film.revenue)}
                          </p>
                        </div>
                      </div>

                      {film.awards.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {film.awards.map((award, i) => (
                              <Badge
                                key={i}
                                className="bg-primary text-primary-foreground"
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

              {hasAwards && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Premiações Conquistadas
                  </h3>
                  <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary mb-2">
                          {summary.awardsWon.length}
                        </p>
                        <p className="text-muted-foreground">
                          {summary.awardsWon.length === 1
                            ? "prêmio conquistado"
                            : "prêmios conquistados"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          <Button className="w-full" onClick={onClose}>
            Continuar para {summary.year + 1}
          </Button>
        </div>
      </div>
    </div>
  )
}
