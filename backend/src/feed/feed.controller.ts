import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Feed')
@ApiSecurity('api-key')
@Controller('feed')
@UseGuards(RolesGuard)
export class FeedController {
    constructor(private readonly feedService: FeedService) { }

    @Get()
    @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER)
    @ApiOperation({ summary: 'Get live feed of plate reads' })
    @ApiQuery({ name: 'since', required: false, description: 'ISO date string to fetch records after' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
    @ApiQuery({ name: 'isVip', required: false, description: 'Filter only VIP reads (true/false)' })
    @ApiResponse({ status: 200, description: 'List of plate reads.' })
    getFeed(
        @Query('since') since?: string,
        @Query('limit') limit?: string,
        @Query('isVip') isVip?: string,
    ) {
        return this.feedService.getFeed({ since, limit: limit ?? "50", isVip });
    }
}
