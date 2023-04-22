import { PropertyType } from 'prisma/prisma-client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
export class HomeResponseDto {
  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }

  id: number;
  address: string;
  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.numberOfBedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBethrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  city: string;
  @Exclude()
  listed_date: Date;
  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }
  price: number;

  @Exclude()
  Images: Date;
  @Expose({ name: 'images' })
  images() {
    return this.Images;
  }

  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.landSize;
  }

  image: string;

  @Exclude()
  property_type: PropertyType;
  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNumber()
  @IsPositive()
  numbeOfBedrooms: number;
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  landSize: number;
  @IsEnum(PropertyType)
  propertyType: PropertyType;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numbeOfBedrooms?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}
