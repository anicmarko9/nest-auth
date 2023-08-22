import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from '@home/home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from '@home/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from '@user/decorators/user.decorator';
import { Roles } from '@user/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // home?city=Toronto&minPrice=5000&maxPrice=15000&propertyType=RESIDENTIAL
  @Get()
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return await this.homeService.getHomes(filters);
  }

  @Get(':id')
  async getHome(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HomeResponseDto> {
    return await this.homeService.getHomeById(id);
  }

  @Roles(UserType.REALTOR)
  @Post()
  async createHome(
    @Body() body: CreateHomeDto,
    @User() user: UserInfo,
  ): Promise<HomeResponseDto> {
    return await this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR)
  @Patch(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ): Promise<HomeResponseDto> {
    const realtor = await this.homeService.getRealtorByHomeId(user.id);
    if (realtor.id !== user.id) throw new UnauthorizedException();
    return await this.homeService.updateHomeById(id, body);
  }

  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ): Promise<void> {
    const realtor = await this.homeService.getRealtorByHomeId(user.id);
    if (realtor.id !== user.id) throw new UnauthorizedException();
    return await this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post(':id/inquire')
  async inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDto,
  ) {
    return await this.homeService.inquire(user, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get(':id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();
    return await this.homeService.getMessagesByHome(id);
  }
}
