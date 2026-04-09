import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RncLocus } from './rnc-locus.entity';
import { bigIntTransformer } from 'src/common/utils';

@Entity('rnc_locus_members')
export class RncLocusMember {
  @ApiProperty({ type: Number, example: 1001 })
  @PrimaryColumn({ type: 'integer', name: 'region_id' })
  regionId!: number;

  @ApiProperty({ type: Number, nullable: true, example: 86118093 })
  @PrimaryColumn({
    type: 'integer',
    name: 'locus_id',
    transformer: bigIntTransformer,
  })
  locusId!: number | null;

  @ApiProperty({ type: Number, example: 1001 })
  @PrimaryColumn({ type: 'bigint', name: 'id', transformer: bigIntTransformer })
  locusMemberId!: number;

  @ApiProperty({ type: String, nullable: true, example: 'URS0000A888AB_61622' })
  @Column({ type: 'text', nullable: true, name: 'urs_taxid' })
  ursTaxid!: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'member' })
  @Column({ type: 'varchar', nullable: true })
  membershipStatus!: string | null;

  @ManyToOne(() => RncLocus, (locus) => locus.locusMembers)
  @JoinColumn({ name: 'locus_id', referencedColumnName: 'id' })
  locus!: RncLocus;
}
