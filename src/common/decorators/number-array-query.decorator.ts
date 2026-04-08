import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export function NumberArrayQueryParam(): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Transform(({ value }: { value: unknown }): number[] | undefined => {
      if (value === undefined || value === null) return undefined;
      const arr = Array.isArray(value) ? value : [value];
      const nums = arr.map((v) => Number(v));
      return nums.filter((n) => !isNaN(n));
    }),
    IsArray(),
    IsNumber({}, { each: true }),
  );
}
