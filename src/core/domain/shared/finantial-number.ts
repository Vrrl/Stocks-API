import { ValueObject } from '@src/core/domain/value-object';
import * as CoreErrors from '@src/core/errors';
import { z } from 'zod';

const FinantialNumberProps = z.object({
  value: z.number(),
  trailingZeroCount: z.number().min(0).max(50).optional().default(2),
});

type FinantialNumberProps = z.infer<typeof FinantialNumberProps>;
type FinantialNumberPropsInput = z.input<typeof FinantialNumberProps>;

export class FinantialNumber extends ValueObject<FinantialNumberProps> {
  private constructor(props: FinantialNumberProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  get formatedValue(): string {
    const numberString = this.props.value.toString();
    const decimalIndex = numberString.length - this.props.trailingZeroCount;
    const integerPart = numberString.substring(0, decimalIndex);
    const decimalPart = numberString.substring(decimalIndex);

    return `${integerPart}.${decimalPart}`;
  }

  public static create(props: FinantialNumberPropsInput): FinantialNumber {
    const validator = FinantialNumberProps.safeParse(props);

    if (!validator.success) throw new CoreErrors.InvalidPropsError(validator.error.issues[0].message);

    return new FinantialNumber(validator.data);
  }
}
