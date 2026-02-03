import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }

    @Get()
    getFeed(
        @Query('since') since?: string,
        @Query('limit') limit?: string,
        @Query('isVip') isVip?: string,
    ) {
        return "getFeed not implemented"
    }
}
