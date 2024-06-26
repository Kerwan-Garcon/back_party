import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateLocationDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsString()
  country: string;

  @IsString()
  zipCode: string;
}

class CreateGameDto {
  @IsString()
  name: string;
}

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @Type(() => Date)
  time: Date;

  @IsInt()
  remainingSpots: number;

  @IsString()
  description: string;

  @IsBoolean()
  isPaid: boolean;

  @IsOptional()
  @IsBoolean()
  bringDrinks?: boolean;

  @IsOptional()
  @IsBoolean()
  bringGames?: boolean;

  @IsOptional()
  @IsBoolean()
  bringEquipment?: boolean;

  @IsOptional()
  @IsString()
  equipmentDetails?: string;

  @IsOptional()
  @IsString()
  drinksDetails?: string;

  @IsInt()
  organizerId: number;

  @ValidateNested()
  @Type(() => CreateLocationDto)
  location?: CreateLocationDto;

  @ValidateNested({ each: true })
  @Type(() => CreateGameDto)
  games?: CreateGameDto[];
}
