"use client"

import * as React from "react"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface DeleteProductButtonProps {
  productId: number
  productName: string
  onDelete: (id: number) => Promise<void>
}

export function DeleteProductButton({ productId, productName, onDelete }: DeleteProductButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(productId)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="destructive" size="sm" className="h-8 w-8 p-0 rounded-md">
          <Trash2 className="h-4 w-4" />
        </Button>}
      />
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-destructive/20 shadow-2xl">
        <DialogHeader className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-black uppercase tracking-tighter text-destructive">
              CONFIRM DELETION
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              Are you absolutely sure you want to remove <span className="font-bold text-foreground">"{productName}"</span> from the inventory? This action is permanent.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 font-bold uppercase tracking-widest text-[10px]"
            disabled={isDeleting}
          >
            CANCEL
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1 font-bold uppercase tracking-widest text-[10px]"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                REMOVING...
              </>
            ) : (
              "DELETE"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
