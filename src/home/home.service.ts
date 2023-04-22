import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from 'prisma/prisma-client';

type GetHomesParams = {
  propertyType?: PropertyType;
  price?: {
    gte?: number;
    lte?: number;
  };
  city?: string;
};

type CreateHomeParams = {
  address: string;
  numbeOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: {
    url: string;
  }[];
};

type UpdateHomeParams = {
  address?: string;
  numbeOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filter: GetHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      where: filter,
      include: { Image: { take: 1, select: { url: true } } },
    });
    if (!homes.length) {
      throw new NotFoundException();
    }
    return homes.map((home) => {
      const newHome = { ...home, image: home.Image[0].url };
      delete newHome.Image;
      return new HomeResponseDto(newHome);
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      include: { Image: true },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome(
    {
      address,
      numbeOfBedrooms,
      numberOfBathrooms,
      city,
      landSize,
      price,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        property_type: propertyType,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numbeOfBedrooms,
        land_size: landSize,
        realtor_id: userId,
      },
    });
    const homeImages = images.map((image) => ({
      url: image.url,
      home_id: home.id,
    }));
    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDto(home);
  }

  async updateHomeById({
    data: {
      address,
      city,
      landSize,
      numbeOfBedrooms,
      numberOfBathrooms,
      price,
      propertyType,
    },
    id,
  }: {
    data: UpdateHomeParams;
    id: number;
  }) {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) {
      throw new NotFoundException();
    }

    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data: {
        address,
        city,
        price,
        property_type: propertyType,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numbeOfBedrooms,
        land_size: landSize,
        realtor_id: 5,
      },
    });
    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({
      where: { home_id: { equals: id } },
    });
    await this.prismaService.home.delete({
      where: { id },
    });
  }

  async getRealtorByHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    if (!home) {
      throw new NotFoundException();
    }
    return home.realtor;
  }
}
