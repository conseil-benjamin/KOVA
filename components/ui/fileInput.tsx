'use client'

import { useState, useRef } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Upload, Image as ImageIcon, X } from "lucide-react"

type InputFileProps = {
    handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
    preview: string | null
    setPreview: (preview: string | null) => void
    /** Vide aussi le fichier côté formulaire : effacer le seul preview laissait l'image partir à l'inscription. */
    onClear?: () => void
    /** "dropzone" : grande zone de glisser-déposer (desktop). "compact" : ligne avatar + bouton (mobile). */
    variant?: "dropzone" | "compact"
    /** Les deux variantes cohabitent dans la page d'auth : l'id du champ doit rester unique. */
    id?: string
}

export function InputFile({ handleImageUpload, preview, setPreview, onClear, variant = "dropzone", id = "picture" }: InputFileProps) {
    const [dragActive, setDragActive] = useState(false)
    const [fileName, setFileName] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = e.dataTransfer.files
        if (files && files[0]) {
            handleFile(files[0])
        }
    }

    const handleFile = (file: File) => {
        // Vérifier que c'est une image
        if (!file.type.startsWith("image/")) {
            return
        }

        setFileName(file.name)

        // Créer un preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Appeler le handler original
        const event = new Event("change", { bubbles: true })
        Object.defineProperty(event, "target", {
            value: { files: { 0: file, length: 1 } },
            enumerable: true,
        })
        handleImageUpload?.(event as any)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            handleFile(files[0])
        }
        handleImageUpload?.(e)
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(null)
        setFileName("")
        if (inputRef.current) {
            inputRef.current.value = ""
        }
        onClear?.()
    }

    const hiddenInput = (
        <input
            ref={inputRef}
            id={id}
            type="file"
            onChange={handleInputChange}
            accept="image/*"
            className="hidden"
        />
    )

    // Variante mobile : une simple ligne (vignette ronde + action), assez basse
    // pour tenir dans le formulaire sans le rallonger.
    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleClick}
                    aria-label={preview ? "Changer la photo de profil" : "Ajouter une photo de profil"}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full transition-all active:scale-95 ${
                        preview
                            ? "border border-white/10"
                            : "border-2 border-dashed border-white/20 bg-[#0a0a0f] text-slate-500"
                    }`}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </button>

                <div className="min-w-0 flex-1">
                    <button
                        type="button"
                        onClick={handleClick}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm font-bold text-white transition active:scale-95"
                    >
                        <Upload size={14} className="text-purple-400" />
                        {preview ? "Changer la photo" : "Ajouter une photo"}
                    </button>
                    <p className="mt-1.5 truncate text-[11px] text-slate-500">
                        {preview ? fileName || "Image sélectionnée" : "PNG, JPG, GIF jusqu'à 10MB"}
                    </p>
                </div>

                {preview && (
                    <button
                        type="button"
                        onClick={clearFile}
                        aria-label="Retirer la photo"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition active:bg-white/10"
                    >
                        <X size={16} />
                    </button>
                )}

                {hiddenInput}
            </div>
        )
    }

    return (
        <Field>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`relative group cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 ${
                    dragActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                } ${preview ? "border-solid border-purple-200 dark:border-purple-800" : ""}`}
            >
                {/* Preview */}
                {preview ? (
                    <div className="relative h-64 w-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        <button
                            onClick={clearFile}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <X size={18} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white text-sm font-medium truncate">
                                {fileName}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 px-4 text-center">
                        <div className="flex justify-center mb-4">
                            <div className={`p-3 rounded-full transition-all duration-300 ${
                                dragActive
                                    ? "bg-purple-500 text-white scale-110"
                                    : "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-105"
                            }`}>
                                {dragActive ? (
                                    <Upload size={24} />
                                ) : (
                                    <ImageIcon size={24} />
                                )}
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-100 mb-2">
                            Glissez votre image ici
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            ou cliquez pour parcourir vos fichiers
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            PNG, JPG, GIF jusqu'à 10MB
                        </p>
                    </div>
                )}

                {/* Hidden Input */}
                {hiddenInput}
            </div>
        </Field>
    )
}
