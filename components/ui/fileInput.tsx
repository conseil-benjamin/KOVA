import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputFile({ handleImageUpload }) {
    return (
        <Field>
            {}
            <Input
                id="picture"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
            />
            <FieldDescription className={'transition-[color,box-shadow]'}>
                Select a picture to upload.
            </FieldDescription>
        </Field>
    )
}