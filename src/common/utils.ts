import { ValueTransformer } from 'typeorm';

export const bigIntTransformer: ValueTransformer = {
  to: (value: bigint | null) => (value === null ? null : value.toString()),
  from: (value: string | bigint | null) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'bigint') return value;
    return BigInt(value);
  },
};
