import FormField from '@awsui/components-react/form-field';
import type { ChangeEvent, ReactElement } from 'react';

interface Props {
  readonly onChange: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

export default function SpriteSheet2GifImageFileInput({
  onChange,
}: Props): ReactElement {
  return (
    <FormField
      description="Only GIF, JPEG, and PNG images are supported."
      label="Sprite sheet image file"
    >
      <input accept="image/*" onChange={onChange} required type="file" />
    </FormField>
  );
}