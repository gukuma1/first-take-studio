"use client"

import { Trophy, Users, Calendar, DollarSign, Film } from "lucide-react"
import { formatMoney, formatNumber } from "@/lib/game-logic"
import { _Montserrat, _Playfair } from "../fonts"

interface GameHeaderProps {
  year: number
  money: number
  fanbase: number
  totalAwards: number
  activeProjectsCount: number
}

export function GameHeader({
  year,
  money,
  fanbase,
  totalAwards,
  activeProjectsCount,
}: GameHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className={`${_Playfair.className} text-xl font-bold text-foreground tracking-tight`}>
                First Take Studio
              </h1>
              <p className={`${_Montserrat.className} text-sm text-muted-foreground`}>
                Construa seu império cinematográfico
              </p>
            </div>
          </div>

          <div className={`${_Montserrat.className} flex flex-wrap items-center gap-3 md:gap-6`}>
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Ano</span>
                <span className="ml-2 font-bold text-foreground">{year}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Orçamento</span>
                <span className="ml-2 font-bold text-foreground">
                  {formatMoney(money)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Fãs</span>
                <span className="ml-2 font-bold text-foreground">
                  {formatNumber(fanbase)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <Trophy className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Prêmios</span>
                <span className="ml-2 font-bold text-foreground">
                  {totalAwards}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-primary/20 px-3 py-2 rounded-lg border border-primary/30">
              <Film className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Produções</span>
                <span className="ml-2 font-bold text-primary">
                  {activeProjectsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
