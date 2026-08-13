"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  // Une valeur hors bornes déborderait de la piste.
  const percent = Math.min(100, Math.max(0, value ?? 0))

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        // Couleurs explicites plutôt que les tokens de thème : l'app est sombre
        // en dur, sans classe `dark` sur <html>, donc --primary reste la valeur
        // du thème clair (quasi noire) et le remplissage était invisible.
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10 shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full rounded-full bg-purple-500 transition-[width] duration-700 ease-out"
        // Largeur plutôt que translateX : la portion remplie est dessinée là où
        // elle est, sans décaler un indicateur large de 100 %.
        style={{ width: `${percent}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
