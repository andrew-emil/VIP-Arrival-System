import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@ApiTags('Feed')
@ApiSecurity('api-key')
@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }

    @Get()
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
