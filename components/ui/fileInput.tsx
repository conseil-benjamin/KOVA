'use client'

import { useState, useRef } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Upload, Image as ImageIcon, X } from "lucide-react"

export function InputFile({ handleImageUpload }) {
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
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
    }

    return (
        <Field>
            <FieldLabel>Image</FieldLabel>
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
                <input
                    ref={inputRef}
                    id="picture"
                    type="file"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </Field>
    )
}