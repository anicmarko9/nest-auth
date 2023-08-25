import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';

import { PrismaService } from '@Prisma/prisma.service';
import { HomeController } from '@Home/home.controller';
import { HomeService } from '@Home/home.service';

const mockUser = {
  id: 54,
  name: 'Marko',
  email: 'anicmarko9@gmail.com',
  phone: '555 555 5555',
};

const mockHome = {
  id: 1,
  address: '2345 William Str',
  city: '2Toronto',
  price: 1500000,
  property_type: PropertyType.RESIDENTIAL,
  image: 'img1',
  number_of_bedrooms: 3,
  number_of_bathrooms: 2.5,
};

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(homeService).toBeDefined();
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      // it doesn't matter what fn returns, arguments matter
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);

      await controller.getHomes('Toronto', '1500000');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Toronto',
        price: {
          gte: 1500000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      id: 30,
      name: 'Marko',
      iat: 1,
      exp: 2,
    };
    const mockUpdateHomeParams = {
      address: '111 Yellow Str',
      city: 'Vancouver',
      price: 1250000,
      propertyType: PropertyType.RESIDENTIAL,
      landSize: 4444,
      numberOfBedrooms: 2,
      numberOfBathrooms: 2,
    };
    it('should throw an unauthorized error if realtor did not create home', async () => {
      await expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should update home if realtor id is valid', async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockUpdateHome);

      await controller.updateHome(5, mockUpdateHomeParams, {
        ...mockUserInfo,
        id: 54,
      });

      // makes sure that service is called without throwing an error
      expect(mockUpdateHome).toBeCalled();
    });
  });
});
