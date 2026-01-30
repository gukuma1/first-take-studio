"use client"

import { useState } from "react"
import { X, Star, Sparkles, DollarSign } from "lucide-react"
import type {
  Actor,
  Coproducer,
  Distributor,
  Genre,
  ProjectSize,
} from "@/lib/game-types"
import {
  GENRE_LABELS,
  PROJECT_SIZE_CONFIG,
} from "@/lib/game-types"
import { generateFilmTitle } from "@/lib/game-data"
import { calculateProjectCost, formatMoney } from "@/lib/game-logic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { _Montserrat } from "../fonts"

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (
    title: string,
    genre: Genre,
    size: ProjectSize,
    coproducer: Coproducer,
    leadActor: Actor,
    supportingActor: Actor,
    distributor?: Distributor
  ) => void
  availableActors: Actor[]
  availableCoproducers: Coproducer[]
  availableDistributors: Distributor[]
  currentMoney: number
  fanbase: number
}

const GENRES: Genre[] = [
  "action",
  "comedy",
  "drama",
  "horror",
  "scifi",
  "romance",
  "thriller",
  "documentary",
]

const PROJECT_SIZES: ProjectSize[] = ["indie", "small", "medium", "large"]

export function NewProjectModal({
  isOpen,
  onClose,
  onCreateProject,
  availableActors,
  availableCoproducers,
  availableDistributors,
  currentMoney,
  fanbase,
}: NewProjectModalProps) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState(generateFilmTitle())
  const [genre, setGenre] = useState<Genre | null>(null)
  const [size, setSize] = useState<ProjectSize | null>(null)
  const [coproducer, setCoproducer] = useState<Coproducer | null>(null)
  const [leadActor, setLeadActor] = useState<Actor | null>(null)
  const [supportingActor, setSupportingActor] = useState<Actor | null>(null)
  const [distributor, setDistributor] = useState<Distributor | null>(null)

  const resetForm = () => {
    setStep(1)
    setTitle(generateFilmTitle())
    setGenre(null)
    setSize(null)
    setCoproducer(null)
    setLeadActor(null)
    setSupportingActor(null)
    setDistributor(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const totalCost =
    size && coproducer && leadActor && supportingActor
      ? calculateProjectCost(size, coproducer, leadActor, supportingActor) +
        (distributor?.cost || 0)
      : 0

  const canAfford = totalCost <= currentMoney

  const handleCreate = () => {
    if (genre && size && coproducer && leadActor && supportingActor) {
      onCreateProject(
        title,
        genre,
        size,
        coproducer,
        leadActor,
        supportingActor,
        distributor || undefined
      )
      handleClose()
    }
  }

  if (!isOpen) return null

  const renderStars = (value: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < value ? "fill-primary text-primary" : "text-muted"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`${_Montserrat.className} fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Nova Produção</h2>
            <p className="text-sm text-muted-foreground">Etapa {step} de 4</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Filme</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título..."
                    className="bg-input"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTitle(generateFilmTitle())}
                    title="Gerar título aleatório"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gênero</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {GENRES.map((g) => (
                    <Button
                      key={g}
                      variant={genre === g ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setGenre(g)}
                    >
                      {GENRE_LABELS[g]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tamanho do Projeto</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PROJECT_SIZES.map((s) => (
                    <Card
                      key={s}
                      className={`cursor-pointer transition-colors ${
                        size === s
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSize(s)}
                    >
                      <CardContent className="p-3 text-center">
                        <p className="font-bold text-foreground">
                          {PROJECT_SIZE_CONFIG[s].label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {PROJECT_SIZE_CONFIG[s].years} ano(s)
                        </p>
                        <p className="text-xs text-primary mt-1">
                          {formatMoney(PROJECT_SIZE_CONFIG[s].baseCost)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!title || !genre || !size}
                onClick={() => setStep(2)}
              >
                Próximo: Escolher Diretor
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Escolha o Coprodutor/Diretor
                </h3>
                <p className="text-sm text-muted-foreground">
                  O diretor influencia a qualidade do roteiro e direção do
                  filme.
                </p>
              </div>

              <div className="space-y-2">
                {availableCoproducers.filter((c) => c.isAvailable).map((c) => (
                  <Card
                    key={c.id}
                    className={`cursor-pointer transition-colors ${
                      coproducer?.id === c.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setCoproducer(c)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Roteiro: </span>
                            {renderStars(c.script)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Direção: </span>
                            {renderStars(c.direction)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-primary">
                        {formatMoney(c.salary)}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={!coproducer}
                  onClick={() => setStep(3)}
                >
                  Próximo: Escolher Elenco
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Escolha o Elenco
                </h3>
                <p className="text-sm text-muted-foreground">
                  Atores com mais fama trazem público, mas talento traz
                  qualidade.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Ator/Atriz Principal</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableActors
                      .filter(
                        (a) =>
                          a.isAvailable && a.id !== supportingActor?.id
                      )
                      .map((a) => (
                        <Card
                          key={a.id}
                          className={`cursor-pointer transition-colors ${
                            leadActor?.id === a.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setLeadActor(a)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">{a.name}</p>
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Fama: </span>
                                  {renderStars(a.fame)}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Talento: </span>
                                  {renderStars(a.talent)}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-primary">
                              {formatMoney(a.salary)}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Ator/Atriz Coadjuvante</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableActors
                      .filter(
                        (a) => a.isAvailable && a.id !== leadActor?.id
                      )
                      .map((a) => (
                        <Card
                          key={a.id}
                          className={`cursor-pointer transition-colors ${
                            supportingActor?.id === a.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSupportingActor(a)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">{a.name}</p>
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Fama: </span>
                                  {renderStars(a.fame)}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Talento: </span>
                                  {renderStars(a.talent)}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-primary">
                              {formatMoney(a.salary)}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={!leadActor || !supportingActor}
                  onClick={() => setStep(4)}
                >
                  Próximo: Revisão
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Revisão do Projeto
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confirme os detalhes da sua produção.
                </p>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Título</span>
                    <span className="font-bold text-foreground">{title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gênero</span>
                    <Badge>{genre && GENRE_LABELS[genre]}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tamanho</span>
                    <span className="text-foreground">
                      {size && PROJECT_SIZE_CONFIG[size].label} (
                      {size && PROJECT_SIZE_CONFIG[size].years} anos)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Diretor</span>
                    <span className="text-foreground">{coproducer?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Protagonista</span>
                    <span className="text-foreground">{leadActor?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Coadjuvante</span>
                    <span className="text-foreground">{supportingActor?.name}</span>
                  </div>
                </CardContent>
              </Card>

              {fanbase >= 10000 && (
                <div className="space-y-2">
                  <Label>Distribuidora (Opcional)</Label>
                  <div className="space-y-2">
                    {availableDistributors
                      .filter((d) => {
                        if (d.id === "dist-2" && fanbase < 50000) return false
                        if (d.id === "dist-3" && fanbase < 200000) return false
                        if (d.id === "dist-4" && fanbase < 1000000) return false
                        return true
                      })
                      .map((d) => (
                        <Card
                          key={d.id}
                          className={`cursor-pointer transition-colors ${
                            distributor?.id === d.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() =>
                            setDistributor(
                              distributor?.id === d.id ? null : d
                            )
                          }
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{d.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Receita x{d.revenueMultiplier} | Qualidade mín:{" "}
                                {d.minQuality}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-primary">
                              {formatMoney(d.cost)}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              <Card className="bg-primary/10 border-primary">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Custo Total</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary">
                      {formatMoney(totalCost)}
                    </p>
                    {!canAfford && (
                      <p className="text-xs text-destructive">
                        Orçamento insuficiente
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={!canAfford}
                  onClick={handleCreate}
                >
                  Iniciar Produção
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
