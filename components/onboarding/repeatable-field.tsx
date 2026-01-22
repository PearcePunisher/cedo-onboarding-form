"use client"

import type React from "react"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RepeatableFieldProps<T> {
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  addLabel: string
}

export function RepeatableField<T>({ items, onAdd, onRemove, renderItem, addLabel }: RepeatableFieldProps<T>) {
  
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="relative p-4 rounded-lg bg-muted/30 border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {renderItem(item, index)}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={onAdd} className="gap-2 bg-transparent">
        <Plus className="w-4 h-4" />
        {addLabel}
      </Button>
    </div>
  )
}
