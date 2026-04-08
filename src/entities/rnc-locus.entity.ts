import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  ValueTransformer,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RncLocusMember } from './rnc-locus-member.entity';

const bigIntTransformer: ValueTransformer = {
  to: (value: bigint | null) => (value === null ? null : value.toString()),
  from: (value: string | bigint | null) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'bigint') return value;
    return BigInt(value);
  },
};

@Entity('rnc_locus')
export class RncLocus {
  @ApiProperty({ type: Number, example: 1 })
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @ApiProperty({ type: String, nullable: true, example: 'GRCh38' })
  @Column({ type: 'varchar', nullable: true })
  assemblyId!: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'LOCUS_X' })
  @Column({ type: 'varchar', nullable: true })
  locusName!: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'Locus X' })
  @Column({ type: 'varchar', nullable: true })
  publicLocusName!: string | null;

  @ApiProperty({ type: String, nullable: true, example: '1' })
  @Column({ type: 'varchar', nullable: true })
  chromosome!: string | null;

  @ApiProperty({ type: String, nullable: true, example: '+' })
  @Column({ type: 'varchar', nullable: true })
  strand!: string | null;

  @ApiProperty({ type: String, nullable: true, example: '123456789' })
  @Column({ type: 'bigint', nullable: true, transformer: bigIntTransformer })
  locusStart!: bigint | null;

  @ApiProperty({ type: String, nullable: true, example: '123456999' })
  @Column({ type: 'bigint', nullable: true, transformer: bigIntTransformer })
  locusStop!: bigint | null;

  @ApiProperty({ type: Number, nullable: true, example: 3 })
  @Column({ type: 'integer', nullable: true })
  memberCount!: number | null;

  @OneToMany(() => RncLocusMember, (member) => member.locus)
  locusMembers!: RncLocusMember[];
}
