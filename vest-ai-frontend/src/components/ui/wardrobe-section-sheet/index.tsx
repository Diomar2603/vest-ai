"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

interface WardrobeSectionSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  sections: Array<{ _id: string; name: string }>
  onSelectSection: (sectionId: string) => void
  itemId: string
}

export function WardrobeSectionSheet({
  isOpen,
  onOpenChange,
  sections,
  onSelectSection,
  itemId
}: WardrobeSectionSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Adicionar ao guarda roupa</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid gap-2">
            {sections.map((section) => (
              <Button
                key={section._id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSelectSection(section._id)}
              >
                {section.name}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}