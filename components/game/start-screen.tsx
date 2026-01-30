"use client"

import { Film, Play, Trophy, Users, DollarSign, Clapperboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { _Montserrat, _Playfair } from "../fonts"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary flex items-center justify-center">
            <Clapperboard className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className={`${_Playfair.className} text-4xl md:text-5xl font-bold text-foreground tracking-tight`}>
            First Take Studio
          </h1>
          <p className={`${_Montserrat.className} text-lg text-muted-foreground max-w-md mx-auto`}>
            Construa seu império cinematográfico, produza filmes de sucesso e
            conquiste as maiores premiações do cinema.
          </p>
        </div>

        <div className={`${_Montserrat.className} grid grid-cols-2 md:grid-cols-4 gap-3`}>
          <Card className="bg-secondary/50 border-border">
            <CardContent className="p-4 text-center">
              <Film className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Produza Filmes</p>
              <p className="text-xs text-muted-foreground">
                Escolha gênero e tamanho
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50 border-border">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Monte Equipes</p>
              <p className="text-xs text-muted-foreground">
                Contrate e melhore
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50 border-border">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Ganhe Prêmios</p>
              <p className="text-xs text-muted-foreground">
                11 categorias
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50 border-border">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Lucre Alto</p>
              <p className="text-xs text-muted-foreground">
                Expanda seu estúdio
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className={`${_Playfair.className} bg-card/50 border-border`}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Como Jogar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Inicie uma nova produção escolhendo gênero, tamanho e equipe
                criativa.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                A cada ano, suas produções acumulam pontos baseados na qualidade
                das equipes.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Ao completar um filme, ele é avaliado e pode ganhar premiações.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                Use sua receita para melhorar equipes e fazer produções maiores.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className={`${_Montserrat.className} w-full text-lg h-14`}
          onClick={onStart}
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Jogo
        </Button>
      </div>
    </div>
  )
}
